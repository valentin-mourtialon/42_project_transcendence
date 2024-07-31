from rest_framework import serializers
from users.models import Profile
from users.serializers import FriendSerializer
from .models import Tournament
from .models import UserTournamentInvitation

# ********************************************************
#       TOURNAMENT Serializer
# ********************************************************


class TournamentSerializer(serializers.ModelSerializer):
    creator_profile = serializers.SerializerMethodField()
    participant_count = serializers.SerializerMethodField()
    declined_players = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = [
            "id",
            "name",
            "type",
            "created_by",
            "winner",
            "status",
            "creator_profile",
            "participant_count",
            "declined_players",
        ]

    def get_creator_profile(self, obj):
        return {
            "username": obj.created_by.user.username,
            "display_name": obj.created_by.display_name,
            "avatar": obj.created_by.avatar.url if obj.created_by.avatar else None,
        }

    def get_participant_count(self, obj):
        return obj.tournament_users.filter(status="ACCEPTED").count() + 1

    def get_declined_players(self, obj):
        declined_invitations = obj.tournament_users.filter(status="DECLINED")
        return [invite.user.id for invite in declined_invitations]


class UserTournamentInvitationSerializer(serializers.ModelSerializer):
    tournament = TournamentSerializer()

    class Meta:
        model = UserTournamentInvitation
        fields = ["id", "user", "tournament", "status"]


# ********************************************************
#       CREATE TOURNAMENT Serializer
# ********************************************************


class CreateTournamentSerializer(serializers.ModelSerializer):
    # player is write-only, and will not be included in the db, or json response
    players = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.all(), many=True, write_only=True
    )

    # winner can be null, and is not required, as when tournament is created, there is no winner
    winner = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Tournament
        fields = ["name", "type", "created_by", "winner", "status", "players"]

    # POST: to create a tournament
    def create(self, validated_data):
        players = validated_data.pop("players", [])

        tournament = Tournament.create(players, validated_data)

        return tournament


# ********************************************************
#       START TOURNAMENT Serializer
# ********************************************************


# to do: put protection here later probably, like if no one accepted
# also a protection in front, like you can't start if not at least two accepted
# protection, not start again (but front will block by removing button (start tournament))
class StartTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = []

    # PUT: to start a tournament
    def update(self, instance, validated_data):
        # Start the tournament
        creator = self.context["request"].user.profile
        instance.start(creator)
        return instance


# ********************************************************
#       USER TOURNAMENT Serializer
# ********************************************************
# class UserTournamentInvitationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserTournamentInvitation
#         fields = "__all__"

#     # GET: add tournament and user info inside the user tournament invitation JSON response
#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         tournament_serializer = TournamentSerializer(instance.tournament)
#         representation["tournament"] = tournament_serializer.data
#         user_serializer = FriendSerializer(instance.user)
#         representation["user"] = user_serializer.data
#         return representation
