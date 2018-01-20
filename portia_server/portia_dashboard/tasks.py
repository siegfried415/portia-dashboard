from __future__ import absolute_import, unicode_literals

from django.conf import settings
from .models import Schedule

from celery.task.schedules import crontab
from celery import shared_task
from celery import task

import logging
import time, datetime
import requests

logger = logging.getLogger('portia_dashboard')

@task
def schedule_monitor():

    schedules = Schedule.objects.all()
    for schedule in schedules:
        nowTimestamp = int(time.time() * 1000)

        if (nowTimestamp - schedule.date_update > schedule.interval * 1000) and (schedule.times > 0 or schedule.times < 0 ) :
            if schedule.start_time > 0 and schedule.start_time > nowTimestamp:
                continue

            schedule_data = {
                'project': schedule.project,
                'spider': schedule.spider
            }
            request = requests.post(settings.SCHEDULE_URL, data=schedule_data)
            if request.status_code == 200:
                schedule.date_update = nowTimestamp
                schedule.times = schedule.times -1 if ( schedule.times > 0 ) else schedule.times
                schedule.save()
