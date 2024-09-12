from rest_framework import serializers
from .models import SubscriptionPlan,SubscriptionPayment,Review

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'
        
class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    subscription_plan = SubscriptionPlanSerializer(read_only=True)
    class Meta:
        model = SubscriptionPayment
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    review_by = serializers.StringRelatedField()  
    service = serializers.StringRelatedField()    
    servicer = serializers.StringRelatedField() 
    class Meta:
        fields = '__all__'
        model = Review