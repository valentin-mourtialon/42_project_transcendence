from rest_framework import serializers
from .models import Game
from .models import UserGame

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'
        extra_kwargs = {
            'tournament': {'required': False, 'allow_null': True}
        }

class UserGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGame
        fields = '__all__'
