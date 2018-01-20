
from scrapy.pipelines.images import ImagesPipeline
from scrapy.http import Request
from scrapy.exceptions import DropItem
from urlparse import urlparse
import logging
import os

from scrapy.selector import Selector
import re

log = logging.getLogger('slybot.ImagesPipeline')

class ImagesPipeline(ImagesPipeline):
    def __init__(self, store_uri, download_func=None, settings=None):
        super(MyImagesPipeline, self).__init__(store_uri, settings=settings, download_func=download_func)
        self.image_url_map = {}
	self.images_urls_field = settings.get('IMAGES_URLS_FIELD')
	self.images_url = settings.get('IMAGES_URL')


    def file_path(self, request, response=None, info=None):
        o = urlparse(request.url)
        filename = 'images/' + o.netloc +  o.path 
        log.info("ImagesPipeline, file : %s" % filename )

        return filename 

    def get_media_requests(self, item, info):
        field = item.get(self.images_urls_field, [])
        if isinstance(field, list) and len(field) > 0 :
            field = field[0]

        if isinstance(field, str) or isinstance(field, unicode) or isinstance(field, bytes ) :
            selector = Selector( text = field )
            image_urls = selector.xpath('//img//@src').extract()

            for image_url in image_urls:
                full_image_url = image_url 
                o1 = urlparse(image_url)
                if  ((not o1) or (not o1.netloc)) :
                    o2 = urlparse(item['url'] )
                    full_image_url = o2.scheme + '://' + o2.netloc + image_url 
                elif (not o1.scheme) :
                    full_image_url = 'http:' + image_url

                self.image_url_map[full_image_url] = image_url

                log.info("ImagesPipeline,begin to get url %s" % full_image_url )
                yield Request(full_image_url)
           
    #ref http://stackoverflow.com/questions/6116978/python-replace-multiple-strings
    def multiple_replace(self, rep, string ) :       
        pattern = re.compile("|".join([re.escape(k) for k in rep.keys()]), re.M)
        return pattern.sub( lambda m: rep[m.group(0)], string )

    def item_completed(self, results, item, info):
	# use 'IMAGES_URL' from settings.py
        rep = { self.image_url_map[x['url']]: "%s%s" % (self.images_url, x['path']) for ok, x in results if ok }

        field = item.get(self.images_urls_field, [])
        if isinstance(field, list):
            if len(field ) > 0 :
                field[0] = self.multiple_replace(rep, field[0]) 
        elif isinstance(field, str) or isinstance(field, unicode) or isinstance(field, bytes):
            item.set(self.images_urls_field, self.multiple_replace(rep, field)) 
        return item
