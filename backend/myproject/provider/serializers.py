from rest_framework import serializers
from .models import Servicer
from django.contrib.auth import authenticate

class ServiceSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = Servicer
        fields = ['email', 'name', 'phone_number', 'password', 'password2', 'experience', 'address']
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
        password = validated_data.pop('password')
        user= Servicer.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ServicerLoginSerializer(serializers.ModelSerializer):
    email=serializers.EmailField(max_length=255)
   
    class Meta:
        model=Servicer
        fields= ['email','password']
    
class VerifyAccountSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField()


class ServicerSerializer(serializers.ModelSerializer):
    class Meta:
        model=Servicer
        fields = ['id','email','name','phone_number','experience','address','is_active','is_servicer','is_verified']
        

class ServicerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Servicer
        fields = ['id','email','name','phone_number','experience','address','is_servicer',]