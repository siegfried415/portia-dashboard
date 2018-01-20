from django.db.utils import IntegrityError
import logging
from mongoengine import connect

import os 
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'portia_server.settings')
django.setup()

from portia_dashboard.models import JobItem
from datetime import datetime


log = logging.getLogger('slybot.DjangoPipeline')

class DjangoPipeline(object):

    def __init__(self):
        log.info('DjangoPipeline, __init...')
        connect('portia')

    def process_item(self, item, spider):
        log.info('DjangoPipeline, process_item...')

        try:
            django_item = JobItem(job=os.environ['SCRAPY_JOB'], 
                                  spider=spider.name, url = item['url'], 
                                  time = datetime.now()
                                  )

            for field, meta in item.fields.items():
                if 'required' in meta and meta['required'] == True  and  item.get(field)[0] == None: 
                    log.error("DjangoPipeline, process_item error : field %s was not set" % field  )
                setattr (django_item, field, item.get(field))
            django_item.save()
            log.info("DjangoPipeline process_item successfully, item.url=%s" % item['url'] )

        except Exception as e:
            #raise DropItem("article save error : %s" % item['title'])
            log.error("DjangoPipeline, process_item error : %s" % str(e) )
        
        return item
