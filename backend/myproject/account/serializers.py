from rest_framework import serializers
from account.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={'input_type':'password'},write_only=True)
    class Meta:
        model=User
        fields=['email','name','phone_number','password','password2']
        extra_kwargs = {
            'password':{'write_only':True}
        }
    def validate(self,attrs):
        password=attrs.get('password')
        password2=attrs.get('password2')
        if password!=password2:
            raise serializers.ValidationError('Passwords are not match')
        return attrs
    def create(self,validate_data):
        return User.objects.create_user(**validate_data)
    
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email','password'] 
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','email','name','phone_number']

class VerifyAccountSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField()

class ChangePasswordSerializer(serializers.Serializer):
    password=serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2=serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields=['password','password2']
    def validate(self,attrs):
        user=self.context['request'].user
        password = attrs.get('password')
        if not user.check_password(password):
            raise serializers.ValidationError({"old_password": "Old password is not correct."})
        return attrs
    
class SendResetPasswordEmailSerializer(serializers.Serializer):
    email=serializers.EmailField(max_length=255)
    def validate(self,attrs):
        email=attrs.get('email')
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "No user with this email address exists."})
        return attrs
    

class UserPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']