from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CreateTournamentAPIView,
    StartTournamentAPIView,
    TournamentViewSet,
    TournamentInvitationViewSet,
)

# from .views import UserTournamentViewSet

router = DefaultRouter()
router.register(r"tournaments", TournamentViewSet, basename="tournament")
router.register(
    r"tournament-invitations",
    TournamentInvitationViewSet,
    basename="tournament-invitation",
)
# router.register(r'', UserTournamentViewSet, basename='user_tournament')

urlpatterns = [
    # to do: based on what we want, we might reinclude 1st and 2nd path inside model view set
    path(
        "tournaments/create/",
        CreateTournamentAPIView.as_view(),
        name="create-tournament",
    ),
    path(
        "tournaments/<int:pk>/start/",
        StartTournamentAPIView.as_view(),
        name="start-tournament",
    ),
    path("", include(router.urls)),
]
