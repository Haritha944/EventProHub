from django.urls import path
from .views import ServiceListView
from . import views



urlpatterns = [
    path('servicelist/', ServiceListView.as_view(), name='servicelist'),  # For listing services
    path('servicecreate/', views.add_service, name='servicecreate'),  
   
]