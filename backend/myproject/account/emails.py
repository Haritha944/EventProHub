from django.core.mail import send_mail
import random
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from .models import User


def send_otp_via_email(email):
    subject = f'Hi {email},Welcome to ServiceLink Pro!!.'
    otp=random.randint(100000,999999)
    message=f'Hi {email},Thank you for registering with us.Here is your Verification Mail.Your OTP is {otp}'
    email_from = "trendyfoot.official@gmail.com"
    try:
        send_mail(subject,message,email_from,[email],fail_silently=False,)
        user_obj=User.objects.get(email=email)
        user_obj.otp=otp
        user_obj.save()
        print(f'OTP {otp} sent to {email}')
    except Exception as e:
        print(f'Error sending email: {e}')

def generate_unique_token(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    return uid, token

def send_password_reset_email(email,token):
    subject="Your forget Password link"
    message = f'Click the following link to reset your password: http://localhost:300/reset_password/{token}/'
    email_from=settings.EMAIL_HOST
    recipient_list = [email]
    send_mail(subject,message,email_from,recipient_list)