from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Transaction, BuyGold, SellGold, UserProfile
from .serializers import (
    TransactionSerializer,
    BuyGoldSerializer,
    SellGoldSerializer,
    UserProfileSerializer,
    RegisterSerializer
)
from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data
        access = tokens.get('access')
        refresh = tokens.get('refresh')

        if access:
            response.set_cookie(
                key="access_token",
                value=access,
                httponly=True,
                secure=True,  # Set to False only in local development (for http)
                samesite="Lax"
            )
        if refresh:
            response.set_cookie(
                key="refresh_token",
                value=refresh,
                httponly=True,
                secure=True,
                samesite="Lax"
            )

        return response


class BuyGoldView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        gold_price = Decimal(request.data.get('gold_price_per_gram'))
        rupee_amount = Decimal(request.data.get('rupee_amount'))
        gold_amount = rupee_amount / gold_price

        transaction = Transaction.objects.create(
            user=request.user,
            transaction_type="BUY",
            gold_amount=gold_amount,
            rupee_amount=rupee_amount,
            gold_price_per_gram=gold_price,
        )

        BuyGold.objects.create(transaction=transaction)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.gold_balance += gold_amount
        profile.rupee_balance -= rupee_amount
        profile.save()

        return Response({"message": "Gold purchased successfully."}, status=201)


class SellGoldView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        gold_price = Decimal(request.data.get('gold_price_per_gram'))
        gold_amount = Decimal(request.data.get('gold_amount'))
        rupee_amount = gold_amount * gold_price

        profile = UserProfile.objects.get(user=request.user)
        if profile.gold_balance < gold_amount:
            return Response({"error": "Not enough gold balance."}, status=400)

        transaction = Transaction.objects.create(
            user=request.user,
            transaction_type="SELL",
            gold_amount=gold_amount,
            rupee_amount=rupee_amount,
            gold_price_per_gram=gold_price,
        )

        SellGold.objects.create(transaction=transaction)

        profile.gold_balance -= gold_amount
        profile.rupee_balance += rupee_amount
        profile.save()

        return Response({"message": "Gold sold successfully."}, status=201)


class WalletView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "User registered successfully.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
