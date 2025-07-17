from django.urls import path
from .views import BuyGoldView, SellGoldView, WalletView, TransactionListView

urlpatterns = [
    path('buy-gold/', BuyGoldView.as_view()),
    path('sell-gold/', SellGoldView.as_view()),
    path('wallet/', WalletView.as_view()),
    path('transactions/', TransactionListView.as_view()),
]
