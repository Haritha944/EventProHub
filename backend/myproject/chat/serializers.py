from rest_framework import serializers
from .models import ChatMessage
from provider.serializers import  ServicerProfileSerializer
from account.models import User
from account.serializers import UserProfileSerializer
from services.models import ServiceBooking

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.SerializerMethodField()
    receiver_id = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_id', 'receiver_id', 'message', 'timestamp']

    def get_sender_id(self, obj):
        # Determine whether the sender is a user or servicer
        if obj.sender_user:
            return obj.sender_user.id
        elif obj.sender_servicer:
            return obj.sender_servicer.id
        return None

    def get_receiver_id(self, obj):
        # Determine whether the receiver is a user or servicer
        if obj.receiver_user:
            return obj.receiver_user.id
        elif obj.receiver_servicer:
            return obj.receiver_servicer.id
        return None


class UserServicerSerializer(serializers.ModelSerializer):
    servicer = ServicerProfileSerializer(read_only=True)
    class Meta:
        model=User
        fields =  ['id', 'email', 'name', 'phone_number', 'is_servicer', 'servicer']  