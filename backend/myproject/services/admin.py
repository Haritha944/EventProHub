from django.contrib import admin
from .models import Service
# Register your models here.

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'servicer', 'city', 'service_type', 'price', 'price_per_sqft', 
        'employees_required','period', 'is_available', 'created_at', 'updated_at'
    )
    search_fields = ('name', 'servicer', 'city', 'service_type', 'description')
    list_filter = ('city', 'service_type', 'is_available')