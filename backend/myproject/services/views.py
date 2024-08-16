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