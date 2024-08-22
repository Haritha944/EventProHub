from django.urls import path
from .views import ServicerRegistrationView,ServicerLoginView,VerifyOTP,ServicerProfileView,ServicerProfileUpdateView,SubscriptionServicerListView,ServicerPasswordResetRequestView,ServicerPasswordResetView


urlpatterns = [
    path('register/',ServicerRegistrationView.as_view(), name='servicer_register'),
    path('verify/',VerifyOTP.as_view(),name='verify'),
    path('login/', ServicerLoginView.as_view(),name='servicer_login'),
    path('servicer_profile/', ServicerProfileView.as_view(), name='servicer_profile'),
    path('servicer_profile/update/<int:id>/', ServicerProfileUpdateView.as_view(), name='servicer_profile_update'),
    path('servicersubscriptionlist/', SubscriptionServicerListView.as_view(), name='servicersubscription'),
    path('servicer-reset-request/', ServicerPasswordResetRequestView.as_view(), name='password-reset-request'),
    path('passwordservicer-reset/', ServicerPasswordResetView.as_view(), name='password-reset'),
]
