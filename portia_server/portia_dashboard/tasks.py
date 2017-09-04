#wyong, 20170306
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

    logger.info('ScheduleMonitor(10) : start...')

    schedules = Schedule.objects.all()
    for schedule in schedules:
        nowTimestamp = int(time.time() * 1000)
        logger.info('ScheduleMonitor(20) : id : %s,  nowTimestamp : %d, date_update : %d, interval : %d, times : %d ' % (schedule.id, nowTimestamp, schedule.date_update, schedule.interval, schedule.times  ))

        if (nowTimestamp - schedule.date_update > schedule.interval * 1000) and (schedule.times > 0 or schedule.times < 0 ) :
            logger.info('ScheduleMonitor(30) : id : %s, date_update : %d ' % (schedule.id, schedule.date_update))
            if schedule.start_time > 0 and schedule.start_time > nowTimestamp:
                continue

            logger.info('ScheduleMonitor(40) : id : %s, start_time : %d ' % (schedule.id, schedule.start_time ))
            schedule_data = {
                'project': schedule.project,
                'spider': schedule.spider
            }
            request = requests.post(settings.SCHEDULE_URL, data=schedule_data)
            if request.status_code == 200:
                logger.info('ScheduleMonitor(50) : id : %s time : %s' % (schedule.id, datetime.datetime.today()))
                schedule.date_update = nowTimestamp
                schedule.times = schedule.times -1 if ( schedule.times > 0 ) else schedule.times
                schedule.save()
            else:
                logger.info('ScheduleMonitor(60) : id : %s time : %s' % (schedule.id, datetime.datetime.today()))
