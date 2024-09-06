from django.urls import path
from .views import ServiceListView,UserServiceView,ServiceDetailView,ServicesByServicerView,ServicesByLocationView,OtherFiltersView,BookingCreateView,BookingListView,PaymentSuccessView,ServiceBookingsView,CancelBookingView
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
    path('relatedlocation/<str:city>/', ServicesByLocationView.as_view(), name='relatedservicer'),
    path('servicelistfilter/',OtherFiltersView.as_view(), name='servicelistfilter'),
    path('bookings/', BookingCreateView.as_view(), name='create_booking'),
    path('bookingslist/', BookingListView.as_view(), name='booking-list'),
    path('paymentsucess/', PaymentSuccessView.as_view(), name='paymentsucess'),
    path('approveservice/<int:pk>/', views.approve_service_booking, name='approveservice'),
    path('approvebooking/<int:servicer_id>/',ServiceBookingsView.as_view(), name='approvebooking'),
    path('disapproveservice/<int:pk>/', views.disapprove_booking, name='disapproveservice'),
    path('cancel-booking/', CancelBookingView.as_view(), name='cancel_booking'),


]