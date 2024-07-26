# Generated by Django 5.0.7 on 2024-07-23 22:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0003_alter_tournamentinvitation_receiver_and_more'),
        ('users', '0009_alter_blocked_blocked_alter_blocked_blocker'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usertournament',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tournament_users', to='tournaments.tournament'),
        ),
        migrations.AlterField(
            model_name='usertournament',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_tournaments', to='users.profile'),
        ),
    ]
