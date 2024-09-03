import stripe
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from services.models import ServiceBooking,Service
from .models import SubscriptionPlan,SubscriptionPayment
from .serializers import SubscriptionPlanSerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
import json
from django.conf import settings
from provider.emails import ServicerAuthentication
from django.views.decorators.http import require_POST
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.
stripe.api_key = settings.STRIPE_SECRET_KEY

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

@csrf_exempt
def create_checkout_session(request):
    if request.method == "POST":
        try:
            payload = json.loads(request.body)
            print("Payload:", payload)
        
        # Get booking ID from the request payload
            booking_id = payload.get("servicebooking_id")
            print(booking_id)
            if not booking_id:
                return JsonResponse({"error": "Booking ID is required"}, status=400)
        
        # Retrieve the ServiceBooking object
            booking = get_object_or_404(ServiceBooking,pk=booking_id)
            service = Service.objects.get(name=booking.service)
            print("Service Name:", service)
        
        # Create a Stripe Checkout Session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                {
                    "price_data": {
                        "currency": "inr",  # Change to your currency
                        "product_data": {
                            "name": service,
                            # 'images': [booking.service.image.url] if booking.service.image else [],
                        },
                        "unit_amount": int(
                            booking.price_paid * 100
                        ),  # Amount in cents
                    },
                    "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=settings.SITE_URL
                + f"order-status/?success=true&amount={booking.price_paid}&currency=inr",
                cancel_url=settings.SITE_URL + "order-status/?canceled=true",
            )
        
        # Update the booking with Stripe session details
            print("Stripe Session:", session)
            booking.stripe_session_id = session.id
            booking.status = "Paid"  # Update status to Paid
            booking.is_paid = True  # Mark as paid
            booking.save()

            

        # Return the session ID and Stripe public key to the frontend
            return JsonResponse(
                {"session_id": session.id, "stripe_public_key": settings.STRIPE_PUBLIC_KEY}
            )
        except stripe.error.StripeError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)
        


@method_decorator(csrf_exempt, name='dispatch')
class CreateCheckoutView(APIView):
    authentication_classes = [ServicerAuthentication]
    permission_classes = [AllowAny]
    def post(self, request):
        servicer = request.user
        try:
            payload = json.loads(request.body)
            print("Payload:", payload)
            subscription_plan_id = payload.get("subscription_plan_id")
            print("Subscription Plan ID:", subscription_plan_id)
            if not subscription_plan_id:
                return JsonResponse({"error": "Subscription Plan ID is required"}, status=400)
            subscription_plan = get_object_or_404(SubscriptionPlan, pk=subscription_plan_id)
            print("Subscription Plan:", subscription_plan)
        
            # Create a Stripe Checkout Session
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "inr",  # Change to your currency
                            "product_data": {
                                "name": subscription_plan.name,
                                # 'images': [subscription_plan.image_url] if subscription_plan.image_url else [],
                            },
                            "unit_amount": int(subscription_plan.amount * 100),  # Amount in cents
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=settings.SITE_URL
                + f"subscription-status/?success=true&amount={subscription_plan.amount}&currency=inr",
                cancel_url=settings.SITE_URL + "subscription-status/?canceled=true",
            )
            servicer = request.user
            subscription_payment = SubscriptionPayment.objects.create(
                servicer=servicer,
                subscription_plan=subscription_plan,
                stripe_session_id=session.id,
                price_paid=subscription_plan.amount,
                is_paid=True,    # Mark as unpaid initially
            )
            print("Stripe Session:", session)
            return JsonResponse(
                {"session_id": session.id, "stripe_public_key": settings.STRIPE_PUBLIC_KEY}
            )
        except stripe.error.StripeError as e:
            return JsonResponse({"error": str(e)}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON payload"}, status=400)