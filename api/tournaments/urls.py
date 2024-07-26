from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateTournamentAPIView, StartTournamentAPIView, TournamentViewSet
# from .views import UserTournamentViewSet

router = DefaultRouter()
router.register(r'tournament', TournamentViewSet, basename='tournament')
# router.register(r'', UserTournamentViewSet, basename='user_tournament')

urlpatterns = [
    path('', include(router.urls)),
    path('tournament/create/', CreateTournamentAPIView.as_view(), name='create-tournament'),
    path('tournament/<int:pk>/start/', StartTournamentAPIView.as_view(), name='start-tournament'),
]