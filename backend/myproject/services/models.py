from django.db import models
from provider.models import Servicer
# Create your models here.
class Service(models.Model):
    CITY_CHOICES = [
        ('Kasaragod', 'Kasaragod'),
        ('Kannur', 'Kannur'),
        ('Wayanad', 'Wayanad'),
        ('Kozhikode', 'Kozhikode'),
        ('Palakkad', 'Palakkad'),
        ('Thrissur', 'Thrissur'),
        ('Ernakulam', 'Ernakulam'),
        ('Idukki', 'Idukki'),
        ('Malappuram', 'Malappuram'),
        ('Kottayam', 'Kottayam'),
        ('Thiruvananthapuram', 'Thiruvananthapuram'),
        ('Kollam', 'Kollam'),
        ('Alappuzha', 'Alappuzha'),
        ('Pathanamthitta', 'Pathanamthitta'),
    ]
    SERVICE_TYPE_CHOICES = [
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('vehicle_washing', 'Vehicle Washing'),
        ('specific', 'Specific Cleaning'),
    ]

    name = models.CharField(max_length=255)
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE)
    servicer_name = models.CharField(max_length=200,null=True, blank=True)
    servicer_phone_number = models.CharField(max_length=15,null=True, blank=True)
    city = models.CharField(max_length=50, choices=CITY_CHOICES)
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    price_per_sqft = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Price per square foot, optional
    employees_required = models.PositiveIntegerField(default=1) 
    images = models.ImageField(upload_to='service_images/', blank=True, null=True)
    period=models.IntegerField(blank=True, null=True)
    additional_notes = models.TextField(blank=True, null=True)
    is_available = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name