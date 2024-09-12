from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from account.models import User
from provider.models import Servicer
from django.contrib.contenttypes.models import ContentType
from .models import Room,Message
from .serializers import RoomSerializer,MessageSerializer

class CreateRoomView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        servicer_id = request.data.get('servicer')

        if not user_id or not servicer_id:
            return Response(
                {"error": "User and servicer IDs are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Fetch the User and Servicer objects
            user = User.objects.get(id=user_id)
            servicer = Servicer.objects.get(id=servicer_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Servicer.DoesNotExist:
            return Response(
                {"error": "Servicer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the room already exists
        existing_room = Room.objects.filter(user=user, servicer=servicer).first()
        if existing_room:
            serializer = RoomSerializer(existing_room)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create a new room
        room = Room.objects.create(user=user, servicer=servicer)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
class RoomListView(APIView):
    def get(self, request):
        servicer_id = request.query_params.get("servicer")
        user_id = request.query_params.get("user")
        
        if servicer_id and user_id:
            rooms = Room.objects.filter(servicer=servicer_id, user=user_id)
        elif servicer_id:
            rooms = Room.objects.filter(servicer=servicer_id)
        elif user_id:
            rooms = Room.objects.filter(user=user_id)
        else:
            return Response({"error": "Either servicer ID or user ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        user_id = request.data.get('user')
        servicer_id = request.data.get('servicer')

        if not user_id or not servicer_id:
            return Response(
                {"error": "User and servicer IDs are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
            servicer = Servicer.objects.get(id=servicer_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Servicer.DoesNotExist:
            return Response(
                {"error": "Servicer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the room already exists
        existing_room = Room.objects.filter(user=user, servicer=servicer).first()
        if existing_room:
            return Response(
                {"message": "Room already exists.", "room": RoomSerializer(existing_room).data},
                status=status.HTTP_200_OK
            )
        
        # Create a new room
        room = Room.objects.create(user=user, servicer=servicer)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AllRoomListView(APIView):
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

class RoomDetailView(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = RoomSerializer(room)
        return Response(serializer.data)
    
class MessageListView(APIView):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND
            )
        messages = room.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    def post(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND
            )
        
        # Add room_id to the request data
        request.data['room'] = room.id
        
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            # Save the new message
            message = serializer.save()
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MessageDetailView(APIView):
    def get(self, request, room_id, message_id):
        # Check if the room exists
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if the message exists within the room
        try:
            message = room.messages.get(id=message_id)
        except Message.DoesNotExist:
            return Response(
                {"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND
            )
        
        # Serialize and return the message
        serializer = MessageSerializer(message)
        return Response(serializer.data)
    
class ChatMessagesView(APIView):
    def get(self, request, room_id):
        user_id = request.query_params.get("user")
        servicer_id = request.query_params.get("servicer")

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return Response(
                {"error": "Room not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if user_id:
            try:
                user_id = int(user_id)
            except ValueError:
                return Response(
                    {"error": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST
                )
            user_content_type = ContentType.objects.get_for_model(User)
            messages = Message.objects.filter(
                room=room,
                sender_content_type=user_content_type,
                sender_object_id=user_id
            ) | Message.objects.filter(
                room=room,
                receiver_content_type=user_content_type,
                receiver_object_id=user_id
            )
        
        elif servicer_id:
            try:
                servicer_id = int(servicer_id)
            except ValueError:
                return Response(
                    {"error": "Invalid servicer ID."}, status=status.HTTP_400_BAD_REQUEST
                )
            servicer_content_type = ContentType.objects.get_for_model(Servicer)
            messages = Message.objects.filter(
                room=room,
                sender_content_type=servicer_content_type,
                sender_object_id=servicer_id
            ) | Message.objects.filter(
                room=room,
                receiver_content_type=servicer_content_type,
                receiver_object_id=servicer_id
            )
        
        else:
            messages = room.messages.all()

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)