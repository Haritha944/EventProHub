from django.urls import path,include
from .views import CreateRoomView,ChatMessagesView
from . import views
from . import consumers

websocket_urlpatterns = [
    path("ws/chat/<str:room_name>/", consumers.ChatConsumer.as_asgi()),
]

urlpatterns = [

    path("", include(websocket_urlpatterns)),
    path('roomsCreate/', CreateRoomView.as_view(), name='room-create'),
    path("rooms/", views.RoomListView.as_view(), name="room-list"),
    path("allrooms/", views.AllRoomListView.as_view(), name="room-list"),
    path(
        "rooms/<int:room_id>/messages/",
        views.MessageListView.as_view(),
        name="message-list",
    ),
    path(
        "rooms/<int:room_id>/messages/<int:message_id>/",
        views.MessageDetailView.as_view(),
        name="message-detail",
    ),
    path(
        "rooms/<int:room_id>/chatmessages/",
        ChatMessagesView.as_view(),
        name="chat_messages",
    ),
    path("rooms/<int:room_id>/", views.RoomDetailView.as_view(), name="room-detail"),
    
]