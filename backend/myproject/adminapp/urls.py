from django.urls import path
from .views import (AdminLoginView,UserListView,admin_user_block,admin_user_unblock,ServicerListView,admin_servicer_block,admin_servicer_unblock,ServiceListView,AdminBookingList,AdminDashboard)
from . import views



urlpatterns = [
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),
    path("user-list/", UserListView.as_view(), name="user-list"),
    path("user/<int:pk>/block/",views.admin_user_block, name="user-block"),
    path("user/<int:pk>/unblock/",views.admin_user_unblock, name="user-unblock"),
    path("servicer-list/", ServicerListView.as_view(), name="servicer-list"),
    path("servicer/<int:pk>/block/",views.admin_servicer_block, name="servicer-block"),
    path("servicer/<int:pk>/unblock/",views.admin_servicer_unblock, name="servicer-block"),
    path("service-list/", ServiceListView.as_view(), name="service-list"),
    path("service/<int:pk>/approve/",views.approve_service, name="service-approve"),
    path("service/<int:pk>/disapprove/",views.disapprove_service, name="service-disapprove"),
    path("adminsidebooking/",AdminBookingList.as_view(),name="adminsidebooking"),
    path('admindash/',AdminDashboard.as_view(),name='admindash'),
]