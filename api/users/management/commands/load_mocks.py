import json
import os
from django.core.files import File
from django.conf import settings
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import transaction

User = apps.get_model("users", "User")
Profile = apps.get_model("users", "Profile")
FriendInvitation = apps.get_model("users", "FriendInvitation")
Tournament = apps.get_model("tournaments", "Tournament")
UserTournamentInvitation = apps.get_model("tournaments", "UserTournamentInvitation")
UserGame = apps.get_model("games", "UserGame")
Game = apps.get_model("games", "Game")


def load_mock_data():
    with open("mock_data.json", "r") as file:
        data = json.load(file)

    with transaction.atomic():
        # Users
        users = {}
        for user_data in data["Users"]:
            user = User.objects.create_user(
                username=user_data["username"],
                email=user_data["email"],
                password=user_data["password"],
            )
            users[user.id] = user

        # Profiles
        profiles = {}
        for profile_data in data["Profiles"]:
            user = users[profile_data["user"]]
            avatar_name = profile_data["avatar"]
            avatar_path = os.path.join(settings.MEDIA_ROOT, "avatars", avatar_name)

            profile = Profile(user=user, display_name=profile_data["display_name"])

            if os.path.exists(avatar_path):
                with open(avatar_path, "rb") as avatar_file:
                    profile.avatar.save(avatar_name, File(avatar_file), save=False)
            else:
                print(f"Avatar file not found: {avatar_path}")

            profile.save()
            profiles[user.id] = profile

        # Friends Invitations
        for invitation_data in data["FriendInvitations"]:
            FriendInvitation.objects.create(
                sender=profiles[invitation_data["sender"]],
                receiver=profiles[invitation_data["receiver"]],
                status=invitation_data["status"],
            )

        # Tournaments
        tournaments = {}
        for tournament_data in data["Tournaments"]:
            tournament = Tournament.objects.create(
                name=tournament_data["name"],
                type=tournament_data["type"],
                created_by=profiles[tournament_data["created_by"]],
                status=tournament_data["status"],
            )
            tournaments[tournament.id] = tournament

        # Tournaments Invitations
        for invitation_data in data["UserTournamentInvitations"]:
            UserTournamentInvitation.objects.create(
                tournament=tournaments[invitation_data["tournament"]],
                user=profiles[invitation_data["user"]],
                status=invitation_data["status"],
            )

        # Games
        games = {}
        for game_data in data["Games"]:
            game = Game.objects.create(tournament=tournaments[game_data["tournament"]])
            games[game.id] = game

        # Users Games
        for user_game_data in data["UserGames"]:
            UserGame.objects.create(
                user=profiles[user_game_data["user"]],
                game=games[user_game_data["game"]],
                score=user_game_data["score"],
                is_winner=user_game_data["is_winner"],
            )


class Command(BaseCommand):
    help = "Load mock data into the database"

    def handle(self, *args, **kwargs):
        if User.objects.count() == 1:
            try:
                load_mock_data()
                self.stdout.write(self.style.SUCCESS("Successfully loaded mock data"))
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error loading mock data: {str(e)}")
                )
        else:
            self.stdout.write(
                self.style.WARNING(
                    "Database already contains data. Skipping mock data loading."
                )
            )
