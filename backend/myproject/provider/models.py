from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
# Create your models here.

class ServicerManager(BaseUserManager):
      def create_user(self,email,name,password=None,password2=None,phone_number=None,experience=None,address=None):
            if not email:
                raise ValueError("Service provider must have an email address")
            user = self.model(
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
            experience=experience,
            address=address
        )
            user.set_password(password)
            user.save(using=self._db)

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
    address = models.CharField(max_length=200)
    is_servicer = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    otp=models.CharField(max_length=6,null=True,blank=True)
    objects = ServicerManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone_number", "address"]

    def __str__(self):
        return self.email




