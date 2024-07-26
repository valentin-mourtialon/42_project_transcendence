from rest_framework import serializers
from games.models import Game, UserGame
from transcendence.utils.constants import STATUS_ACCEPTED
from users.models import Profile
from users.serializers import FriendSerializer
from .models import Tournament
from .models import UserTournamentInvitation

# ********************************************************
#       TOURNAMENT Serializer
# ********************************************************

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['id', 'name', 'type', 'created_by', 'winner', 'status']

# ********************************************************
#       CREATE TOURNAMENT Serializer
# ********************************************************

class CreateTournamentSerializer(serializers.ModelSerializer):
    # player is write-only, and will not be included in the db, or json response
    players = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), many=True, write_only=True)
    
    # winner can be null, and is not required, as when tournament is created, there is no winner
    winner = serializers.PrimaryKeyRelatedField(queryset=Profile.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Tournament
        fields = ['name', 'type', 'created_by', 'winner', 'status', 'players']

    # POST: to create a tournament
    def create(self, validated_data):
        players = validated_data.pop('players', [])

        # Create the tournament instance
        tournament = Tournament.objects.create(**validated_data)

        # Create all user tournament instances
        for player in players:
            UserTournamentInvitation.objects.create(user=player, tournament=tournament)

        return tournament


# ********************************************************
#       START TOURNAMENT Serializer
# ********************************************************

# to do: put protection here later probably, like if no one accepted
# also a protection in front, like you can't start if not at least two accepted
# TO DO: add the creator
# protection, not start again (but front will block by removing button (start tournament))
class StartTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = []

    # PUT: to start a tournament
    def update(self, instance, validated_data):

        # Update tournament status to IN PROGRESS
        instance.status = Tournament.STATUS_IN_PROGRESS

        # Get all the players
        players = list(UserTournamentInvitation.objects.filter(
            tournament=instance, 
            status=STATUS_ACCEPTED
        ))
        creator = self.context['request'].user.profile
        
        # Create the games
        for i in range(len(players)):
            for j in range(i+1, len(players)):
                game = Game.objects.create(tournament=instance)
                UserGame.objects.create(user=players[i].user, game=game)
                UserGame.objects.create(user=players[j].user, game=game)

        for i in range(len(players)):
            game = Game.objects.create(tournament=instance)
            UserGame.objects.create(user=creator, game=game)
            UserGame.objects.create(user=players[i].user, game=game)

        instance.save()
        return instance

# ********************************************************
#       USER TOURNAMENT Serializer
# ********************************************************
class UserTournamentInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTournamentInvitation
        fields = '__all__'

    # GET: add tournament and user info inside the user tournament invitation JSON response
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        tournament_serializer = TournamentSerializer(instance.tournament)
        representation['tournament'] = tournament_serializer.data
        user_serializer = FriendSerializer(instance.user)
        representation['user'] = user_serializer.data
        return representation