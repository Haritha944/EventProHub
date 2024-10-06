from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Service,ServiceBooking
from provider.models import Servicer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from .serializers import ServiceSerializer,ServiceDetailSerializer,ServiceBookingSerializer,BookingListSerializer
from provider.emails import ServicerAuthentication
from account.serializers import UserProfileSerializer
import stripe
from account.models import User
from account.views import get_tokens_for_user
from django.core.mail import send_mail
from django.conf import settings
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@authentication_classes([ServicerAuthentication])
@permission_classes([IsAuthenticated])
def add_service(request):
    if request.method == 'POST':
        servicer = Servicer.objects.get(email=request.user.email)
        name = request.data.get('name')
        city = request.data.get('city')
        service_type = request.data.get('service_type')
        description = request.data.get('description')
        price = request.data.get('price')
        price_per_sqft = request.data.get('price_per_sqft')
        employees_required = request.data.get('employees_required')
        period = request.data.get('period')
        images = request.data.get('images')
        additional_notes = request.data.get('additional_notes')
        try:
            service=Service.objects.create(
                name=name,
                servicer=servicer,
                servicer_name=servicer.name,
                servicer_phone_number=servicer.phone_number,
                city=city,
                service_type=service_type,
                description=description,
                price=price,
                price_per_sqft=price_per_sqft,
                employees_required=employees_required,
                period=period,
                images=images,
                additional_notes=additional_notes,
            )
            serializer = ServiceSerializer(service)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Servicer.DoesNotExist:
            return Response({'error': 'Servicer does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'error': 'Invalid request method.'}, status=status.HTTP_400_BAD_REQUEST)


class ServiceListView(APIView):
    authentication_classes = [ServicerAuthentication]  # Specify authentication class
    permission_classes = [IsAuthenticated] 
    def get(self,request):
        servicer=request.user
        services=Service.objects.filter(servicer=servicer)
        serializer=ServiceSerializer(services,many=True)
        return Response(serializer.data)
    

@api_view(['POST'])
@authentication_classes([ServicerAuthentication])
@permission_classes([IsAuthenticated])    
def update_service(request,id):
    try:
        service=Service.objects.get(id=id)
        serializer = ServiceSerializer(service,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Service.DoesNotExist:
        return Response({'error': 'service not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['DELETE'])
@authentication_classes([ServicerAuthentication])
@permission_classes([IsAuthenticated])
def delete_service(request, id):
    try:
        service = Service.objects.get(id=id)
        if service.servicer.email != request.user.email:
            return Response({"error": "You are not authorized to delete this service."}, status=status.HTTP_403_FORBIDDEN)
        service.delete()
        return Response({"message": "Service deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class UserServiceView(APIView):
    permission_classes=[AllowAny]
    def get(self,request,city=None):
        if city:
            services=Service.objects.filter(city__iexact=city)
        else:
            services=Service.objects.all()
        serializer=ServiceSerializer(services,many=True)
        return Response(serializer.data)

class ServiceDetailView(APIView):
    permission_classes=[AllowAny]
    def get(self,request,serviceId):
        try:
            service=Service.objects.get(id=serviceId)
            print(service)
            serializer = ServiceDetailSerializer(service)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)
        
    
class ServicesByLocationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, city):
        services = Service.objects.filter(city__iexact=city)
        print(services)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
class OtherFiltersView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):
        filters = request.data
        services = Service.objects.all()

        service_type = filters.get('service_type')
        if service_type:
            services = services.filter(service_type__iexact=service_type)
        
        min_price = filters.get('min_price')
        if min_price:
            services = services.filter(price__gte=min_price)
        
        max_price = filters.get('max_price')
        if max_price:
            services = services.filter(price__lte=max_price)
        
        min_price_per_sqft = filters.get('min_price_per_sqft')
        if min_price_per_sqft:
            services = services.filter(price_per_sqft__gte=min_price_per_sqft)
        
        max_price_per_sqft = filters.get('max_price_per_sqft')
        if max_price_per_sqft:
            services = services.filter(price_per_sqft__lte=max_price_per_sqft)

        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)




class BookingCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        print("Data received:", request.data)
        serializer = ServiceBookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class BookingListView(APIView):
    permission_classes = [AllowAny]
    def get(self,request,format=None):
        if request.user:
            user=request.user
        else:
            user_id = request.query_params.get('user_id')
            if not user_id:
                return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        bookings=ServiceBooking.objects.filter(user=user,is_paid=True).order_by('-id')
        serializer = BookingListSerializer(bookings,many=True)
        return Response(serializer.data)

class PaymentSuccessView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        price_paid = request.query_params.get('price_paid')
        if not price_paid:
            return Response({'error': 'Price paid is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            
            booking = ServiceBooking.objects.filter(price_paid=price_paid).last()
            print(booking)
            #if booking.status != "Paid":
                #return Response({'error': 'Booking is not paid'}, status=status.HTTP_400_BAD_REQUEST)
            
            booking.status = "Paid"  # Update status to Paid
            booking.is_paid = True 
            booking.save()  
            user = booking.user     # Assuming the ServiceBooking model has a ForeignKey to the User model
            #tokens = get_tokens_for_user(user)
            serializer = UserProfileSerializer(user)
            return Response({
                'user': serializer.data,
                #'token': tokens, 
                'email': user.email, # Include tokens in the response
            }, status=status.HTTP_200_OK)
        
        except ServiceBooking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
           
@api_view(['PUT'])
@permission_classes([AllowAny])
def approve_service_booking(request, pk):
    try:
        booking = ServiceBooking.objects.get(pk=pk)
    except ServiceBooking.DoesNotExist:
        return Response({'error': 'Service booking not found'}, status=status.HTTP_404_NOT_FOUND)

    booking.approval_by_servicer = True
    booking.status = 'Approved'
    booking.save()
    subject = 'Your Service Booking Has Been Approved'
    message = f"Dear {booking.user.name},\n\nYour booking for {booking.service.name} on {booking.service_date} at {booking.service_time} has been approved by the servicer."
    recipient_list = [booking.user.email]  # Assuming the user has an email field
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)

    serializer = BookingListSerializer(booking)
    return Response(serializer.data, status=status.HTTP_200_OK)


class ServiceBookingsView(APIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes=[AllowAny]
    def get(self, request, servicer_id):
        servicer = get_object_or_404(Servicer, id=servicer_id)
        bookings = ServiceBooking.objects.filter(servicer=servicer,is_canceled=False)
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['PUT'])
@permission_classes([AllowAny])
def disapprove_booking(request, pk):
    try:
        booking = ServiceBooking.objects.get(pk=pk)
    except ServiceBooking.DoesNotExist:
        return Response({'error': 'Service booking not found'}, status=status.HTTP_404_NOT_FOUND)

    booking.approval_by_servicer = False
    booking.status = 'Pending'
    booking.save()

    serializer = BookingListSerializer(booking)
    return Response(serializer.data, status=status.HTTP_200_OK)



class CancelBookingView(APIView):
    permission_classes = [AllowAny] # Assuming only authenticated users can cancel bookings

    def post(self, request):
        booking_id = request.data.get('booking_id')
        print("first",booking_id)

        if not booking_id:
            return Response({"error": "Booking ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = ServiceBooking.objects.get(pk=booking_id)
            print(booking_id)
        except ServiceBooking.DoesNotExist:
            return Response({"error": "Booking not found or you are not authorized to cancel this booking"}, status=status.HTTP_404_NOT_FOUND)

        if booking.is_canceled:
            return Response({"error": "Booking is already canceled"}, status=status.HTTP_400_BAD_REQUEST)
        if booking.stripe_session_id:
            try:
                session = stripe.checkout.Session.retrieve(booking.stripe_session_id)
                payment_intent_id = session.payment_intent
                print(payment_intent_id)
                payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                print(payment_intent)
                if payment_intent.status not in ['succeeded', 'requires_capture']:
                    return Response({"error": "Payment intent is not completed successfully"}, status=status.HTTP_400_BAD_REQUEST)
                charge_id = payment_intent['latest_charge']
                print(f"Charge ID: {charge_id}")
                charge = stripe.Charge.retrieve(charge_id)
                amount_to_refund= int(booking.price_paid * Decimal(0.85))
                refund=stripe.Refund.create(
                    charge=charge,
                    amount=amount_to_refund*100
                )
                booking.status = 'Canceled'
                booking.is_canceled = True
                booking.save()

                serializer = BookingListSerializer(booking)
                return Response({"message": "Booking has been canceled", "data": serializer.data}, status=status.HTTP_200_OK)
            except stripe.error.StripeError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Booking has been canceled"}, status=status.HTTP_200_OK)

            
@api_view(['PUT'])
@permission_classes([AllowAny])
def completeservices(request,pk):
    try:
        booking=ServiceBooking.objects.get(pk=pk)
    except ServiceBooking.DoesNotExist:
        return Response({'error': 'Service booking not found'}, status=status.HTTP_404_NOT_FOUND)
    if not booking.approval_by_servicer:
        return Response({'error':'Service booking is not approved by servicer'},status=status.HTTP_400_BAD_REQUEST)
    booking.status = 'Completed'
    booking.save()
    serializer=BookingListSerializer(booking)
    return Response(serializer.data,status=status.HTTP_200_OK)

