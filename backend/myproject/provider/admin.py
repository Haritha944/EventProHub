from django.contrib import admin
from .models import Servicer
# Register your models here.


@admin.register(Servicer)
class ServicerAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'phone_number', 'is_active', 'is_servicer')
    search_fields = ('email', 'name')
    list_filter = ('is_active', 'is_servicer')