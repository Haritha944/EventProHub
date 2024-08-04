from django.core.mail import send_mail
import random 
from django.conf import settings
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