from django.core.mail import send_mail
import random
from django.conf import settings
from .models import User


def send_otp_via_email(email):
    subject = f'Hi {email},Welcome to EventPro Hub!!.'
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

