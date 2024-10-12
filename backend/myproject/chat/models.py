from django.db import models
from account.models import User
from provider.models import Servicer
from services.models import ServiceBooking


class ChatMessage(models.Model):
    booking = models.ForeignKey(ServiceBooking, on_delete=models.CASCADE,null=True, blank=True)
    sender_user = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE, null=True, blank=True)
    sender_servicer = models.ForeignKey(Servicer, related_name='sent_messages', on_delete=models.CASCADE, null=True, blank=True)
    receiver_user = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE, null=True, blank=True)
    receiver_servicer = models.ForeignKey(Servicer, related_name='received_messages', on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Message from {self.sender_user or self.sender_servicer} to {self.receiver_user or self.receiver_servicer}'

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE, null=True, blank=True)
    sender_type = models.CharField(max_length=10, choices=[('user', 'User'), ('servicer', 'Servicer')])
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)  # Automatically set the timestamp when the record is created
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f'Notification from {self.sender_type} - {"User" if self.sender_type == "user" else "Servicer"}'
