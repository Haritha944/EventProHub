from django.db.models import Q
from rest_framework import generics,filters
from rest_framework.permissions import AllowAny
from .models import ChatMessage,Notification
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from account.models import User
from rest_framework.response import Response
from provider.models import Servicer
from .serializers import ChatMessageSerializer,UserServicerSerializer,NotificationSerializer
from account.serializers import UserProfileSerializer
from provider.serializers import ServicerProfileSerializer

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
        sender_type = self.kwargs.get('sender_type') 
        if not sender_id or not sender_type:
            return [] 
        sent_messages = received_messages = ChatMessage.objects.none()

        if sender_type == 'user':
            # Fetch messages sent and received by the User
            sent_messages = ChatMessage.objects.filter(sender_user=sender_id)
            received_messages = ChatMessage.objects.filter(receiver_user=sender_id)
        elif sender_type == 'servicer':
            # Fetch messages sent and received by the Servicer
            sent_messages = ChatMessage.objects.filter(sender_servicer=sender_id)
            received_messages = ChatMessage.objects.filter(receiver_servicer=sender_id)
        else:
            return None  # Invalid sender_type

        #sender_user = User.objects.filter(id=sender_id).exists()
        #sender_servicer = Servicer.objects.filter(id=sender_id).exists()
        #sent_messages = received_messages = ChatMessage.objects.none() 
        #if sender_user:
                
            #sent_messages = ChatMessage.objects.filter(sender_user=sender_id)
            #received_messages = ChatMessage.objects.filter(receiver_user=sender_id)
        #elif sender_servicer:
               
            #sent_messages = ChatMessage.objects.filter(sender_servicer=sender_id)
            #received_messages = ChatMessage.objects.filter(receiver_servicer=sender_id)
        #else:
            #return None  # Invalid sender_id

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
    permission_classes=[AllowAny]

    queryset = User.objects.filter(is_servicer=False, is_active=True)  # Adjust the queryset based on your model fields
    serializer_class = UserProfileSerializer  # Specify the serializer for the User model
    filter_backends = [filters.SearchFilter]  # Enable search functionality
    search_fields = ['id','email','name','phone_number','is_servicer'] 

class SearchServicerView(generics.ListAPIView):
    permission_classes=[AllowAny]
    
    queryset = Servicer.objects.filter(is_servicer=True, is_active=True)  # Adjust the queryset based on your model fields
    serializer_class = ServicerProfileSerializer  # Specify the serializer for the User model
    filter_backends = [filters.SearchFilter]  # Enable search functionality
    search_fields = ['id','email','name','phone_number','is_servicer'] 

class NotificationListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        receiver_id = self.kwargs.get('receiver_id')
        sender_type = self.kwargs.get('sender_type')

        if sender_type == 'user':
            # Fetch notifications for the user
            return Notification.objects.filter(servicer=receiver_id,sender_type="user")

        elif sender_type == 'servicer':
            # Fetch notifications for the servicer
            return Notification.objects.filter(user=receiver_id,sender_type="servicer")

        # Return an empty queryset if sender_type is not valid
        return Notification.objects.none()

    def get(self, request, *args, **kwargs):
        """
        Override the GET method to return notifications in a custom format.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class MarkNotificationRead(APIView):
    def get(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id)
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read.'}, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found.'}, status=status.HTTP_404_NOT_FOUND)