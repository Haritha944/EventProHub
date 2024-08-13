from rest_framework import serializers
from account.models import User
from provider.models import Servicer
from services.models import Service



class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  

class ServicerSerializers(serializers.ModelSerializer):
    class Meta:
        model = Servicer
        fields = '__all__'  

class ServiceSerializers(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'  