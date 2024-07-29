import json
from django.core.management.base import BaseCommand
from users.models import User, Profile, FriendInvitation
from tournaments.models import Tournament, UserTournamentInvitation
from games.models import UserGame, Game


def load_mock_data():
    with open("mock_data.json", "r") as file:
        data = json.load(file)

    # Insérer les utilisateurs
    for user_data in data["Users"]:
        User.objects.create(**user_data)

    # Insérer les profils
    for profile_data in data["Profiles"]:
        Profile.objects.create(**profile_data)

    # Insérer les invitations d'amis
    for invitation_data in data["FriendInvitations"]:
        FriendInvitation.objects.create(**invitation_data)

    # Insérer les tournois
    for tournament_data in data["Tournaments"]:
        Tournament.objects.create(**tournament_data)

    # Insérer les invitations aux tournois
    for invitation_data in data["UserTournamentInvitations"]:
        UserTournamentInvitation.objects.create(**invitation_data)

    # Insérer les jeux
    for game_data in data["Games"]:
        Game.objects.create(**game_data)

    # Insérer les parties des utilisateurs
    for user_game_data in data["UserGames"]:
        UserGame.objects.create(**user_game_data)


class Command(BaseCommand):
    help = "Load mock data into the database"

    def handle(self, *args, **kwargs):
        load_mock_data()
        self.stdout.write(self.style.SUCCESS("Successfully loaded mock data"))
