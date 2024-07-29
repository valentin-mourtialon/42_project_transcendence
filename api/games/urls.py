from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, UserGameViewSet

router = DefaultRouter()
router.register(r'games', GameViewSet, basename='game')
router.register(r'user-games', UserGameViewSet, basename='user_game')

urlpatterns = [
    path('', include(router.urls)),
]