from django.db import models
from account.models import User
from provider.models import Servicer
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=255,blank=True)
    image = models.ImageField(upload_to='room_images/', blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name if self.name else f"Chat between {self.user.name} and {self.servicer.name}"
    def get_last_message(self):
        last_message = self.messages.last()
        return last_message
    def get_unread_count(self, participant):
        unread_count = self.messages.filter(receiver=participant, is_read=False).count()  # Assumes a 'receiver' field in Message
        return unread_count


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    
    # Fields for generic foreign key to handle sender
    sender_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    sender_object_id = models.PositiveIntegerField()
    sender = GenericForeignKey('sender_content_type', 'sender_object_id')
    
    # Fields for generic foreign key to handle receiver
    receiver_content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='received_messages_set')
    receiver_object_id = models.PositiveIntegerField()
    receiver = GenericForeignKey('receiver_content_type', 'receiver_object_id')
    
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} in room {self.room.id}"
