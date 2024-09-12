from rest_framework import serializers
from .models import Room, Message
from django.contrib.contenttypes.models import ContentType
from account.serializers import UserProfileSerializer
from provider.serializers import ServicerSerializer

class RoomSerializer(serializers.ModelSerializer):
    user =  UserProfileSerializer(read_only=True)
    servicer = ServicerSerializer(read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'name', 'image', 'user', 'servicer', 'created_at', 'user_name', 'servicer_name', 'last_message', 'unread_count']

    def get_last_message(self, obj):
        last_message = obj.get_last_message()
        if last_message:
            return MessageSerializer(last_message).data
        return None

    def get_unread_count(self, obj):
        request_user = self.context['request'].user
        return obj.get_unread_count(request_user)

class MessageSerializer(serializers.ModelSerializer):
    sender_type = serializers.SerializerMethodField()
    receiver_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'sender_type', 'receiver', 'receiver_type', 'content', 'timestamp', 'is_read']

    def get_sender_type(self, obj):
        return ContentType.objects.get_for_model(obj.sender).model

    def get_receiver_type(self, obj):
        return ContentType.objects.get_for_model(obj.receiver).model

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add sender and receiver data if needed
        representation['sender'] = {
            'id': instance.sender.id,
            'type': self.get_sender_type(instance),
            'name': instance.sender.name if hasattr(instance.sender, 'name') else str(instance.sender)
        }
        representation['receiver'] = {
            'id': instance.receiver.id,
            'type': self.get_receiver_type(instance),
            'name': instance.receiver.name if hasattr(instance.receiver, 'name') else str(instance.receiver)
        }
        return representation