from django.contrib import admin
from .models import SubscriptionPlan,SubscriptionPayment

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'amount', 'subscription_type', 'start_date', 'created_at')
    search_fields = ('name', 'description')

@admin.register(SubscriptionPayment)
class SubscriptionPaymentAdmin(admin.ModelAdmin):
    list_display = ('servicer', 'subscription_plan', 'stripe_session_id', 'price_paid', 'is_paid', 'start_date', 'end_date', 'created_at')
    search_fields = ('servicer__name', 'subscription_plan__name')