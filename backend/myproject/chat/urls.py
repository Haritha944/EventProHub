from django.urls import path
from .views import MessageList,ChatReceiversList

urlpatterns = [
            
    path('messages/<int:sender_id>/<int:receiver_id>/<str:sender_type>/<str:receiver_type>/', MessageList.as_view(), name='message-list'),
    path('chat/receivers/<int:sender_id>/',ChatReceiversList.as_view(), name='chat-receivers-list'),

]