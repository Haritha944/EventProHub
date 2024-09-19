from django.urls import path
from .views import SubscriptionPlanListView,CreateCheckoutView
from . import views

urlpatterns = [

    path('createplan/',views.addsubscription, name='addsubscription'),
    path('subscriptionlist/', SubscriptionPlanListView.as_view(), name='subscriptionlist'),
    path('subscriptiondel/<int:pk>/', views.delete_subscription, name='subscriptiondel'),
    path('subscriptionedit/<int:pk>/', views.update_subscription, name='subscriptionedit'),
    path('createcheckoutsession/',views.create_checkout_session, name='createcheckoutsession'),
    path('createcheckout/',CreateCheckoutView.as_view(), name='createcheckout'),
    path('reviews/<int:service_id>/', views.get_reviews, name='review-list-create'),
    path('reviews/edit/<int:review_id>/', views.edit_review, name='edit_review'),
    path('reviews/delete/<int:review_id>/',views.delete_review, name='delete_review'),
    path('add-review/<int:service_id>/', views.add_review, name='add_review'),
]