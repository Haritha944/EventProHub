from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<sender_id>\d+)/(?P<receiver_id>\d+)/(?P<sender_type>\w+)/(?P<receiver_type>\w+)/$', consumers.ChatConsumer.as_asgi()),
    
]
