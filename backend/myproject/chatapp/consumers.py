# chatapp/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.contenttypes.models import ContentType
from .models import Room, Message
from account.models import User
from provider.models import Servicer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the room name from the URL
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        
        # Add the room to the group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

    async def disconnect(self, close_code):
        # Remove the room from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Parse the received message
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']
        sender_id = text_data_json['sender_id']
        receiver_id = text_data_json['receiver_id']
        
        # Retrieve the room and participants
        room = Room.objects.get(name=self.room_name)
        sender = User.objects.filter(id=sender_id).first() or Servicer.objects.filter(id=sender_id).first()
        receiver = User.objects.filter(id=receiver_id).first() or Servicer.objects.filter(id=receiver_id).first()

        if sender and receiver:
            # Create a new message
            message = Message.objects.create(
                room=room,
                sender_content_type=ContentType.objects.get_for_model(sender),
                sender_object_id=sender.id,
                receiver_content_type=ContentType.objects.get_for_model(receiver),
                receiver_object_id=receiver.id,
                content=message_content
            )
            
            # Send the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_content,
                    'sender_id': sender.id,
                    'receiver_id': receiver.id
                }
            )

    async def chat_message(self, event):
        # Extract message details from the event
        message = event['message']
        sender_id = event['sender_id']
        receiver_id = event['receiver_id']

        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'receiver_id': receiver_id
        }))
