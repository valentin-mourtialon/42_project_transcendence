from django.contrib import admin
from .models import User
from .models import Profile
from .models import FriendInvitation
from .models import Blocked

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'password')
    search_fields = ('username', 'email')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'wins', 'losses', 'avatar', 'display_name')
    search_fields = ('user__username', 'display_name')

class FriendInvitationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'status')
    search_fields = ('sender__display_name', 'receiver__display_name', 'status')
    list_filter = ['status']

class BlockedAdmin(admin.ModelAdmin):
    list_display = ('id', 'blocker', 'blocked')
    search_fields = ('blocker__display_name', 'blocked__display_name')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(FriendInvitation, FriendInvitationAdmin)
admin.site.register(Blocked, BlockedAdmin)