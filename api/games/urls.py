from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet

router = DefaultRouter()
router.register(r'game', GameViewSet, basename='game')
router.register(r'user_game', GameViewSet, basename='user_game')

urlpatterns = [
    path('', include(router.urls)),
]