from django.urls import path, include
from . import views
from account.views import UserRegistrationView,UserLoginView,UserProfileee,UserProfileView,UserProfileUpdateView,VerifyOTP,test_send_otp,PasswordResetView,PasswordResetRequestView

urlpatterns = [

    path('register/', UserRegistrationView.as_view(),name='register'),
    path('login/', UserLoginView.as_view(),name='login'),
    path('verify/', VerifyOTP.as_view(),name='verify'),
    path('user-navbar/', UserProfileView.as_view(), name='user-navbar'),
    path('user-profile/',UserProfileee.as_view(),name='user-profile'),
    path('user-profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('test-send-otp/', test_send_otp, name='test_send_otp'),
    path('password-reset-request/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    
    
]