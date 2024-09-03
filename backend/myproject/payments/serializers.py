from rest_framework import serializers
from .models import SubscriptionPlan,SubscriptionPayment

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
        
class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    subscription_plan = SubscriptionPlanSerializer(read_only=True)
    class Meta:
        model = SubscriptionPayment
        fields = '__all__'