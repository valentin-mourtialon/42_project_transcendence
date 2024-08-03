from django.db import IntegrityError
from rest_framework import serializers
from .models import Profile
from .models import FriendInvitation
from .models import Blocked
from transcendence.utils.constants import STATUS_ACCEPTED, STATUS_PENDING
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model


# ********************************************************
#     PROFILE Serializer
# ********************************************************

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class ProfileSerializer(serializers.ModelSerializer):
    # user = UserSerializer(read_only=True)
    username = serializers.SerializerMethodField()
    games_played = serializers.IntegerField(read_only=True)
    wins = serializers.IntegerField(read_only=True)
    losses = serializers.IntegerField(read_only=True)
    ratio = serializers.FloatField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            # "user",
            "id",
            "username",
            "avatar",
            "display_name",
            "games_played",
            "wins",
            "losses",
            "ratio",
        ]
    #     read_only_fields = ['username']
    
    def get_username(self, instance):
        return instance.user.username


# ********************************************************
#     FRIEND / FRIEND INVITATIONS Serializers
# ********************************************************

class FriendSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ["id", "username", "display_name", "avatar"]
    
    def get_username(self, instance):
        return instance.user.username

class FriendshipSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()

    class Meta:
        model = FriendInvitation
        fields = ["id", "friend"]

    def get_friend(self, instance):
        user = self.context["request"].user.profile
        friend = instance.receiver if instance.sender == user else instance.sender
        return FriendSerializer(friend).data

class FriendInvitationSerializer(serializers.ModelSerializer):

    class Meta:
        model = FriendInvitation
        fields = ["id", "sender", "receiver", "status"]
        read_only_fields = ["id", "sender", "status"]

    # POST: to create an invitation
    def create(self, validated_data):

        # Check if the invitation is correct
        sender = self.context["request"].user.profile
        receiver = validated_data["receiver"]
        validated_data["sender"] = sender
        try:
            FriendInvitation.validate(sender, receiver)
        except ValidationError as e:
            raise serializers.ValidationError(e.message)

        # Create the invitation
        validated_data["status"] = STATUS_PENDING
        return super().create(validated_data)

    # PATCH: to accept an invitation (update status to STATUS_ACCEPTED)
    def update(self, instance, validated_data):
        instance.status = STATUS_ACCEPTED
        instance.save()
        return instance

    # GET: put all info for receiver and sender when a request GET is done
    # (used to get the invitations the user has sent/received)
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        receiver_serializer = FriendSerializer(instance.receiver)
        representation["receiver"] = receiver_serializer.data
        sender_serializer = FriendSerializer(instance.sender)
        representation["sender"] = sender_serializer.data
        return representation


# ********************************************************
#     BLOCKED Serializer
# ********************************************************


class BlockedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blocked
        fields = ["id", "blocker", "blocked"]
        read_only_fields = ["id", "blocker"]

    # POST: to block a friend
    def create(self, validated_data):

        # Check if the user is actually friend with that person
        # And if it does exist, delete the invitation
        blocker = self.context["request"].user.profile
        blocked = validated_data["blocked"]
        validated_data["blocker"] = blocker
        try:
            FriendInvitation.are_friends(blocker, blocked)
            FriendInvitation.delete_invitation(blocker, blocked)
        except ValidationError as e:
            raise serializers.ValidationError(e.message)

        # Create the blocked item
        return super().create(validated_data)

    # GET: put all info
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        blocker_serializer = FriendSerializer(instance.blocker)
        representation["blocker"] = blocker_serializer.data
        blocked_serializer = FriendSerializer(instance.blocked)
        representation["blocked"] = blocked_serializer.data
        return representation
