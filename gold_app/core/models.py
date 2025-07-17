# Create your models here.

from django.db import models
from django.contrib.auth.models import User

# User profile with balance
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Contact & Personal Info
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    pincode = models.CharField(max_length=10)

    # Balance Info
    gold_balance = models.DecimalField(max_digits=10, decimal_places=4, default=0.0)  # grams
    rupee_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.user.username} ({self.full_name})"

# Generic Transaction (buy or sell)
class Transaction(models.Model):
    TRANSACTION_TYPE = (
        ('BUY', 'Buy'),
        ('SELL', 'Sell'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_TYPE)
    gold_amount = models.DecimalField(max_digits=10, decimal_places=4)  # in grams
    rupee_amount = models.DecimalField(max_digits=12, decimal_places=2)
    gold_price_per_gram = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} {self.transaction_type} {self.gold_amount}g"


# Buy gold (linked to transaction)
class BuyGold(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE)

    def __str__(self):
        return f"Buy: {self.transaction}"


# Sell gold (linked to transaction)
class SellGold(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE)

    def __str__(self):
        return f"Sell: {self.transaction}"


# Gold history – daily log or summary
class GoldHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gold_balance = models.DecimalField(max_digits=10, decimal_places=4)
    rupee_balance = models.DecimalField(max_digits=12, decimal_places=2)
    log_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} @ {self.log_time}"
