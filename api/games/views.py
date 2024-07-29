from rest_framework import viewsets
from .models import Game
from .serializers import GameSerializer
from .models import UserGame
from .serializers import UserGameSerializer

# TO DO:too many urls allowed in this file, prob gonna customize later

# ********************************************************
#       GAME ViewSet 
# ********************************************************

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

# ********************************************************
#       USER GAME ViewSet 
# ********************************************************

class UserGameViewSet(viewsets.ModelViewSet):
    queryset = UserGame.objects.all()
    serializer_class = UserGameSerializer
