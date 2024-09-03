from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Servicer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView
from provider.emails import *
from payments.models import SubscriptionPlan,SubscriptionPayment
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from account.serializers import PasswordResetSerializer,PasswordResetRequestSerializer
from payments.serializers import SubscriptionPlanSerializer,SubscriptionPaymentSerializer
from .serializers import ServiceSignupSerializer,VerifyAccountSerializer,ServicerLoginSerializer,ServicerProfileSerializer
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
            print("Received Data:", data)
            serializer= VerifyAccountSerializer(data=data)
            print(serializer)
            if serializer.is_valid(raise_exception=True):
                email=serializer.data['email']
                print(f"Email being queried: {email}")
                otp=serializer.data['otp']
                provider_queryset = Servicer.objects.filter(email=email)
                print(provider_queryset)
                if not provider_queryset.exists():
                    return Response({
                        'status':400,
                        'message':'Invalid email',
                        'data':'Invalid email'
                    })
                provider=provider_queryset.first()
                print(f"Provider found: {provider}")
                if provider is None:
                    return Response({
                        'status':400,
                        'message':'Invalid Email',
                        'data':'Invalid email'
                    })
                if provider.otp!=otp:
                    return Response({
                        'status': 400,
                        'message': 'Invalid OTP',
                        'data': 'Invalid OTP'
                    },status=status.HTTP_400_BAD_REQUEST)
                provider.is_active = True
                provider.is_servicer = True
                print(provider)
                provider.save()
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
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email, password=password)
            print(user,"USER")
            if user is not None:
                token = get_tokens_for_user(user)
                print(token,"tokennnnn")
                return Response({'token':token,'msg':'Login Success'},
                    status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}},
                    status=status.HTTP_404_NOT_FOUND)
        
class ServicerProfileView(APIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user=request.user
        print("Authenticated User:", user)
        if isinstance(user, Servicer):
            try:
                servicer=Servicer.objects.get(email=user.email)
                serializer = ServicerProfileSerializer(servicer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Servicer.DoesNotExist:
                return Response({"error": "Owner details not found"}, status=status.HTTP_404_NOT_FOUND)
        

class ServicerProfileUpdateView(APIView):

    def put(self,request,id):
        try:
            servicer=Servicer.objects.get(id=id)
        except Servicer.DoesNotExist:
            return Response({"error":"Servicer not found"}, status=status.HTTP_404_NOT_FOUND)  
        serializer= ServicerProfileSerializer(servicer,data=request.data)   
        if serializer.is_valid():
            serializer.save() 
            print("Success")
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class SubscriptionServicerListView(ListAPIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class = SubscriptionPlanSerializer
    def get_queryset(self):
        user = self.request.user
        
        if not user.is_servicer:
            return SubscriptionPlan.objects.none()
        paid_plans = SubscriptionPayment.objects.filter(servicer=user)
        paid_plans_ids = paid_plans.values_list('subscription_plan_id', flat=True)
        available_plans = SubscriptionPlan.objects.exclude(id__in=paid_plans_ids)
        paid_plans_details = SubscriptionPlan.objects.filter(id__in=paid_plans_ids)
        return available_plans, paid_plans_details
    def list(self, request, *args, **kwargs):
        available_plans, paid_plans_details = self.get_queryset()

        # Serialize both available and paid plans
        available_serializer =  SubscriptionPlanSerializer(available_plans, many=True)
        paid_plans_data = []
        for plan in paid_plans_details:
            payment = SubscriptionPayment.objects.get(subscription_plan=plan, servicer=request.user)
            plan_data = SubscriptionPlanSerializer(plan).data
            end_date_formatted = payment.end_date.strftime('%d %B %Y')  # Example: '03 September 2025'
            plan_data['end_date'] = end_date_formatted
            paid_plans_data.append(plan_data)

        response_data = {
            'available_plans': available_serializer.data,
            'paid_plans': paid_plans_data
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
class ServicerPasswordResetRequestView(APIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                servicer = Servicer.objects.get(email=email)
            except Servicer.DoesNotExist:
                return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
            
            token = default_token_generator.make_token(servicer)
            uid = urlsafe_base64_encode(force_bytes(servicer.pk))
            reset_link = f'http://localhost:3000/servicer-resetpasswrd?uid={uid}&token={token}'

            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class ServicerPasswordResetView(APIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes=[AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token = serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                uid = force_str(urlsafe_base64_decode(uid))
                servicer = Servicer.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, Servicer.DoesNotExist):
                return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if not default_token_generator.check_token(servicer, token):
                return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
            
            servicer.set_password(new_password)
            servicer.save()
            return Response({'message': 'Password has been reset.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)