#wyong, 20170306
from __future__ import absolute_import, unicode_literals
from datetime import datetime,timedelta

# ^^^ The above is required if you want to import from the celery
# library.  If you don't have this then `from celery.schedules import`
# becomes `proj.celery.schedules` in Python 2.x since it allows
# for relative imports by default.

#wyong, 20170907
#import djcelery 
import os
#djcelery.setup_loader()

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'x8#v=v_yen3pvul&2*-x3=td2eqvw%5!*qaf^g8vzu#gcyo+%n'

# Celery settings
CELERY_IMPORTS = ('portia_dashboard.tasks', )
#CELERY_BROKER_URL = 'amqp://guest:guest@localhost//'


#: Only add pickle to this list if your broker is secured
#: from unwanted access (see userguide/security.html)
#CELERY_ACCEPT_CONTENT = ['json']
#CELERY_RESULT_BACKEND = 'db+sqlite:///results.sqlite'
#CELERY_TASK_SERIALIZER = 'json'

CELERY_BROKER_URL = 'django://'
#CELERY_RESULT_BACKEND = 'djcelery.backends.database:DatabaseBackend'
#CELERYBEAT_SCHEDULER = 'djcelery.schedulers.DatabaseScheduler' 


from celery.task.schedules import crontab

CELERY_ENABLE_UTC = True 
CELERY_TIMEZONE='Asia/Shanghai'


TIME_ZONE='Asia/Shanghai'

CELERYBEAT_SCHEDULE = {
    "schedule_monitor_task": {
        'task': 'portia_dashboard.tasks.schedule_monitor',
        'schedule': timedelta(seconds=30),
    },
}

# wyong, 20170329
SCHEDULE_URL = 'http://localhost:6800/schedule.json'

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


#wyong, 20170329
PORTIA_STORAGE_BACKEND = 'storage.backends.FsStorage'

INSTALLED_APPS = (#wyong, 20170907
                  #'djcelery',

                  'kombu.transport.django',

                  #wyong, 20170329
                  #'storage.apps.StorageConfig',
                  'portia_dashboard.apps.PortiaDashboardConfig' ,
                 )

#INSTALLED_APPS += ('kombu.transport.django',)
#INSTALLED_APPS += ('django_celery_beat',)

'''
#wyong, 20170407
MONGODB_DATABASES = {
    "default": {
        "name": portia,
        "host": localhost,
        #"username": root,
        #"password": 123456,
        "tz_aware": True, # if you using timezones in django (USE_TZ = True)
    },
}

INSTALLED_APPS += ["django_mongoengine"]
'''
