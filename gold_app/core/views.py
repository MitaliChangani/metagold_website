from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .models import UserProfile, Transaction, BuyGold, SellGold
from .serializers import  TransactionSerializer
from decimal import Decimal
from django.db import transaction as db_transaction
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.middleware import csrf
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from core.authentication import CustomJWTAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import UserProfile, Transaction, BuyGold, SellGold
from decimal import Decimal
from django.utils import timezone
from django.conf import settings

import razorpay

RAZORPAY_KEY_ID = 'rzp_test_OpXW1lnGMl3ijD'
RAZORPAY_KEY_SECRET = 'DttsFGqzYGKlhsQKPslyTRSH'

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))



# ✅ Wallet View (GET only)
class WalletView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]

    def get(self, request):
        print("Authenticated user:", request.user)
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            wallet_data = {
                "username": request.user.username,
                "gold_balance": user_profile.gold_balance,
                "rupee_balance": user_profile.rupee_balance
            }
            print("Wallet data:", wallet_data)  # Debug log
            return Response(wallet_data)
        except UserProfile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Buy Gold View (POST)
# views.py
class BuyGoldRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            rupee_amount = Decimal(request.data.get("gold_amount"))
            gold_in_grams = Decimal(request.data.get("gold_in_grams"))
        except (TypeError, ValueError):
            return Response({"error": "Invalid input data"}, status=400)

        profile = UserProfile.objects.get(user=request.user)

        if profile.rupee_balance < rupee_amount:
            return Response({"error": "Insufficient balance"}, status=400)

        with db_transaction.atomic():
            profile.rupee_balance -= rupee_amount
            profile.gold_balance += gold_in_grams
            profile.save()

            Transaction.objects.create(
                user=request.user,
                transaction_type='BUY',
                rupee_amount=rupee_amount,
                gold_amount=gold_in_grams,
                gold_price_per_gram=(rupee_amount / gold_in_grams) if gold_in_grams else 0
            )

        return Response({"message": "Gold purchased successfully."}, status=200)


# ✅ Sell Gold View (POST)
class SellGoldView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            gold_price = Decimal(request.data.get('gold_price_per_gram'))
            gold_amount = Decimal(request.data.get('gold_amount'))
            rupee_amount = gold_amount * gold_price
        except (TypeError, ValueError):
            return Response({'error': 'Invalid input data'}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            profile = UserProfile.objects.get(user=request.user)

            if profile.gold_balance < gold_amount:
                return Response({'error': 'Insufficient gold balance'}, status=status.HTTP_400_BAD_REQUEST)

            transaction = Transaction.objects.create(
                user=request.user,
                transaction_type='SELL',
                gold_amount=gold_amount,
                rupee_amount=rupee_amount,
                gold_price_per_gram=gold_price,
            )
            SellGold.objects.create(transaction=transaction)

            # Update user's wallet
            profile.gold_balance -= gold_amount
            profile.rupee_balance += rupee_amount
            profile.save()

        return Response({'message': 'Gold sold successfully'}, status=status.HTTP_201_CREATED)

# ✅ Transaction History View (GET)
class TransactionHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomJWTAuthentication]  # 👈 add this line

    def get(self, request):
        print("Authenticated user:", request.user)
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]  # Use JWT authentication
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            print("Authenticated user:", user.username)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response_data = {
                "message": "Login successful",
                "is_admin": user.is_staff  # Include admin status here
            }
            
            response = Response(response_data, status=status.HTTP_200_OK)
            
            print(response_data)
            
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                httponly=True,
                secure=False,  # Set True in production with HTTPS
                samesite='Lax'
            )
            

            print("✅ Cookie set with token:", access_token[:20] + "...")  # Debug log
            
            return response

        print("❌ Invalid login for:", username)
        return Response({"error": "Invalid credentials"}, status=401)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("access_token")
        return response
    
    
# core/views.py

from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import BuyGold, SellGold
from .serializers import BuyGoldSerializer, SellGoldSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_gold_request(request):
    user = request.user
    gold_in_grams = Decimal(request.data.get('gold_in_grams', 0))
    amount_in_rupees = Decimal(request.data.get('amount_in_rupees', 0))

    # Create the BuyGold request object
    new_request = BuyGold.objects.create(
        user=user,
        gold_in_grams=gold_in_grams,
        amount_in_rupees=amount_in_rupees,
        is_approved=False
    )

    # ✅ Return request ID so frontend can poll for approval
    return Response({
        'message': 'Buy request submitted. Awaiting admin approval.',
        'request_id': new_request.id   # 👈 Add this line
    }, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell_gold_request(request):
    
    user = request.user
    gold_in_grams = Decimal(request.data.get('gold_in_grams', 0))
    amount_in_rupees = Decimal(request.data.get('amount_in_rupees', 0))  # Assuming these are sent in the request body
    
    new_request = SellGold.objects.create(
        user=user,
        gold_in_grams=gold_in_grams,
        amount_in_rupees=amount_in_rupees,
        is_approved=False  # Initially set to False, needs admin approval
    )
    
    return Response({'message': 'Sell request submitted. Awaiting admin approval.',
                     'request_id': new_request.id}, status=201)
    

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_buy_gold(request, request_id):
    buy_request = get_object_or_404(BuyGold, id=request_id, is_approved=False)

    if buy_request.is_approved:
        return Response({'error': 'Buy request already approved'}, status=400)

    profile = get_object_or_404(UserProfile, user=buy_request.user)

    if profile.rupee_balance < buy_request.amount_in_rupees:
        return Response({'error': 'Insufficient rupee balance'}, status=400)

    try:
        admin_user = User.objects.get(username='dell')
        admin_profile = UserProfile.objects.get(user=admin_user)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)

    with db_transaction.atomic():
        # Update user wallet
        profile.rupee_balance -= buy_request.amount_in_rupees
        profile.gold_balance += buy_request.gold_in_grams
        profile.save()

        # Transfer rupees to admin
        admin_profile.rupee_balance += buy_request.amount_in_rupees
        admin_profile.gold_balance -= buy_request.gold_in_grams
        admin_profile.save()

        # Record transaction
        Transaction.objects.create(
            user=buy_request.user,
            transaction_type='BUY',
            gold_amount=buy_request.gold_in_grams,
            rupee_amount=buy_request.amount_in_rupees,
            gold_price_per_gram=buy_request.amount_in_rupees / buy_request.gold_in_grams,
            created_at=buy_request.timestamp
        )

        buy_request.is_approved = True
        buy_request.save()

    print("✅ Admin approved buy request ID:", request_id)
    return Response({
        'message': 'Buy request approved',
        'status': 'aprroved',
        'wallet': {
            'rupee_balance': str(profile.rupee_balance),
            'gold_balance': str(profile.gold_balance)
        }
    }, status=200)
    
    
@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_sell_gold(request, request_id):
    # Get sell request that hasn't been approved yet
    sell_request = get_object_or_404(SellGold, id=request_id, is_approved=False)

    if sell_request.is_approved:
        return Response({'error': 'Sell request already approved'}, status=400)

    # Get user profile of the seller
    profile = get_object_or_404(UserProfile, user=sell_request.user)

    # Get admin profile
    try:
        admin_user = User.objects.get(username='dell')
    except User.DoesNotExist:
        return Response({'error': 'Admin user not found'}, status=404)

    try:
        admin_profile = UserProfile.objects.get(user=admin_user)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Admin profile not found'}, status=404)

    # Validation: check balances
    if profile.gold_balance < sell_request.gold_in_grams:
        return Response({'error': 'Insufficient gold balance'}, status=400)

    if admin_profile.rupee_balance < sell_request.amount_in_rupees:
        return Response({'error': 'Admin has insufficient rupee balance'}, status=400)

    with db_transaction.atomic():
        # Lock rows to avoid race conditions
        profile = UserProfile.objects.select_for_update().get(user=sell_request.user)
        admin_profile = UserProfile.objects.select_for_update().get(user=admin_user)

        # Deduct gold from seller and add rupees
        profile.gold_balance -= sell_request.gold_in_grams
        profile.rupee_balance += sell_request.amount_in_rupees
        profile.save()

        # Deduct rupees from admin and add gold
        admin_profile.rupee_balance -= sell_request.amount_in_rupees
        admin_profile.gold_balance += sell_request.gold_in_grams
        admin_profile.save()

        # Calculate price safely
        price_per_gram = (
            sell_request.amount_in_rupees / sell_request.gold_in_grams
            if sell_request.gold_in_grams else 0
        )

        # Record transaction
        Transaction.objects.create(
            user=sell_request.user,
            transaction_type='SELL',
            gold_amount=sell_request.gold_in_grams,
            rupee_amount=sell_request.amount_in_rupees,
            gold_price_per_gram=price_per_gram,
            created_at=sell_request.timestamp
        )

        # Mark request as approved
        sell_request.is_approved = True
        sell_request.save()

    print("✅ Admin approved sell request ID:", request_id)
    return Response({
        'message': 'Sell request approved',
        'status': 'approved',
        'wallet': {
            'rupee_balance': str(profile.rupee_balance),
            'gold_balance': str(profile.gold_balance)
        }
    }, status=200)


# Check status of a specific buy request
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def buy_request_status(request, request_id):
    try:
        buy = BuyGold.objects.get(id=request_id, user=request.user)
        return Response({'is_approved': buy.is_approved})
    except BuyGold.DoesNotExist:
        return Response({'error': 'Buy request not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sell_request_status(request, request_id):
    try:
        sell = SellGold.objects.get(id=request_id, user=request.user)
        return Response({'is_approved': sell.is_approved})
    except SellGold.DoesNotExist:
        return Response({'error': 'Sell request not found'}, status=404)

    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .models import BuyGold, SellGold
from .serializers import BuyGoldSerializer, SellGoldSerializer

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_buy_requests(request):
    buy_requests = BuyGold.objects.filter(is_approved=False).order_by('-timestamp')
    serializer = BuyGoldSerializer(buy_requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_sell_requests(request):
    sell_requests = SellGold.objects.filter(is_approved=False).order_by('-timestamp')
    serializer = SellGoldSerializer(sell_requests, many=True)
    return Response(serializer.data)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    return Response({'detail': 'Authenticated'}, status=200)


from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_buy_requests(request):
    user = request.user
    buy_requests = BuyGold.objects.filter(user=user).order_by('-timestamp')
    serializer = BuyGoldSerializer(buy_requests, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_sell_requests(request):
    user = request.user
    sell_requests = SellGold.objects.filter(user=user).order_by('-timestamp')
    serializer = SellGoldSerializer(sell_requests, many=True)
    return Response(serializer.data)


from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import razorpay

from .models import BuyGold, SellGold

class CreateRazorpayOrder(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_id = request.data.get("request_id")
        order_type = request.data.get("type")  # 'buy' or 'sell'

        if not request_id or order_type not in ("buy", "sell"):
            return Response(
                {"detail": "Missing or invalid parameters: 'request_id' and 'type' are required."},
                status=400
            )

        Model = BuyGold if order_type == "buy" else SellGold
        gold_request = get_object_or_404(Model, id=request_id, user=request.user)

        if not getattr(gold_request, "is_approved", False):
            return Response({"detail": "Request not approved"}, status=403)

        try:
            amount_rupees = Decimal(gold_request.amount_in_rupees)
            amount_paise = int(amount_rupees * 100)  # INR -> paise
            if amount_paise < 100:
                return Response({"detail": "Amount must be at least ₹1 (100 paise)."}, status=400)
        except (InvalidOperation, TypeError):
            return Response({"detail": "Invalid amount on request."}, status=400)

        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
            })
        except Exception as e:
            return Response({"detail": "Failed to create Razorpay order", "error": str(e)}, status=502)

        # Map fields your frontend expects and include public key
        return Response({
            "order_id": order.get("id"),
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "status": order.get("status"),
            "key": settings.RAZORPAY_KEY_ID,
        }, status=201)



from decimal import Decimal, InvalidOperation
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import razorpay
from django.conf import settings

from .models import BuyGold, SellGold, Transaction, UserProfile  # adjust import paths as needed
import traceback
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    payload = request.data

    # 1) Validate basic payload
    required = ["request_id", "type", "razorpay_order_id", "razorpay_payment_id", "razorpay_signature"]
    missing = [k for k in required if not payload.get(k)]
    if missing:
        return Response({"error": "Missing required fields", "fields": missing}, status=400)

    order_type = payload.get("type")
    if order_type not in ("buy", "sell"):
        return Response({"error": "Invalid type. Expected 'buy' or 'sell'."}, status=400)

    try:
        request_id = int(payload.get("request_id"))
    except (TypeError, ValueError):
        return Response({"error": "request_id must be an integer"}, status=400)

    razorpay_order_id = payload.get("razorpay_order_id")
    razorpay_payment_id = payload.get("razorpay_payment_id")
    razorpay_signature = payload.get("razorpay_signature")

    # 2) Verify Razorpay signature early; return 400 on failure
    try:
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({"error": "Invalid payment signature"}, status=400)

    # 3) Fetch the request object (buy/sell)
    Model = BuyGold if order_type == "buy" else SellGold
    gold_request = get_object_or_404(Model, id=request_id, user=request.user)

    # Optional consistency check: ensure the order IDs match what you created earlier
    # if hasattr(gold_request, "razorpay_order_id") and gold_request.razorpay_order_id != razorpay_order_id:
    #     return Response({"error": "Order ID mismatch"}, status=400)

    if not getattr(gold_request, "is_approved", False):
        return Response({"error": "Request not approved by admin."}, status=403)

    # Idempotency: if already processed, return success without mutating balances again
    if getattr(gold_request, "processed", False):
        return Response({"message": "Payment already verified"}, status=200)

    # 4) Apply wallet mutation atomically and idempotently
    try:
        with transaction.atomic():
            # Lock profile row to prevent race conditions
            profile, _ = UserProfile.objects.select_for_update().get_or_create(
                user=request.user,
                defaults={"gold_balance": Decimal("0"), "rupee_balance": Decimal("0")}
            )

            # Coerce to Decimal; validate amounts
            try:
                grams = Decimal(gold_request.gold_in_grams)
                amount = Decimal(gold_request.amount_in_rupees)
            except (InvalidOperation, TypeError):
                return Response({"error": "Invalid numeric amounts on request"}, status=400)

            if grams <= 0 or amount <= 0:
                return Response({"error": "Amounts must be greater than zero"}, status=400)

            # Apply balances
            if order_type == "buy":
                profile.gold_balance = Decimal(profile.gold_balance) + grams
                profile.rupee_balance = Decimal(profile.rupee_balance) - amount
                transaction_type = "buy"
            else:
                if Decimal(profile.gold_balance) < grams:
                    return Response({"error": "Not enough gold to sell."}, status=400)
                profile.gold_balance = Decimal(profile.gold_balance) - grams
                profile.rupee_balance = Decimal(profile.rupee_balance) + amount
                transaction_type = "sell"

            profile.save()

            # Record transaction
            price_per_gram = amount / grams  # safe due to grams > 0
            Transaction.objects.create(
                user=request.user,
                transaction_type=transaction_type,
                gold_amount=grams,
                rupee_amount=amount,
                gold_price_per_gram=price_per_gram,
                provider_payment_id=razorpay_payment_id,
                provider_order_id=razorpay_order_id,
            )

            # Mark request processed instead of deleting (keeps audit trail + idempotency)
            setattr(gold_request, "processed", True)
            if hasattr(gold_request, "processed_at"):
                gold_request.processed_at = timezone.now()
            if hasattr(gold_request, "razorpay_payment_id"):
                gold_request.razorpay_payment_id = razorpay_payment_id
            gold_request.save()

        return Response({"message": "Payment verified and wallet updated"}, status=200)


    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)




# views.py
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import Http404
from decimal import Decimal
import razorpay
from django.conf import settings

razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateRazorpaySellOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request_id = request.data.get("request_id")
        if not request_id:
            return Response({"detail": "Request ID missing"}, status=400)

        try:
            is_admin = bool(getattr(request.user, "is_staff", False) or getattr(request.user, "is_superuser", False))
            if is_admin:
                sell_request = get_object_or_404(SellGold, id=request_id)
            else:
                sell_request = get_object_or_404(SellGold, id=request_id, user=request.user)

            if not sell_request.is_approved:
                return Response({"detail": "Request not approved by admin."}, status=403)

            amount_rupees = Decimal(str(sell_request.amount_in_rupees))
            amount_paise = int(amount_rupees * 100)
            if amount_paise <= 0:
                return Response({"detail": "Invalid amount"}, status=400)

            order = razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": 1,
                "receipt": f"sell-{sell_request.id}"
            })

            return Response({
                "key_id": settings.RAZORPAY_KEY_ID,
                "order_id": order["id"],
                "amount": amount_paise,
                "currency": "INR",
                "sell_request_id": sell_request.id
            }, status=200)

        except Http404:
            # Proper 404 instead of masked 500
            return Response({"detail": "Sell request not found"}, status=404)
        except Exception as e:
            print("CreateRazorpaySellOrder ERROR:", str(e))
            return Response({"detail": "Something went wrong", "error": str(e)}, status=500)




from django.http import Http404

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
@csrf_exempt
def verify_sell_payment(request):
    data = request.data
    request_id = data.get("request_id")
    if not request_id:
        return Response({"detail": "Request ID is required."}, status=400)

    try:
        is_admin = bool(getattr(request.user, "is_staff", False) or getattr(request.user, "is_superuser", False))
        if is_admin:
            sell_request = get_object_or_404(SellGold, id=request_id)
        else:
            sell_request = get_object_or_404(SellGold, id=request_id, user=request.user)
    except Http404:
        return Response({"detail": "Sell request not found"}, status=404)

    if not sell_request.is_approved:
        return Response({"detail": "Sell request not approved."}, status=403)

    # Optionally: verify Razorpay signature here

    user_profile = UserProfile.objects.get(user=sell_request.user)

    if user_profile.gold_balance < sell_request.gold_in_grams:
        return Response({"detail": "Insufficient gold in wallet."}, status=400)

    # Update wallet
    user_profile.gold_balance -= sell_request.gold_in_grams
    user_profile.rupee_balance += sell_request.amount_in_rupees
    user_profile.save()

    # Create transaction
    Transaction.objects.create(
        user=sell_request.user,
        transaction_type='sell',
        gold_amount=sell_request.gold_in_grams,
        rupee_amount=sell_request.amount_in_rupees,
        gold_price_per_gram=sell_request.amount_in_rupees / sell_request.gold_in_grams
    )

    sell_request.delete()  # only after successful payment

    return Response({"detail": "Sell payment successful and wallet updated."})

# views.py (add this helper)
def verify_razorpay_signature(order_id: str, payment_id: str, signature: str):
    """
    Returns True if signature is valid, else raises razorpay.errors.SignatureVerificationError
    """
    payload = {
        'razorpay_order_id': order_id,
        'razorpay_payment_id': payment_id,
        'razorpay_signature': signature,
    }
    razorpay_client.utility.verify_payment_signature(payload)
    return True


class CreateRazorpayBuyOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            amount_rupees = request.data.get("amount")
            if not amount_rupees:
                return Response({"detail": "Amount is required"}, status=400)

            try:
                amount_rupees = float(amount_rupees)
                amount_paise = int(amount_rupees * 100)  # Razorpay works in paise
            except ValueError:
                return Response({"detail": "Invalid amount"}, status=400)

            payment = razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": "1"
            })

            return Response({
                "order_id": payment["id"],
                "amount": amount_paise,
                "currency": "INR",
                "key": settings.RAZORPAY_KEY_ID  # send public key to frontend
            })

        except Exception as e:
            print("CreateRazorpayBuyOrder ERROR:", str(e))
            return Response({"detail": "Something went wrong", "error": str(e)}, status=500)
