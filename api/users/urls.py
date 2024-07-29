from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcceptFriendInvitationAPIView, BlockFriendAPIView, BlockedListAPIView, DeclineFriendInvitationAPIView, ProfileViewSet, UnblockFriendAPIView, UnfriendAPIView
from .views import SendFriendInvitationAPIView

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
# router.register(r'blocked', BlockedViewSet, basename='blocked') # TO DO

urlpatterns = [
    path('users/', include(router.urls)),
    path('users/profile/friend-invitation/send', SendFriendInvitationAPIView.as_view(), name='send_friend_invitation'),
    path('users/profile/friend-invitation/<int:pk>/accept', AcceptFriendInvitationAPIView.as_view(), name='accept_friend_invitation'),
    path('users/profile/friend-invitation/<int:pk>/decline', DeclineFriendInvitationAPIView.as_view(), name='decline_friend_invitation'),
    path('users/profile/friend-invitation/<int:pk>/unfriend', UnfriendAPIView.as_view(), name='unfriend'),

    path('users/profile/blocked/block', BlockFriendAPIView.as_view(), name='block_friend'),
    path('users/profile/blocked/<int:pk>/unblock', UnblockFriendAPIView.as_view(), name='unblock'),
    path('users/profile/blocked', BlockedListAPIView.as_view(), name='blocked-list'),
]