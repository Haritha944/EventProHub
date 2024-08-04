from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Servicer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from provider.emails import *
from .serializers import ServiceSignupSerializer,VerifyAccountSerializer,ServicerLoginSerializer
# Create your views here.
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class ServicerRegistrationView(APIView):
    permission_classes=[AllowAny]
    def post(self,request,format=None):
        serializer = ServiceSignupSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            send_otp_via_mail(serializer.data['email'])
            token = get_tokens_for_user(user)
            return Response({'token': token, 'msg': 'Registration Successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTP(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        try:
            data=request.data
            serializer= VerifyAccountSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                email=serializer.data['email']
                otp=serializer.data['otp']
                provider_queryset=Servicer.objects.filter(email=email)

                if not provider_queryset.exists():
                    return Response({
                        'status':400,
                        'message':'Invalid email',
                        'data':'Invalid email'
                    })
                provider=provider_queryset.first()

                if provider is None:
                    return Response({
                        'status':400,
                        'message':'Invalid Email',
                        'data':'Invalid email'
                    })
                serializer = ServicerLoginSerializer(provider,data={'is_active':True},partial=True)
                if serializer.is_valid():
                    serializer.save()
                return Response({'msg': 'Account Verified'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': 'Something went wrong'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ServicerLoginView(APIView):
    permission_classes=[AllowAny]
    def post(self,request,format=None):
        serializer=ServicerLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            user=authenticate(email=email,password=password)
            print(user,'User')
            if user is not None:
                token = get_tokens_for_user(user)
                print(token,'token')
                return Response({'token':token,'msg':'Login Success'},
                                status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or Password is not valid']}},
                                status=status.HTTP_404_NOT_FOUND)