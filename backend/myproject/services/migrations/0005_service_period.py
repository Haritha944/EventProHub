# Generated by Django 4.2.14 on 2024-08-12 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0004_remove_service_duration'),
    ]

    operations = [
        migrations.AddField(
            model_name='service',
            name='period',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
