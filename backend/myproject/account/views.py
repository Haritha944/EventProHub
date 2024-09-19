from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 
from account.emails import *
from account.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,VerifyAccountSerializer,PasswordResetRequestSerializer,PasswordResetSerializer
from .models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view


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
    


# class UserLoginView(APIView):
#     permission_classes = [AllowAny]
#     def post(self,request,format=None):
#         serializer = UserLoginSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             email=serializer.data.get('email')
#             password=serializer.data.get('password')
#             print(f"Attempting to authenticate user: {email}") 
#             user=authenticate(email=email,password=password)
#             email_user=User.object.get(email=email)
#             user_obj=UserProfileSerializer.email_user.data
#             if user is not None:
#                 token=get_tokens_for_user(user)
#                 return Response({'token':token,'user':user_obj,'msg':'Login Success'},status=status.HTTP_200_OK)
#             else:
#                 return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
            

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            # Print log message for debugging
            print(f"Attempting to authenticate user: {email}")

            # Authenticate the user
            user = authenticate(email=email, password=password)

            if user is not None:
                # Get serialized user data
                user_profile = UserProfileSerializer(user).data

                # Generate token for the user
                token = get_tokens_for_user(user)

                # Send response with token and full user data
                return Response(
                    {
                        'token': token,
                        'user': user_profile,
                        'msg': 'Login Success'
                    },
                    status=status.HTTP_200_OK
                )
            else:
                # Invalid login, return error response
                return Response(
                    {'errors': {'non_field_errors': ['Email or Password is not valid']}},
                    status=status.HTTP_404_NOT_FOUND
                )

            
class UserProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        user=request.user
        print(user)
        user=User.objects.get(email=user)
        print(user)
        try:
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

class UserProfileUpdateView(APIView):
    
    def put(self,request):
        user=request.user
        serializer=UserProfileSerializer(user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UserProfileee(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user=request.user
        print(user)
        try:
            user=User.objects.get(email=user.email)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error":"User detaiils not found"},status=status.HTTP_404_NOT_FOUND)
        


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f'http://localhost:3000/reset-password?uid={uid}&token={token}'

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                uid = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not default_token_generator.check_token(user, token):
                return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
