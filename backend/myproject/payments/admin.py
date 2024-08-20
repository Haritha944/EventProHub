from django.contrib import admin
from .models import SubscriptionPlan

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'amount', 'subscription_type', 'start_date', 'created_at')
    search_fields = ('name', 'description')

