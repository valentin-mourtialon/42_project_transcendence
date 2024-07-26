from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcceptFriendInvitationAPIView, DeclineFriendInvitationAPIView, ProfileViewSet, UnfriendAPIView
from .views import SendFriendInvitationAPIView
# from .views import BlockedViewSet

router = DefaultRouter()
router.register(r'profile', ProfileViewSet, basename='profile')
router.register(r'blocked', ProfileViewSet, basename='blocked') # TO DO

urlpatterns = [
    path('', include(router.urls)),
    path('friend-invitation/send/', SendFriendInvitationAPIView.as_view(), name='send_friend_invitation'),
    path('friend-invitation/<int:pk>/accept/', AcceptFriendInvitationAPIView.as_view(), name='accept-friend-invitation'),
    path('friend-invitation/<int:pk>/decline/', DeclineFriendInvitationAPIView.as_view(), name='decline-friend-invitation'),
    path('friend-invitation/<int:pk>/unfriend/', UnfriendAPIView.as_view(), name='unfriend'),
]