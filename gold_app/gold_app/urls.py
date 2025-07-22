from django.urls import path, include
from django.contrib import admin

urlpatterns = [
    path('secure-admin/', admin.site.urls),
    path('api/v1/', include('core.urls')),  # or whatever your app name is
]
