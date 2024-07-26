from django.db import models
from django.contrib.auth.models import AbstractUser
from transcendence.utils.constants import INVITATION_STATUS_CHOICES, STATUS_ACCEPTED, STATUS_PENDING, STATUS_DECLINED

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

    def __str__(self):
        return self.user.username

# ********************************************************
#     FRIEND INVITATION Model
# ********************************************************

class FriendInvitation(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_invitations')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_friend_invitations')
    status = models.CharField(max_length=20, choices=INVITATION_STATUS_CHOICES)

    # Protection to prevent duplicate invitation
    @classmethod
    def is_duplicate(cls, sender, receiver, status):
        return cls.objects.filter(
            (models.Q(sender=sender, receiver=receiver, status=status)) |
            (models.Q(sender=receiver, receiver=sender, status=status))
        ).exists()

    # Double protection to prevent duplicate invitation
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['sender', 'receiver'], name='unique_friend_invitation')
        ]

# TO DO
# ********************************************************
#     BLOCKED Model
# ******************************************************** 

# We will use to know if can do an action (send friend invitation, tournament invitation, a message)
class Blocked(models.Model):
    blocker = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='blocker_blocked_users')
    blocked = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='blocked_users')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocked'], name='unique_block')
        ]
    
    def __str__(self):
        return f'{self.blocker} - {self.blocked}'