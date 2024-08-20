from django.db import models
from provider.models import Servicer
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
