from django.db.models import Q
from rest_framework import generics,filters
from rest_framework.permissions import AllowAny
from .models import ChatMessage
from account.models import User
from provider.models import Servicer
from .serializers import ChatMessageSerializer,UserServicerSerializer
from account.serializers import UserProfileSerializer

class MessageList(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ChatMessageSerializer
    pagination_class = None  # Optional: Add pagination later if needed

    def get_queryset(self):
        sender_id = self.kwargs.get('sender_id')    
        receiver_id = self.kwargs.get('receiver_id')
        sender_type = self.kwargs.get('sender_type')  # 'user' or 'servicer'
        receiver_type = self.kwargs.get('receiver_type')  # 'user' or 'servicer'

        # Ensure sender_id, receiver_id, sender_type, and receiver_type are provided
        if not (sender_id and receiver_id and sender_type and receiver_type):
            return ChatMessage.objects.none()  # Return empty queryset if IDs or types are missing

        # Build the query dynamically depending on the sender and receiver types
        query = Q()
        
        # If the sender is a user and the receiver is a servicer
        if sender_type == 'user' and receiver_type == 'servicer':
            query = Q(sender_user=sender_id, receiver_servicer=receiver_id) | Q(sender_servicer=receiver_id, receiver_user=sender_id)
        
        # If the sender is a servicer and the receiver is a user
        elif sender_type == 'servicer' and receiver_type == 'user':
            query = Q(sender_servicer=sender_id, receiver_user=receiver_id) | Q(sender_user=receiver_id, receiver_servicer=sender_id)

        # Filter and order by timestamp
        return ChatMessage.objects.filter(query).order_by('timestamp')
    

class ChatReceiversList(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserServicerSerializer
    ordering = ('-timestamp')
    
    def get_queryset(self):
        sender_id = self.kwargs.get('sender_id')
        if not sender_id:
            return []
        sender_user = User.objects.filter(id=sender_id).exists()
        sender_servicer = Servicer.objects.filter(id=sender_id).exists()
        sent_messages = received_messages = ChatMessage.objects.none() 
        if sender_user:
                
            sent_messages = ChatMessage.objects.filter(sender_user=sender_id)
            received_messages = ChatMessage.objects.filter(receiver_user=sender_id)
        elif sender_servicer:
               
            sent_messages = ChatMessage.objects.filter(sender_servicer=sender_id)
            received_messages = ChatMessage.objects.filter(receiver_servicer=sender_id)
        else:
            return None  # Invalid sender_id

            # Get distinct user and servicer IDs who have communicated with the sender
        user_receivers = sent_messages.values_list('receiver_user', flat=True).distinct()
        servicer_receivers = sent_messages.values_list('receiver_servicer', flat=True).distinct()

        user_senders = received_messages.values_list('sender_user', flat=True).distinct()
        servicer_senders = received_messages.values_list('sender_servicer', flat=True).distinct()

            # Fetch the User and Servicer objects corresponding to the distinct IDs
        user_queryset = User.objects.filter(id__in=user_receivers.union(user_senders))
        servicer_queryset = Servicer.objects.filter(id__in=servicer_receivers.union(servicer_senders))

            # Combine the two querysets (you can return both as a combined result or separately)
        combined_queryset = list(user_queryset) + list(servicer_queryset)
        return combined_queryset

class SearchUserView(generics.ListAPIView):
  
    queryset = User.objects.filter(is_servicer=False, is_active=True)  # Adjust the queryset based on your model fields
    serializer_class = UserProfileSerializer  # Specify the serializer for the User model
    filter_backends = [filters.SearchFilter]  # Enable search functionality
    search_fields = ['id','email','name','phone_number','is_servicer'] 