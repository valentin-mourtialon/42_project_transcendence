from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from users.models import Profile
from games.serializers import UserGameSerializer
from .permissions import IsOwnerOrReadOnly
from .models import Tournament, UserTournamentInvitation
from .serializers import (
    TournamentSerializer,
    UserTournamentInvitationSerializer,
    CreateTournamentSerializer,
    StartTournamentSerializer,
)


class TournamentViewSet(viewsets.ModelViewSet):
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    # [VMOURTIA] :
    #   - /api/tournaments/?created_by=${userId}
    #   - /api/tournaments/?participant=${userId}
    def get_queryset(self):
        queryset = Tournament.objects.all()
        created_by_user_id = self.request.query_params.get("created_by")
        participant_user_id = self.request.query_params.get("participant")
        if created_by_user_id:
            profile = get_object_or_404(Profile, user_id=created_by_user_id)
            queryset = queryset.filter(created_by=profile)
        elif participant_user_id:
            profile = get_object_or_404(Profile, user_id=participant_user_id)
            queryset = queryset.filter(
                tournament_users__user=profile, tournament_users__status="ACCEPTED"
            ).exclude(created_by=profile)
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.profile)

    # [VMOURTIA] :
    #   - /api/tournament-invitations/?invited_user=${userId}&status=pending
    @action(detail=True, methods=["get"], url_path="tournament-invitations")
    def tournament_invitations(self, request, pk=None):
        tournament = self.get_object()
        invitations = tournament.get_tournament_invitations()
        serializer = UserTournamentInvitationSerializer(invitations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="user-games")
    def user_games(self, request, pk=None):
        tournament = self.get_object()
        games = tournament.get_user_games()
        serializer = UserGameSerializer(games, many=True)
        return Response(serializer.data)


class TournamentInvitationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserTournamentInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = UserTournamentInvitation.objects.all()
        invited_user_id = self.request.query_params.get("invited_user")
        status = self.request.query_params.get("status")

        if invited_user_id:
            profile = get_object_or_404(Profile, user_id=invited_user_id)
            queryset = queryset.filter(user=profile)
        if status:
            queryset = queryset.filter(status=status.upper())

        return queryset


class CreateTournamentAPIView(generics.CreateAPIView):
    serializer_class = CreateTournamentSerializer
    permission_classes = [permissions.IsAuthenticated]


class StartTournamentAPIView(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = StartTournamentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}


# # ********************************************************
# #       TOURNAMENT ModelViewSet
# # ********************************************************

# # TO DO: will turn into APIVIew if no more actions than GET is needed
# class TournamentViewSet(viewsets.ModelViewSet):
#     queryset = Tournament.objects.all()
#     serializer_class = TournamentSerializer

#     # GET all tournament invitations
#     @action(detail=True, methods=['get'], url_path='tournament-invitations')
#     def tournament_invitations(self, request, pk=None):
#         invitations = Tournament.get_tournament_invitations(pk)
#         serializer = UserTournamentInvitationSerializer(invitations, many=True)
#         return Response(serializer.data)

#     # GET user games
#     @action(detail=True, methods=['get'], url_path='user-games')
#     def user_games(self, request, pk=None):
#         games = Tournament.get_user_games(pk)
#         serializer = UserGameSerializer(games, many=True)
#         return Response(serializer.data)

# # ********************************************************
# #       CREATE TOURNAMENT APIView
# # ********************************************************

# class CreateTournamentAPIView(generics.CreateAPIView):
#     serializer_class = CreateTournamentSerializer

# # ********************************************************
# #       START TOURNAMENT APIView
# # ********************************************************

# class StartTournamentAPIView(generics.UpdateAPIView):
#     queryset = Tournament.objects.all()
#     serializer_class = StartTournamentSerializer

#     def get_serializer_context(self):
#         return {'request': self.request}

# # ********************************************************
# #       USER TOURNAMENT ModelViewSet
# #       (oce: prob not gonna be useful)
# # ********************************************************

# class UserTournamentInvitationViewSet(viewsets.ModelViewSet):
#     queryset = UserTournamentInvitation.objects.all()
#     serializer_class = UserTournamentInvitationSerializer
