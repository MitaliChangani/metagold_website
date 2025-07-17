from rest_framework import serializers
from .models import UserProfile, Transaction, BuyGold, SellGold, GoldHistory
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class BuyGoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyGold
        fields = '__all__'

class SellGoldSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellGold
        fields = '__all__'

class GoldHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GoldHistory
        fields = '__all__'
