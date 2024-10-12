from django.urls import path
from .views import MessageList,ChatReceiversList,SearchUserView,SearchServicerView,NotificationListView,MarkNotificationRead

urlpatterns = [
            
    path('messages/<int:sender_id>/<int:receiver_id>/<str:sender_type>/<str:receiver_type>/', MessageList.as_view(), name='message-list'),
    path('chat/receivers/<int:sender_id>/<str:sender_type>/',ChatReceiversList.as_view(), name='chat-receivers-list'),
    path('user-search/', SearchUserView.as_view(), name='user_search'), 
    path('servicer-search/', SearchServicerView.as_view(), name='servicer_search'), 
    path('notifications/<int:receiver_id>/<str:sender_type>/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/update/',MarkNotificationRead.as_view(), name='mark-as-read'),
]