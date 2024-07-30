from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class EventType(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
    
class ServiceType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    event_types = models.ManyToManyField('EventType', related_name='service_types', through='EventServiceType')

    def __str__(self):
        return self.name

class EventServiceType(models.Model):
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('event_type', 'service_type')

    def __str__(self):
        return f"{self.event_type.name} - {self.service_type.name}"

class ServicerManager(BaseUserManager):
    def create_user(self, email, name, password=None,password2=None,location=None, venture_address=None, service_types=None, experience=None, phone_number=None):
        if not email:
            raise ValueError("Servicer must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
            experience=experience,
            location=location,
            venture_address=venture_address
        )

        user.set_password(password)
        user.save(using=self._db)

        if service_types:
            user.service_type.set(service_types)
        
        return user
class Servicer(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=15)
    experience = models.TextField()
    location = models.CharField(max_length=200)
    venture_address = models.CharField(max_length=200)
    service_type = models.ManyToManyField(ServiceType, blank=True)
    is_servicer = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    objects = ServicerManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone_number", "venture_address"]

    def __str__(self):
        return self.email