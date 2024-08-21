from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

# Create your views here.


@api_view(['POST'])
@permission_classes([AllowAny])
def addsubscription(request):
    if request.method == 'POST':
        name = request.data.get('name')
        description = request.data.get('description')
        amount = request.data.get('amount')
        subscription_type = request.data.get('subscription_type')
        start_date = request.data.get('start_date')
        
        try:
            subscription_plan = SubscriptionPlan.objects.create(
                name=name,
                description=description,
                amount=amount,
                subscription_type=subscription_type,
                start_date=start_date,
               
            )
            serializer = SubscriptionPlanSerializer(subscription_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class SubscriptionPlanListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = SubscriptionPlanSerializer
    def get_queryset(self):
        queryset = SubscriptionPlan.objects.all()
        return queryset 
    
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_subscription(request, pk):
    try:
        subscription = SubscriptionPlan.objects.get(pk=pk)
    except SubscriptionPlan.DoesNotExist:
        return Response({'error': 'Subscription not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SubscriptionPlanSerializer(subscription, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_subscription(request, pk):
    try:
        subscription = SubscriptionPlan.objects.get(pk=pk)
    except SubscriptionPlan.DoesNotExist:
        return Response({'error': 'Subscription not found'}, status=status.HTTP_404_NOT_FOUND)

    subscription.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)