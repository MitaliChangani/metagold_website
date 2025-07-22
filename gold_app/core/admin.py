from django.contrib import admin
from .models import UserProfile, Transaction, BuyGold, SellGold

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'full_name', 'phone_number', 'address',
        'city', 'state', 'pincode',
        'gold_balance', 'rupee_balance'
    )
    search_fields = ('user__username', 'full_name', 'phone_number', 'city')
    list_filter = ('state',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'transaction_type', 'gold_amount', 'rupee_amount',
        'gold_price_per_gram', 'created_at'
    )
    list_filter = ('transaction_type', 'created_at')
    search_fields = ('user__username',)

@admin.register(BuyGold)
class BuyGoldAdmin(admin.ModelAdmin):
    list_display = ('transaction',)

@admin.register(SellGold)
class SellGoldAdmin(admin.ModelAdmin):
    list_display = ('transaction',)



