from django.db.utils import IntegrityError
import logging
from mongoengine import connect

#wyong, 20170322
#from dbgp.client import brk

#wyong, 20170328
import os 
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'portia_server.settings')
django.setup()

#wyong, 20170407
from portia_dashboard.models import JobItem

#wyong, 20170417
from datetime import datetime

class DjangoPipeline(object):

    def __init__(self):
        #wyong, 20170314
        logging.info('DjangoPipeline, __init...')
        connect('portia')

    def process_item(self, item, spider):
        #wyong, 20170322
        #brk(host="192.168.1.135", port=9000)
        logging.info('DjangoPipeline, process_item...')

        try:
            django_item = JobItem(job=os.environ['SCRAPY_JOB'], 
                                  spider=spider.name, url = item['url'], 
                                  #wyong, 20170517
                                  #time=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                  time = datetime.now()
                                  )

            for field in item.fields.keys():
                #if hasattr(django_item, field) :
                setattr (django_item, field, item.get(field))
            django_item.save()

            logging.info("DjangoPipeline process_item successfully, item.url=%s" % item['url'] )

        except Exception as e:
            #raise DropItem("article save error : %s" % item['title'])
            logging.info("DjangoPipeline, process_item error : %s" % str(e) )
        
        return item
