from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

app = Celery('myproject')
app.conf.enable_utc=False
app.conf.update(timezone='Asia/Kolkata')

app.config_from_object('django.conf:settings', namespace='CELERY')


app.autodiscover_tasks()
app.conf.beat_schedule = {
    'send-reminder-emails-every-hour': {
        'task': 'services.tasks.send_service_reminder_email',  # Update with the correct path to your task
        'schedule': crontab(minute=0),  
    },
}

app.conf.broker_connection_retry_on_startup = True

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')