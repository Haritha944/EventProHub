from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from datetime import datetime
from account.models import User
from provider.models import Servicer
from .models import ChatMessage,Notification



class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connected.............")
        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.receiver_id = self.scope['url_route']['kwargs']['receiver_id']
        self.sender_type = self.scope['url_route']['kwargs']['sender_type']  # 'user' or 'servicer'
        self.receiver_type = self.scope['url_route']['kwargs']['receiver_type']  # 'user' or 'servicer'
        print(self.sender_id,"\n",self.receiver_id,"\n",self.sender_type,"\n",self.receiver_type)
        # Generate room group name based on sender and receiver IDs
        if self.sender_id and self.receiver_id and self.sender_id > self.receiver_id:
            self.room_group_name = f'chat_{self.receiver_id}_{self.sender_id}'
        else:
            self.room_group_name = f'chat_{self.sender_id}_{self.receiver_id}'

        print(self.room_group_name)
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        print("disconnected................")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print("recieve...............")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Retrieve the sender and receiver from the database
        try:
            sender = await self.get_sender()
            receiver = await self.get_receiver()

            # Save the message to the database
            message_instance = await self.create_message_instance(sender, receiver, message)

            # Send the message to the receiver's group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': self.sender_id,
                    'sender_type': self.sender_type,
                    'receiver': self.receiver_id  
                }
            )
            

        except (User.DoesNotExist, Servicer.DoesNotExist):
            # Handle the case where the sender or receiver does not exist
            await self.send(text_data=json.dumps({
                'error': 'User or servicer does not exist.'
            }))

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender']
        sender_type = event['sender_type'] 
        receiver_id  =event['receiver']
        timestamp = datetime.now().isoformat()
       

        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'sender_type': sender_type,
            'receiver_id':receiver_id,
            'timestamp': timestamp 
            
        }))

    

    @database_sync_to_async
    def get_sender(self):
        if self.sender_type == 'user':
            return User.objects.get(id=self.sender_id)
        else:  # sender_type == 'servicer'
            return Servicer.objects.get(id=self.sender_id)

    @database_sync_to_async
    def get_receiver(self):
        if self.receiver_type == 'user':
            return User.objects.get(id=self.receiver_id)
        else:  # receiver_type == 'servicer'
            return Servicer.objects.get(id=self.receiver_id)

    @database_sync_to_async
    def create_message_instance(self, sender, receiver, message):
        # Create a ChatMessage instance with the correct sender and receiver types
        if self.sender_type == 'user':
            sender_user = sender
            sender_servicer = None
        else:
            sender_user = None
            sender_servicer = sender

        if self.receiver_type == 'user':
            receiver_user = receiver
            receiver_servicer = None
        else:
            receiver_user = None
            receiver_servicer = receiver

        return ChatMessage.objects.create(
            booking=None,  # Assuming no booking here, but you can add booking if needed
            sender_user=sender_user,
            sender_servicer=sender_servicer,
            receiver_user=receiver_user,
            receiver_servicer=receiver_servicer,
            message=message
        )
    
class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.sender_type = 'servicer' if getattr(self.user, 'is_servicer', False) else 'user'  # Determine user type
        self.group_name = f'notifications_{self.user.id}'  # Unique group for each user

        # Join notification group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()  # Accept the WebSocket connection

    async def disconnect(self, close_code):
        # Leave notification group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        notification = event['notification']
        notification['user_type'] = self.user_type  # Add user type to the notification data
        await self.send(text_data=json.dumps(notification))  # Send notification to WebSocket

    @database_sync_to_async
    def save_notification(self, user, servicer, sender_type, message):
        # Save notification to the database
        return Notification.objects.create(
            user=user,
            servicer=servicer,
            sender_type=sender_type,
            message=message
        )