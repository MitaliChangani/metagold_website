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
)
from decimal import Decimal
from django.contrib.auth.models import User


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