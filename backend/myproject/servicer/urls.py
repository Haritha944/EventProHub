from django.urls import path, include
from .views import ServicerRegistrationView

urlpatterns = [
        
    path('register/', ServicerRegistrationView.as_view(), name='owner-register'),

]