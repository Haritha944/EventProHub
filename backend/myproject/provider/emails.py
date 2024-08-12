from django.core.mail import send_mail
import random 
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken
from .models import Servicer


def send_otp_via_mail(email):
    subject=f'Welcome to Servicelink Pro !!-Verification Mail'
    otp=random.randint(100000,999999)
    message = f'Hi {email},Thank you for registering with us.Here is your Verification Mail.Your OTP is {otp}'
    email_from = settings.EMAIL_HOST
    send_mail(subject, message, email_from, [email])
    user_obj = Servicer.objects.get(email = email)
    user_obj.otp = otp
    user_obj.save()


class ServicerAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            access_token = AccessToken(token)
            user_id = access_token.get('user_id')
            if not user_id:
                raise AuthenticationFailed('User ID not found in token.')
            servicer = Servicer.objects.get(pk=user_id)

            # Check if is_servicer is True
            if not servicer.is_servicer:
                raise AuthenticationFailed('Servicer status is not valid.')

            return (servicer, token)

        except Servicer.DoesNotExist:
            raise AuthenticationFailed('Servicer with this email does not exist.')
        except Exception as e:
            raise AuthenticationFailed(f'Error decoding token or fetching user: {str(e)}')
        

        
    def authenticate_header(self, request):
        return 'Bearer'