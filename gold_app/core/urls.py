from django.urls import path
from .views import BuyGoldView, SellGoldView, WalletView, TransactionListView, RegisterView, CookieTokenObtainPairView, LogoutView

urlpatterns = [
    path('buy-gold/', BuyGoldView.as_view()),
    path('sell-gold/', SellGoldView.as_view()),
    path('wallet/', WalletView.as_view()),
    path('transactions/', TransactionListView.as_view()),
    path('register/', RegisterView.as_view()),
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
