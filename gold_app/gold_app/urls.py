from django.urls import path, include
from django.contrib import admin
from .views import home
from . import views

urlpatterns = [
    path('secure-admin/', admin.site.urls),
    path('', views.home),
    path('api/v1/', include('core.urls')),  # or whatever your app name is
]
