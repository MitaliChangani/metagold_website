from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Transaction, BuyGold, SellGold

# UserProfile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']


# BuyGold Serializer (nested writeable transaction)
class BuyGoldSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = BuyGold
        fields = '__all__'
        read_only_fields = ['user', 'is_approved', 'timestamp']

class SellGoldSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = SellGold
        fields = '__all__'
        read_only_fields = ['user', 'is_approved', 'timestamp']



from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['transaction_type', 'gold_amount', 'rupee_amount', 'gold_price_per_gram', 'created_at']
