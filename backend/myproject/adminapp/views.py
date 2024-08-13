from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from account.models import User
from rest_framework import status
from provider.models import Servicer
from .serializers import UserSerializers,ServicerSerializers,ServiceSerializers
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny,IsAdminUser
from services.models import Service


class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        email = request.data.get("email")
        print('email',email)
        password = request.data.get("password")
        print('password',password)
        user = authenticate(email=email, password=password)

        if user and user.is_admin:
            return Response({"msg": "Admin Login Success", "user_email": user.email}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"errors": {"non_field_errors": ["Invalid admin credentials"]}},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class UserListView(ListAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializers



@api_view(['PUT'])
@permission_classes([AllowAny])
def admin_user_block(request,pk):
    user = get_object_or_404(User,id=pk)
    user.is_active = False
    user.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([AllowAny])
def admin_user_unblock(request,pk):
    user = get_object_or_404(User,id=pk)
    user.is_active = True
    user.save()
    return Response(status=status.HTTP_200_OK)

class ServicerListView(ListAPIView):
    permission_classes=[AllowAny]
    queryset=Servicer.objects.all()
    serializer_class=ServicerSerializers

@api_view(['PUT'])
@permission_classes([AllowAny])
def admin_servicer_block(request,pk):
    servicer=get_object_or_404(Servicer,id=pk)
    servicer.is_active=False
    servicer.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([AllowAny])
def admin_servicer_unblock(request,pk):
    servicer=get_object_or_404(Servicer,id=pk)
    servicer.is_active=True
    servicer.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([AllowAny])
def approve_service(request, pk):
    try:
        service = get_object_or_404(Service, id=pk)
    except Service.DoesNotExist:
        return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

    if service.is_available:
        return Response({'error': 'Service is already approved'}, status=status.HTTP_400_BAD_REQUEST)

    service.is_available = True
    service.save()

    serializer = ServiceSerializers(service)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['PUT'])
@permission_classes([AllowAny])
def disapprove_service(request, pk):
    service = get_object_or_404(Service, id=pk)
    
    if not service.is_available:
        return Response({'error': 'Service is already disapproved.'}, status=status.HTTP_400_BAD_REQUEST)

    service.is_available = False
    service.save()

    return Response({'status': 'Service has been disapproved and is now unavailable.'}, status=status.HTTP_200_OK)

class ServiceListView(ListAPIView):
    permission_classes=[AllowAny]
    queryset=Service.objects.all()
    serializer_class=ServiceSerializers