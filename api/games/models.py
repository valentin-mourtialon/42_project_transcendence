from django.db import models
from tournaments.models import Tournament
from users.models import Profile

class Game(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True, related_name="games")
    winner = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True, blank=True)
    finished_at = models.DateField(null=True, blank=True)

class UserGame(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="user_games")
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="game_users")
    score = models.IntegerField(default=0)
    is_winner = models.BooleanField(default=False)

    # TO GET MATCH HISTORY:
    # to do: function to put here
    







    
    
    