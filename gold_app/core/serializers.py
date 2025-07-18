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

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user