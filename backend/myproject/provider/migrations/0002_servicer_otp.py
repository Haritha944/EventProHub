# Generated by Django 4.2.14 on 2024-08-04 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('provider', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='servicer',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
