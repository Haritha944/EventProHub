from rest_framework import serializers
from .models import Servicer,ServiceType


class ServicerRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    service_type = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), 
        many=True, 
        required=False
    )

    class Meta:
        model = Servicer
        fields = ['email', 'name', 'phone_number', 'password', 'password2', 'experience', 'location', 'venture_address', 'service_type']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password do not match")
        return attrs

    def create(self, validated_data):
        service_types = validated_data.pop('service_type', [])
        servicer = Servicer.objects.create_user(**validated_data)
        if service_types:
            servicer.service_type.set(service_types)
        return servicer