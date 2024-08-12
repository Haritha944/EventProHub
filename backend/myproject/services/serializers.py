from rest_framework import serializers
from .models import Service
from provider.models import Servicer
from datetime import timedelta


class ServiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model=Service
        fields = ['id','name','service_type','description','servicer','price','servicer_name','servicer_phone_number','city','images','employees_required','period','price_per_sqft','is_available']
    def validate(self, data):
        # Ensure that at least one price field is provided
        if not data.get('price') and not data.get('price_per_sqft'):
            raise serializers.ValidationError('Please provide either Price or Price per Sqft.')
        return data
    