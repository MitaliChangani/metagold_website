from django.urls import path
from . import views
from .views import *
from .views import buy_request_status


urlpatterns = [
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('wallet/', WalletView.as_view()),
    path('transactions/', TransactionHistoryView.as_view()),
    path('request-buy/', buy_gold_request),
    path('request-sell/', sell_gold_request),
    path('approve-buy/<int:request_id>/', approve_buy_gold),
    path('approve-sell/<int:request_id>/', approve_sell_gold),
    path('buy-status/<int:request_id>/', buy_request_status, name='buy_request_status'),
    path('sell-status/<int:request_id>/', sell_request_status, name='sell_request_status'),
    path('admin-buy-requests/', get_buy_requests),
    path('admin-sell-requests/', get_sell_requests),
    path('check-auth/', check_auth),
    path('my-buy-requests/', get_my_buy_requests, name='my-buy-requests'),
    path('my-sell-requests/', get_my_sell_requests, name='my-sell-requests'),
    path('create-razorpay-order/', CreateRazorpayOrder.as_view(), name='create-razorpay-order'),
    path('verify-payment/', verify_payment, name='verify-payment'),
    path('create-razorpay-sell-order/', CreateRazorpaySellOrder.as_view(), name='create-razorpay-sell-order'),
    path('verify-sell-payment/', verify_sell_payment, name='verify-sell-payment'),
    path("create-razorpay-buy-order/", CreateRazorpayBuyOrder.as_view(), name="create_razorpay_buy_order"),
]

