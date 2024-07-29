from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegistrationAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenObtainPairView  # Importez la nouvelle vue

urlpatterns = [
    path("register/", RegistrationAPIView.as_view(), name="register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
