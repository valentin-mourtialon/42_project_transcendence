from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from games.models import UserGame
from games.serializers import UserGameSerializer
from tournaments.serializers import (
    TournamentSerializer,
    UserTournamentInvitationSerializer,
)

from .models import Profile
from .serializers import FriendshipSerializer, ProfileSerializer
from .models import FriendInvitation
from .serializers import FriendInvitationSerializer
from .models import Blocked
from .serializers import BlockedSerializer


# ********************************************************
#     PROFILE ViewSet
# ********************************************************


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get"], url_path=r"(?P<user_id>\d+)")
    def get_profile(self, request, user_id=None):
        try:
            profile = Profile.objects.get(user__id=user_id)
            if profile.user != request.user:
                return Response(
                    {"detail": "You don't have permission to view this profile."},
                    status=403,
                )
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response({"detail": "Not found."}, status=404)

    # GET list of profiles (remove the profile the user has blocked, the user themselves)
    def list(self, request, *args, **kwargs):
        blocker_user = request.user.profile
        blocked_user_ids = Blocked.objects.filter(blocker=blocker_user).values_list(
            "blocked_id", flat=True
        )
        blocked_by_ids = Blocked.objects.filter(blocked=blocker_user).values_list(
            "blocker_id", flat=True
        )
        excluded_ids = [blocker_user.id] + list(blocked_user_ids) + list(blocked_by_ids)
        queryset = self.queryset.exclude(id__in=excluded_ids)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # POST
    def create(self, request, *args, **kwargs):
        raise PermissionDenied()

    # PUT: update user profile
    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.user != profile.user:
            raise PermissionDenied()
        return super().update(request, *args, **kwargs)

    # PATCH: update user profile
    def partial_update(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.user != profile.user:
            raise PermissionDenied()
        return super().partial_update(request, *args, **kwargs)

    # DELETE: delete user profile
    def destroy(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.user != profile.user:
            raise PermissionDenied()
        return super().destroy(request, *args, **kwargs)

    # GET all friends
    @action(detail=False, methods=["get"], url_path="friends")
    def friends(self, request):
        user = request.user
        accepted_invitations = user.profile.get_accepted_invitations().select_related(
            "sender", "receiver"
        )
        serializer = FriendshipSerializer(
            accepted_invitations, many=True, context={"request": request}
        )
        return Response(serializer.data)

    # GET all the invitations the user has sent
    @action(detail=False, methods=["get"], url_path="sent-friend-invitations")
    def sent_friend_invitations(self, request):
        user = request.user
        sent_invitations = user.profile.get_sent_friend_invitations()
        serializer = FriendInvitationSerializer(
            sent_invitations, many=True, context={"request": request}
        )
        return Response(serializer.data)

    # GET all the invitations the user received
    @action(detail=False, methods=["get"], url_path="received-friend-invitations")
    def received_friend_invitations(self, request):
        user = request.user
        received_invitations = user.profile.get_received_friend_invitations()
        serializer = FriendInvitationSerializer(
            received_invitations, many=True, context={"request": request}
        )
        return Response(serializer.data)

    # [VMOURTIA] : Unused
    # GET all created tournaments
    @action(detail=False, methods=["get"], url_path="created-tournaments")
    def created_tournaments(self, request):
        user = request.user
        created_tournaments = user.profile.get_created_tournaments()
        serializer = TournamentSerializer(created_tournaments, many=True)
        return Response(serializer.data)

    # [VMOURTIA] : Unused
    # GET all received tournament invitations
    @action(detail=False, methods=["get"], url_path="received-tournament-invitations")
    def received_tournament_invitations(self, request):
        user = request.user
        received_tournament_invitations = (
            user.profile.get_received_tournament_invitations()
        )
        serializer = UserTournamentInvitationSerializer(
            received_tournament_invitations, many=True
        )
        return Response(serializer.data)

    # [VMOURTIA] : Unused
    # GET all accepted tournament invitations
    @action(detail=False, methods=["get"], url_path="accepted-tournament-invitations")
    def accepted_tournament_invitations(self, request):
        user = request.user
        accepted_tournament_invitations = (
            user.profile.get_accepted_tournament_invitations()
        )
        serializer = UserTournamentInvitationSerializer(
            accepted_tournament_invitations, many=True
        )
        return Response(serializer.data)

    # [VMOURTIA] : Done
    # GET game history with opponent
    @action(detail=False, methods=["get"], url_path="game-history")
    def game_history(self, request):
        user = request.user
        games = user.profile.get_game_history()
        serializer = UserGameSerializer(games, many=True)
        return Response(serializer.data)

    # [VMOURTIA] : Done
    @action(detail=False, methods=["get"], url_path="pending-friend-invitations")
    def pending_friend_invitations(self, request):
        user = request.user
        received_invitations = user.profile.get_received_friend_invitations()
        serializer = FriendInvitationSerializer(
            received_invitations, many=True, context={"request": request}
        )
        return Response(serializer.data)

    # [VMOURTIA] : Done
    @action(detail=False, methods=["get"], url_path="blocked-users")
    def blocked_users(self, request):
        user = request.user
        blocked_users = Blocked.objects.filter(blocker=user.profile)
        serializer = BlockedSerializer(
            blocked_users, many=True, context={"request": request}
        )
        return Response(serializer.data)


# ********************************************************
#     FRIEND INVITATION ApiViews
# ********************************************************


# POST: to create an invitation
class SendFriendInvitationAPIView(generics.CreateAPIView):
    queryset = FriendInvitation.objects.all()
    serializer_class = FriendInvitationSerializer

    def get_serializer_context(self):
        return {"request": self.request}


# PATCH: to accept an invitation (update status to STATUS_ACCEPTED)
class AcceptFriendInvitationAPIView(generics.UpdateAPIView):
    queryset = FriendInvitation.objects.all()
    serializer_class = FriendInvitationSerializer

    def get_object(self):
        # Check if the user actually received
        # the invitation they try to accept
        invitation = super().get_object()
        profile = self.request.user.profile
        if profile != invitation.receiver:
            raise PermissionDenied("You did not receive this invitation")
        return invitation


# DELETE: to decline an invitation
class DeclineFriendInvitationAPIView(generics.DestroyAPIView):
    queryset = FriendInvitation.objects.all()
    serializer_class = FriendInvitationSerializer

    def get_object(self):
        # Check if the user actually sent/received
        # the invitation they try to delete
        invitation = super().get_object()
        profile = self.request.user.profile
        if profile != invitation.receiver and profile != invitation.sender:
            raise PermissionDenied(
                "You are not allowed to delete/decline this invitation"
            )
        return invitation


# DELETE: to unfriend
class UnfriendAPIView(generics.DestroyAPIView):
    queryset = FriendInvitation.objects.all()
    serializer_class = FriendInvitationSerializer

    def get_object(self):
        # Check if the user actually sent/received
        # the invitation they try to delete
        invitation = super().get_object()
        profile = self.request.user.profile
        if profile != invitation.receiver and profile != invitation.sender:
            raise PermissionDenied("The user is not your friend")
        return invitation


# ********************************************************
#     BLOCKED APIView
# ********************************************************


# POST: to block a friend
class BlockFriendAPIView(generics.CreateAPIView):
    queryset = Blocked.objects.all()
    serializer_class = BlockedSerializer

    def get_serializer_context(self):
        return {"request": self.request}


# DELETE: to unblock
class UnblockFriendAPIView(generics.DestroyAPIView):
    queryset = Blocked.objects.all()
    serializer_class = BlockedSerializer


# GET: get the lists of all the friends the user has blocked
class BlockedListAPIView(generics.ListAPIView):
    queryset = Blocked.objects.all()
    serializer_class = BlockedSerializer

    def get_queryset(self):
        return Blocked.objects.filter(blocker=self.request.user.profile)
