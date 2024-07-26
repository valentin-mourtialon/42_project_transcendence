from django.db import models
from users.models import Profile
from transcendence.utils.constants import INVITATION_STATUS_CHOICES, STATUS_PENDING

# ********************************************************
#       TOURNAMENT Model
# ********************************************************
#TO DO: prob need to add a 1v1 type in the future
class Tournament(models.Model):
    TOURNAMENT_TYPE_CHOICES = [
        ('REMOTE', 'Remote'),
        ('LOCAL', 'Local')
    ]

    STATUS_IN_PREPARATION = 'IN_PREPARATION'
    STATUS_IN_PROGRESS =  'IN_PROGRESS'
    STATUS_COMPLETED = 'COMPLETED'

    TOURNAMENT_STATUS_CHOICES = [
        (STATUS_IN_PREPARATION, 'In preparationn'),
        (STATUS_IN_PROGRESS, 'In progress'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    name = models.CharField(max_length=50)
    type = models.CharField(choices=TOURNAMENT_TYPE_CHOICES)
    created_by = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="tournament_created")
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True, related_name="tournament_won")
    status = models.CharField(max_length=50, choices=TOURNAMENT_STATUS_CHOICES, default=STATUS_IN_PREPARATION) 

    def get_tournament_invitations(self):
        tournament_invitations = UserTournamentInvitation.objects.select_related('user').filter(tournament=self)
        return tournament_invitations

# ********************************************************
#       USER TOURNAMENT Model
# ********************************************************
        
class UserTournamentInvitation(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="user_tournaments")
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="tournament_users")
    status = models.CharField(max_length=50, choices=INVITATION_STATUS_CHOICES, default=STATUS_PENDING)

     # Protection against duplicate invitations
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'tournament'], name='unique_tournament_invitation')
        ]
    