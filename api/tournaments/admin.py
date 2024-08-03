from django.contrib import admin
from .models import Tournament
from .models import UserTournamentInvitation

class TournamentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'created_by', 'winner', 'status', 'is_1v1')
    search_fields = ('name', 'type', 'created_by__username')
    list_filter = ['type', 'is_1v1']

class UserTournamentInvitationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'tournament', 'status')
    search_fields = ('user__username','tournament__name')
    list_filter = ['status']

admin.site.register(Tournament, TournamentAdmin)
admin.site.register(UserTournamentInvitation, UserTournamentInvitationAdmin)
