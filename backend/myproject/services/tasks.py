from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta,datetime
from .models import ServiceBooking 


@shared_task(bind=True)
def send_service_reminder_email(self):
    current_time = timezone.now()
    one_hour_later = current_time + timedelta(hours=1)

    # Query to get services starting in the next hour
    upcoming_services = ServiceBooking.objects.filter(
        service_date=current_time.date(),  # Filter by today's date
        service_time__range=(current_time.time(), one_hour_later.time())  # Filter by time
    )

    for service in upcoming_services:
        user_email = service.user.email  # Adjusted to your `User` model
        user_name = service.user.name  # Assuming username or you can use another field like `first_name`
        service_name = service.service.name  # Adjust based on how you reference your `Service` model
        service_datetime = timezone.make_aware(datetime.combine(service.service_date, service.service_time))  # Combine date and time

        # Send reminder email
        send_mail(
            "Service Reminder from Servicelink Pro",
            f"Dear {user_name},\n\n"
            f"This is a reminder that your service '{service_name}' is scheduled to start at {service_datetime.strftime('%Y-%m-%d %H:%M')}.\n\n"
            "Thank you for choosing our service!\n"
            "Best Regards,\nServicelink Pro Team",
            "trendyfoot.official@gmail.com", # Your email or from email configuration
            [user_email],
            fail_silently=False
        )

    return "Service reminder emails sent successfully"