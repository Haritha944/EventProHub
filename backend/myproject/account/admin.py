from django.contrib import admin
from account.models import User

@admin.register(User)
class UserModelAdmin(admin.ModelAdmin):
    list_display = ["id","email","name","phone_number","is_active"]
   