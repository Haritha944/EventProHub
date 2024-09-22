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
from django.db.models.functions import TruncMonth, TruncYear,TruncDate
from rest_framework.permissions import AllowAny,IsAdminUser
from services.serializers import BookingListSerializer
from services.models import Service,ServiceBooking
from django.db.models import Sum,Avg
from datetime import datetime
from payments.models import SubscriptionPayment
from django.utils import timezone


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
    servicer=service.servicer
    try:
        subscription=SubscriptionPayment.objects.filter(servicer=servicer,is_paid=True).latest('end_date')
    except SubscriptionPayment.DoesNotExist:
        return Response({'error': 'Servicer does not have an active or paid subscription'}, status=status.HTTP_400_BAD_REQUEST)
    
    if subscription.end_date < timezone.now():
        return Response({'error': 'Servicer subscription has expired'}, status=status.HTTP_400_BAD_REQUEST)
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
    serializer_class=ServiceSerializers
    def get_queryset(self):
        queryset = Service.objects.all()
        service_type = self.request.query_params.get('service_type', None)
        if service_type:
            queryset = queryset.filter(service_type=service_type)
        return queryset
    
#<--------AdminSide bookings------------->
class AdminBookingList(ListAPIView):
    permission_classes=[AllowAny]
    queryset=ServiceBooking.objects.all()
    serializer_class=BookingListSerializer
#<---------------------------------------->

#<--------AdminSide dasboard--------------->
class AdminDashboard(ListAPIView):
    permission_classes=[AllowAny]
    def get(self,request):
        start_date=request.query_params.get('start_date')
        end_date=request.query_params.get("end_date")
        totalbookings = ServiceBooking.objects.exclude(status='Canceled')
        if start_date and end_date:
            start_date=datetime.strptime(start_date,'%Y-%m-%d')
            end_date=datetime.strptime(end_date,'%Y-%m-%d')
            bookings=totalbookings.filter(date__range=(start_date,end_date))
        else:
            bookings=totalbookings
        totalsales = totalbookings.aggregate(total_sales=Sum('price_paid')).get('totalsales') or 0
        total_users=User.objects.count()
        total_servicers=Servicer.objects.count()
        total_sales = totalbookings.aggregate(total_sales=Sum('price_paid')).get('total_sales') or 0
        #top_services=Service.objects.annotate(average_rating=Avg('review__stars')).order_by('-average_rating')[:5]
        daily_sales=( 
            totalbookings.annotate(date=TruncDate('service_date'))
            .values('date')
            .annotate(total_sales=Sum('price_paid'))
            .order_by('date')
            )
        monthly_sales = (
            totalbookings.annotate(month=TruncMonth('service_date'))
            .values('month')
            .annotate(total_sales=Sum('price_paid'))
            .order_by('month')
        )
        yearly_sales = (
            totalbookings.annotate(year=TruncYear('service_date'))
            .values('year')
            .annotate(total_sales=Sum('price_paid'))
            .order_by('year')
        )
        dailysales = (
              bookings.annotate(date=TruncDate('service_date'))
              .values('date')
              .annotate(totalsales=Sum('price_paid'))
               .order_by('date')
              )
        sales_data = {sale['date'].strftime('%Y-%m-%d'): sale['totalsales'] for sale in dailysales}

        subscribed_servicers = SubscriptionPayment.objects.select_related('servicer').all()

        response_data={
            'total_users':total_users,
            'total_servicers':total_servicers,
            'total_sales':total_sales,
            'monthly_sales':list(monthly_sales),
            'yearly_sales':list(yearly_sales),
            'daily_sales':list(daily_sales),
            'sales_data': sales_data,
            'subscribed_servicers': [
                {
                    'servicer_name': payment.servicer.name,  # This line retrieves the servicer name
                }
                for payment in subscribed_servicers]
           
        }
        return Response(response_data)