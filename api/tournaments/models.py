from django.db import models
from users.models import Profile
from transcendence.utils.constants import INVITATION_STATUS_CHOICES, STATUS_ACCEPTED, STATUS_PENDING

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
        (STATUS_IN_PREPARATION, 'In preparation'),
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
    
    @classmethod
    def create(cls, players, validated_data):

        # Create the tournament instance
        tournament = cls.objects.create(**validated_data)

        # Create all user tournament instances
        for player in players:
            UserTournamentInvitation.objects.create(user=player, tournament=tournament)
        
        return tournament

    def start(self, creator):
        from games.models import Game, UserGame

        # Update tournament status to IN PROGRESS
        self.status = self.STATUS_IN_PROGRESS

        # Get all the players
        players = list(UserTournamentInvitation.objects.filter(
            tournament=self, 
            status=STATUS_ACCEPTED
        ))
        
        # Create the games
        for i in range(len(players)):
            for j in range(i+1, len(players)):
                game = Game.objects.create(tournament=self)
                UserGame.objects.create(user=players[i].user, game=game)
                UserGame.objects.create(user=players[j].user, game=game)

        for i in range(len(players)):
            game = Game.objects.create(tournament=self)
            UserGame.objects.create(user=creator, game=game)
            UserGame.objects.create(user=players[i].user, game=game)

        self.save()
    
    def get_user_games(self):
        from games.models import UserGame
        user_games = UserGame.objects.filter(game__tournament=self)
        return user_games

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
    