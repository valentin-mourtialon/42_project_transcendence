from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from users.models import Profile

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password_confirmation')
    
    def validate(self, data):
        if data['password_confirmation'] != data['password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        # Remove password_confirmation from the validated_data
        validated_data.pop('password_confirmation', None)

        # Save the user inside the database
        user = User.objects.create_user(**validated_data)

        # password = validated_data.pop('password')
        # user.set_password(password)
        # user.save()

        # Create a profile for that user
        Profile.objects.create(user=user, display_name=user.username)

        return user

        


