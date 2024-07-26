from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import RegistrationSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer

    # Allow only POST requests
    http_method_names = ['post']

    # Allow user without them being authenticated
    permission_classes = [AllowAny]