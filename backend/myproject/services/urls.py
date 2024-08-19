from django.urls import path
from .views import ServiceListView,UserServiceView,ServiceDetailView,ServicesByServicerView
from . import views



urlpatterns = [
    path('servicelist/', ServiceListView.as_view(), name='servicelist'),  # For listing services
    path('servicecreate/', views.add_service, name='servicecreate'),  
    path('update_service/<int:id>/', views.update_service, name='update_service'),
    path('delete_service/<int:id>/', views.delete_service, name='delete_service'),
    path('servicelistuser/',UserServiceView.as_view(), name='servicelistuser'),
    path('servicelistuser/<str:city>/', UserServiceView.as_view(), name='service-list-by-city'),
    path('servicedetail/<int:serviceId>/', ServiceDetailView.as_view(), name='servicedetail'),
    path('relatedservicer/<int:servicer_id>/', ServicesByServicerView.as_view(), name='relatedservicer'),
]