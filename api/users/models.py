from django.db import models
from django.contrib.auth.models import AbstractUser
from transcendence.utils.constants import INVITATION_STATUS_CHOICES, STATUS_ACCEPTED, STATUS_PENDING
from django.core.exceptions import ValidationError

# ********************************************************
#     USER / PROFILE Models
# ********************************************************

class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=50)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def get_friends(self):
        from .models import FriendInvitation
        friend_invitations = FriendInvitation.objects.filter(models.Q(sender=self, status=STATUS_ACCEPTED) | models.Q(receiver=self, status=STATUS_ACCEPTED))
        friends = []
        for friend_invitation in friend_invitations:
            if friend_invitation.sender == self:
                friends.append(friend_invitation.receiver)
            else:
                friends.append(friend_invitation.sender)
        return friends

    def get_accepted_invitations(self):
        from .models import FriendInvitation
        accepted_invitations = FriendInvitation.objects.filter(models.Q(sender=self, status=STATUS_ACCEPTED) | models.Q(receiver=self, status=STATUS_ACCEPTED))
        return accepted_invitations
    
    def get_sent_friend_invitations(self):
        from .models import FriendInvitation
        sent_friend_invitations = FriendInvitation.objects.filter(models.Q(sender=self, status=STATUS_PENDING))
        return sent_friend_invitations
    
    def get_received_friend_invitations(self):
        from .models import FriendInvitation
        received_friend_invitations = FriendInvitation.objects.filter(models.Q(receiver=self, status=STATUS_PENDING))
        return received_friend_invitations
    
    def get_created_tournaments(self):
        from tournaments.models import Tournament
        created_tournaments = Tournament.objects.filter(created_by=self)
        return created_tournaments

    def get_accepted_tournament_invitations(self):
        from tournaments.models import UserTournamentInvitation
        accepted_tournament_invitations = UserTournamentInvitation.objects.filter(user=self, status=STATUS_ACCEPTED)
        return accepted_tournament_invitations

    def get_received_tournament_invitations(self):
        from tournaments.models import UserTournamentInvitation
        received_tournament_invitations = UserTournamentInvitation.objects.filter(user=self, status=STATUS_PENDING)
        return received_tournament_invitations
    
    def get_game_history(self):
        user_games = self.user_games.all()
        return user_games

    def __str__(self):
        return self.user.username

# ********************************************************
#     FRIEND INVITATION Model
# ********************************************************

class FriendInvitation(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_invitations')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_friend_invitations')
    status = models.CharField(max_length=20, choices=INVITATION_STATUS_CHOICES)

    #oce: block possible only you are friends
    @classmethod
    def are_friends(cls, user, friend):
        is_friend =  cls.objects.filter(
            models.Q(sender=user) & models.Q(receiver=friend) & models.Q(status=STATUS_ACCEPTED) |
            models.Q(sender=friend) & models.Q(receiver=user) & models.Q(status=STATUS_ACCEPTED)
        )
        if is_friend.exists():
            return True
        raise ValidationError("You are not friend with that user")

    @classmethod
    def delete_invitation(cls, user, friend):
        try:
            invitation = cls.objects.get(sender=user, receiver=friend)
        except cls.DoesNotExist:
            try:
                invitation = cls.objects.get(sender=friend, receiver=user)
            except cls.DoesNotExist:
                raise ValidationError("Invitation does not exist")
        invitation.delete()

    # Protection to prevent duplicate invitation
    @classmethod
    def is_duplicate(cls, sender, receiver, status):
        return cls.objects.filter(
            (models.Q(sender=sender, receiver=receiver, status=status)) |
            (models.Q(sender=receiver, receiver=sender, status=status))
        ).exists()
    
    @classmethod
    def validate(cls, sender, receiver):
        if (sender.id == receiver.id):
            raise ValidationError("You cannot send an invitation to yourself")
        if (FriendInvitation.is_duplicate(sender, receiver, STATUS_PENDING)):
            raise ValidationError("Invitation already exists")
        elif (FriendInvitation.is_duplicate(sender, receiver, STATUS_ACCEPTED)):
            raise ValidationError("You are already friend with that user")  

    # Double protection to prevent duplicate invitation
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sender', 'receiver'], name='unique_friend_invitation')
        ]

# ********************************************************
#     BLOCKED Model
# ******************************************************** 

class Blocked(models.Model):
    blocker = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='blocker_blocked_users')
    blocked = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='blocked_users')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocked'], name='unique_block')
        ]
    
    def __str__(self):
        return f'{self.blocker} - {self.blocked}'