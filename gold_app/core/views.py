from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .models import UserProfile, Transaction, BuyGold, SellGold
from .serializers import UserProfileSerializer, TransactionSerializer
from decimal import Decimal
from django.db import transaction as db_transaction
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.middleware import csrf
from django.http import JsonResponse


# ✅ Wallet View (GET only)
class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.userprofile  # assuming user has profile

        return Response({
            'full_name': user.first_name + ' ' + user.last_name,
            'gold_balance': profile.gold_balance,
            'rupee_balance': profile.rupee_balance
        })


# ✅ Buy Gold View (POST)
class BuyGoldView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            gold_price = Decimal(request.data.get('gold_price_per_gram'))
            rupee_amount = Decimal(request.data.get('rupee_amount'))
            gold_amount = rupee_amount / gold_price
        except (TypeError, ValueError):
            return Response({'error': 'Invalid input data'}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            profile = UserProfile.objects.get(user=request.user)

            if profile.rupee_balance < rupee_amount:
                return Response({'error': 'Insufficient rupee balance'}, status=status.HTTP_400_BAD_REQUEST)

            transaction = Transaction.objects.create(
                user=request.user,
                transaction_type='BUY',
                gold_amount=gold_amount,
                rupee_amount=rupee_amount,
                gold_price_per_gram=gold_price,
            )
            BuyGold.objects.create(transaction=transaction)

            # Update user's wallet
            profile.gold_balance += gold_amount
            profile.rupee_balance -= rupee_amount
            profile.save()

        return Response({'message': 'Gold bought successfully'}, status=status.HTTP_201_CREATED)

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

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User registered successfully"}, status=201)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            response = Response({'message': 'Login successful'}, status=200)

            # Set cookies
            response.set_cookie('access', str(refresh.access_token), httponly=True, samesite='Lax')
            response.set_cookie('refresh', str(refresh), httponly=True, samesite='Lax')
            return response
        return Response({'error': 'Invalid credentials'}, status=401)

class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie("jwt")
        return response