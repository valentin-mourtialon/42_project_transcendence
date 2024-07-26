from rest_framework import viewsets

from .models import Game
from .serializers import GameSerializer
from .models import UserGame
from .serializers import UserGameSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class UserGameViewSet(viewsets.ModelViewSet):
    queryset = UserGame.objects.all()
    serializer_class = UserGameSerializer


