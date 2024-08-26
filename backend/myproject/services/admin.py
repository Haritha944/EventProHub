from django.contrib import admin
from .models import Service,ServiceBooking
# Register your models here.

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'servicer', 'city', 'service_type', 'price', 'price_per_sqft', 
        'employees_required','period', 'is_available', 'created_at', 'updated_at'
    )
    search_fields = ('name', 'servicer', 'city', 'service_type', 'description')
    list_filter = ('city', 'service_type', 'is_available')

@admin.register(ServiceBooking)
class ServiceBookingAdmin(admin.ModelAdmin):
    list_display = ('service_date', 'service_time', 'address', 'city', 'zip_code', 'instructions', 'area_sqft', 'user', 'servicer', 'service', 'price_paid', 'is_paid', 'is_canceled')