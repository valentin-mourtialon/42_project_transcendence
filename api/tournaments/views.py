from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response

from games.serializers import UserGameSerializer
from .models import Tournament
from .serializers import CreateTournamentSerializer, StartTournamentSerializer, TournamentSerializer
from .models import UserTournamentInvitation
from .serializers import UserTournamentInvitationSerializer

# ********************************************************
#       TOURNAMENT ModelViewSet
# ********************************************************

# TO DO: will turn into APIVIew if no more actions than GET is needed
class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

    # GET all tournament invitations
    @action(detail=True, methods=['get'], url_path='tournament-invitations')
    def tournament_invitations(self, request, pk=None):
        invitations = Tournament.get_tournament_invitations(pk)
        serializer = UserTournamentInvitationSerializer(invitations, many=True)
        return Response(serializer.data)
    
    # GET user games
    @action(detail=True, methods=['get'], url_path='user-games')
    def user_games(self, request, pk=None):
        games = Tournament.get_user_games(pk)
        serializer = UserGameSerializer(games, many=True)
        return Response(serializer.data)
    
# ********************************************************
#       CREATE TOURNAMENT APIView
# ********************************************************

class CreateTournamentAPIView(generics.CreateAPIView):
    serializer_class = CreateTournamentSerializer

# ********************************************************
#       START TOURNAMENT APIView
# ********************************************************

class StartTournamentAPIView(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = StartTournamentSerializer

    def get_serializer_context(self):
        return {'request': self.request}

# ********************************************************
#       USER TOURNAMENT ModelViewSet
#       (oce: prob not gonna be useful)
# ********************************************************

class UserTournamentInvitationViewSet(viewsets.ModelViewSet):
    queryset = UserTournamentInvitation.objects.all()
    serializer_class = UserTournamentInvitationSerializer