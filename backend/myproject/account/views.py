from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate 
from account.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer
from .models import User

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