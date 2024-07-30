from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 
from account.emails import *
from account.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,VerifyAccountSerializer
from .models import User
from django.http import JsonResponse


# Create your views here.
def get_tokens_for_user(user):
    refresh=RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self,request,format=None):
        serializer=UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            send_otp_via_email(serializer.data['email'])
            token = get_tokens_for_user(user)
            return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self,request,format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=serializer.data.get('email')
            password=serializer.data.get('password')
            print(f"Attempting to authenticate user: {email}") 
            user=authenticate(email=email,password=password)
            if user is not None:
                token=get_tokens_for_user(user)
                return Response({'token':token,'user_id':user.id,'msg':'Login Success'},status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
            
class UserProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        user=request.user
        try:
            user=User.objects.get(email=user.email)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error":"User detaiils not found"},status=status.HTTP_404_NOT_FOUND)
        
class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        try:
            data=request.data
            serializer = VerifyAccountSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                email=serializer.data['email']
                otp=serializer.data['otp']
                user_queryset = User.objects.filter(email=email)
                if not user_queryset.exists():
                    return Response({
                        'status':400,
                        'message':'Invalid Email',
                        'data':'Invalid Email'
                    },status=status.HTTP_400_BAD_REQUEST)
                user = user_queryset.first()
                if user.otp!=otp:
                    return Response({
                        'status': 400,
                        'message': 'Invalid OTP',
                        'data': 'Invalid OTP'
                    }, status=status.HTTP_400_BAD_REQUEST)
                user.is_active=True
                user.save()     
                return Response({'msg':'Account Verified'},status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({'message':'Something went wrong','status':status.HTTP_500_INTERNAL_SERVER_ERROR}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
def test_send_otp(request):
    email = 'meera@gmail.com'
    send_otp_via_email(email)
    return JsonResponse({'status': 'OTP sent'})