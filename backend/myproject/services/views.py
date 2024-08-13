from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Service
from provider.models import Servicer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from .serializers import ServiceSerializer
from provider.emails import ServicerAuthentication


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
        services=Service.objects.all()
        serializer=ServiceSerializer(services,many=True)
        return Response(serializer.data)