from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Transaction, BuyGold, SellGold

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']


# Transaction Serializer
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


# BuyGold Serializer (nested writeable transaction)
class BuyGoldSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer()

    class Meta:
        model = BuyGold
        fields = ['id', 'transaction']

    def create(self, validated_data):
        transaction_data = validated_data.pop('transaction')
        transaction = Transaction.objects.create(**transaction_data)
        buy_gold = BuyGold.objects.create(transaction=transaction)
        return buy_gold


# SellGold Serializer (nested writeable transaction)
class SellGoldSerializer(serializers.ModelSerializer):
    transaction = TransactionSerializer()

    class Meta:
        model = SellGold
        fields = ['id', 'transaction']

    def create(self, validated_data):
        transaction_data = validated_data.pop('transaction')
        transaction = Transaction.objects.create(**transaction_data)
        sell_gold = SellGold.objects.create(transaction=transaction)
        return sell_gold
