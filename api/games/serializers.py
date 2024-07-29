from rest_framework import serializers

from tournaments.serializers import TournamentSerializer
from users.serializers import FriendSerializer
from .models import Game
from .models import UserGame

# ********************************************************
#       GAME Serializer
# ********************************************************

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'tournament', 'winner']
        extra_kwargs = {
            'tournament': {'required': False, 'allow_null': True}
        }

    # GET: add tournament information
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        tournament_serializer = TournamentSerializer(instance.tournament)
        representation['tournament'] = tournament_serializer.data
        return representation

# ********************************************************
#       USER GAME Serializer
# ********************************************************

class UserGameSerializer(serializers.ModelSerializer):
    opponent = serializers.SerializerMethodField()

    class Meta:
        model = UserGame
        fields = '__all__'
    
    # GET: put the opponent data in the JSON response
    def get_opponent(self, instance):
        opponent_user_game = UserGame.objects.filter(game=instance.game).exclude(user=instance.user).first()
        return {
            'display_name': opponent_user_game.user.display_name,
            'score' : opponent_user_game.score
        }

    # GET: add game information
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        game_serializer = GameSerializer(instance.game)
        representation['game'] = game_serializer.data
        user_serializer = FriendSerializer(instance.user)
        representation['user'] = user_serializer.data
        return representation
