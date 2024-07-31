from django.urls import path
from .views import ServicerRegistrationView


urlpatterns = [
    path('register/', ServicerRegistrationView.as_view(), name='owner-register'),
]
