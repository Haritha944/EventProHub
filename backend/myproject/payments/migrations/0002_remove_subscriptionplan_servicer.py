# Generated by Django 4.2.14 on 2024-08-20 10:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subscriptionplan',
            name='servicer',
        ),
    ]
