# your_app/backends.py

from django.contrib.auth.backends import ModelBackend
from .models import Servicer

class ServicerBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = Servicer.objects.get(email=email)
            if user.check_password(password):
                return user
        except Servicer.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return Servicer.objects.get(pk=user_id)
        except Servicer.DoesNotExist:
            return None
