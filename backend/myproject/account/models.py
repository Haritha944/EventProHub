from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self,email,name,phone_number,password=None,password2=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not phone_number:
            raise ValueError("Users must enter their phonenumber")
        user=self.model(
            email=self.normalize_email(email),
            name=name,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,name,password=None,phone_number=None):
        user = self.create_user(email,password=password,name=name,phone_number=phone_number,)
        user.is_admin=True
        user.save(using=self._db)
        return user
    
class User(AbstractBaseUser):
    email = models.EmailField(verbose_name="Email",max_length=255,unique=True,)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15,blank=True,null=True)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name","phone_number"]

    def __str__(self):
        return self.email
    def has_perm(self,perm,obj=None):
        "Does the user have a special permission?"
        return self.is_admin
    def has_module_perms(self,app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True
    
    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin