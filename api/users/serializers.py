from django.db import IntegrityError
from rest_framework import serializers
from .models import Profile
from .models import FriendInvitation
from .models import Blocked
from transcendence.utils.constants import STATUS_ACCEPTED, STATUS_PENDING


# ********************************************************
#     PROFILE Serializer
# ********************************************************

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        extra_kwargs = {
            'avatar': {'required': False, 'allow_null': True}
        }
    
    def validate_wins(self, value):
        if value < 0:
            raise serializers.ValidationError("Wins number cannot be negative")
        return value
    
    def validate_losses(self, value):
        if value < 0:
            raise serializers.ValidationError("Losses number cannot be negative")

# ********************************************************
#     FRIEND / FRIEND INVITATIONS Serializers
# ********************************************************

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'display_name', 'avatar']

class FriendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'sender', 'receiver', 'status']
        read_only_fields = ['id', 'sender', 'status']
    
    # POST: to create an invitation
    def create(self, validated_data):
        sender = self.context['request'].user.profile
        receiver = validated_data['receiver']
        validated_data['sender'] = sender
        validated_data['status'] = STATUS_PENDING
        if (sender.id == receiver.id):
            raise serializers.ValidationError("You cannot send an invitation to yourself")
        if (FriendInvitation.is_duplicate(sender, receiver, STATUS_PENDING)):
            raise serializers.ValidationError("Invitation already exists")
        elif (FriendInvitation.is_duplicate(sender, receiver, STATUS_ACCEPTED)):
            raise serializers.ValidationError("You are already friend with that user")  
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
        representation['receiver'] = receiver_serializer.data
        sender_serializer = FriendSerializer(instance.sender)
        representation['sender'] = sender_serializer.data
        return representation

# TO DO
# ********************************************************
#     BLOCKED Serializer
# ********************************************************

class BlockedSerializer(serializers.Serializer):
    class Meta:
        model = Blocked
        fields = '__all__'



    
