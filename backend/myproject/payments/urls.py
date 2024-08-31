from django.urls import path
from .views import SubscriptionPlanListView
from . import views

urlpatterns = [

    path('createplan/',views.addsubscription, name='addsubscription'),
    path('subscriptionlist/', SubscriptionPlanListView.as_view(), name='subscriptionlist'),
    path('subscriptiondel/<int:pk>/', views.delete_subscription, name='subscriptiondel'),
    path('subscriptionedit/<int:pk>/', views.update_subscription, name='subscriptionedit'),
    path('createcheckoutsession/',views.create_checkout_session, name='createcheckoutsession'),
]