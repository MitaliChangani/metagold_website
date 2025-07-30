from django.db import models
from django.contrib.auth.models import User
from django.db.models import DecimalField
from django.utils import timezone

# User profile with balance
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    gold_balance = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)  # in grams
    rupee_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username}"

# Generic Transaction (buy or sell)
class Transaction(models.Model):
    TRANSACTION_TYPE = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE)
    gold_amount = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)  # in grams
    rupee_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)  # in rupees
    gold_price_per_gram = models.DecimalField(max_digits=10, decimal_places=2)  # price at the time of transaction
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.transaction_type} {self.gold_amount}g"

# Buy gold (linked to transaction)
class BuyGold(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True, blank=True)
    amount_in_rupees = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    gold_in_grams = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)
    is_approved = models.BooleanField(default=False)  # admin approval
    timestamp = models.DateTimeField(default=timezone.now)
    

# Sell gold (linked to transaction)
class SellGold(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=None, null=True, blank=True)
    gold_in_grams = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)
    amount_in_rupees = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    is_approved = models.BooleanField(default=False)  # admin approval
    timestamp = models.DateTimeField(default=timezone.now)


