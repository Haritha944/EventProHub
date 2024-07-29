from django.urls import path, include
from . import views
from account.views import UserRegistrationView,UserLoginView,UserProfileView,VerifyOTP

urlpatterns = [

    path('register/', UserRegistrationView.as_view(),name='register'),
    path('login/', UserLoginView.as_view(),name='login'),
    path('verify/', VerifyOTP.as_view(),name='verify'),
    path('user-navbar/', UserProfileView.as_view(), name='user-navbar'),
]