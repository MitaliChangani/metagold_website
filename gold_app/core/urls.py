from django.urls import path
from .views import WalletView, BuyGoldView, SellGoldView, TransactionHistoryView, LoginView, LogoutView, RegisterView

urlpatterns = [
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('buy-gold/', BuyGoldView.as_view(), name='buy-gold'),
    path('sell-gold/', SellGoldView.as_view(), name='sell-gold'),
    path('transactions/', TransactionHistoryView.as_view(), name='transactions'),
     path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]
