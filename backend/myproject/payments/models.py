from django.db import models
from provider.models import Servicer
from account.models import User
from services.models import Service
from django.utils import timezone
from datetime import timedelta
# Create your models here.

class SubscriptionPlan(models.Model):
    SUBSCRIPTION_TYPES = [
        ('Monthly', 'Monthly'),
        ('Quarterly', 'Quarterly'),
        ('Yearly', 'Yearly'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    subscription_type = models.CharField(max_length=10, choices=SUBSCRIPTION_TYPES)
    start_date = models.DateTimeField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def _get_duration_days(self):
        if self.subscription_type == 'Monthly':
            return 30
        elif self.subscription_type == 'Quarterly':
            return 90
        elif self.subscription_type == 'Yearly':
            return 365
        return 0
    @property
    def end_date(self):
        if not self.start_date:
            return None
        return self.start_date + timedelta(days=self._get_duration_days())
    def is_active(self):
        if not self.start_date:
            return False
        now = timezone.now()
        return self.start_date <= now <= self.end_date

class SubscriptionPayment(models.Model):
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE)
    subscription_plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    stripe_session_id = models.CharField(max_length=255, unique=True)
    price_paid= models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField() 
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.start_date:
            self.start_date = timezone.now()
        if not self.end_date:
            self.end_date = self.start_date + timedelta(days=self.subscription_plan._get_duration_days())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment by {self.servicer.name} for {self.subscription_plan.name}"

class Review(models.Model):
    review_by = models.ForeignKey(User, on_delete=models.CASCADE)
    review = models.TextField()
    service = models.ForeignKey(Service, on_delete=models.CASCADE)  # Link to Service model
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE)  # Link to Servicer model
    stars = models.IntegerField(default=1, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)

    def __str__(self):
        return f'{self.review_by.email} - {self.service.name} (Servicer: {self.servicer.name})'