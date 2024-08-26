from django.db import models
from provider.models import Servicer
from account.models import User
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
    

class ServiceBooking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    servicer = models.ForeignKey(Servicer, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)  
    service_date = models.DateField()
    service_time = models.TimeField()
    address = models.CharField(max_length=255)  # Service address (e.g., hometown)
    city = models.CharField(max_length=100)  # City where service will be provided
    zip_code = models.CharField(max_length=20)  # ZIP or postal code
    instructions = models.TextField(blank=True, null=True)
    area_sqft = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Square footage of the room
    price_paid= models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) 
    is_paid = models.BooleanField(default=False)
    is_canceled = models.BooleanField(default=False)

    def calculate_price(self):
        if self.service.price_per_sqft:
            if self.area_sqft:
                self.price_paid = self.area_sqft * self.service.price_per_sqft
            else:
                self.price_paid = 0
        else:
            self.price_paid = self.service.price

    def save(self, *args, **kwargs):
        self.calculate_price()  # Calculate the price before saving
        super(ServiceBooking, self).save(*args, **kwargs) 