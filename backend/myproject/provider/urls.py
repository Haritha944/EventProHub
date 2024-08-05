from django.urls import path
from .views import ServicerRegistrationView,ServicerLoginView,VerifyOTP


urlpatterns = [
    path('register/',ServicerRegistrationView.as_view(), name='servicer_register'),
    path('verify/',VerifyOTP.as_view(),name='verify'),
    path('login/', ServicerLoginView.as_view(),name='servicer_login'),
]
