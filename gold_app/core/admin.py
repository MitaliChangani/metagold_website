from django.contrib import admin
from .models import Transaction, BuyGold, SellGold, UserProfile

admin.site.register(Transaction)
admin.site.register(BuyGold)
admin.site.register(SellGold)
admin.site.register(UserProfile)
