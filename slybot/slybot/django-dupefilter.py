"""
Duplicates filter middleware for autoscraping
"""
from scrapy.exceptions import NotConfigured
from scrapy.exceptions import DropItem

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'portia_server.settings')
django.setup()

from portia_dashboard.models import JobItem
import logging
from mongoengine import connect

log = logging.getLogger('slybot.DjangoDupeFilterPipeline')

class DjangoDupeFilterPipeline(object):
    def __init__(self ):
        log.info('DjangoDupeFilterPipeline, __init...')
        connect('portia')

    def process_item(self, item, spider):
        """Checks whether a scrapy item is a dupe, based on url (not vary)
        fields of the item class"""

        if not item.get( 'url') :
            return item

        old_items = JobItem.objects.filter( url = item['url'])
        if len( old_items) > 0 :
            raise DropItem("Duplicate item scraped at <%s>, first one was "
                           "scraped at <%s>" % (item['url'], old_items[0]['url']))

        return item
