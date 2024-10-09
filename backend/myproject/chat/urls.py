from django.urls import path
from .views import MessageList,ChatReceiversList,SearchUserView

urlpatterns = [
            
    path('messages/<int:sender_id>/<int:receiver_id>/<str:sender_type>/<str:receiver_type>/', MessageList.as_view(), name='message-list'),
    path('chat/receivers/<int:sender_id>/',ChatReceiversList.as_view(), name='chat-receivers-list'),
    path('user-search/', SearchUserView.as_view(), name='user_search'), 
]