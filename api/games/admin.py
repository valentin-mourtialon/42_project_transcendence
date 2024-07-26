from django.contrib import admin
from .models import Game
from .models import UserGame

class GameAdmin(admin.ModelAdmin):
    list_display = ('tournament', 'winner', 'finished_at')
    search_fields = ('tournament__name', 'winner', 'finished_at')

class UserGameAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'score', 'is_winner')
    search_fields = ('user', 'game')
    list_filter = ['is_winner']

admin.site.register(Game, GameAdmin)
admin.site.register(UserGame, UserGameAdmin)
