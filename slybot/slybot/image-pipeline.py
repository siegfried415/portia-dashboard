
from scrapy.pipelines.images import ImagesPipeline
from scrapy.http import Request
from scrapy.exceptions import DropItem
from urlparse import urlparse
import logging
import os

#wyong, 20170510
#from dbgp.client import brk

#wyong, 20170511
from scrapy.selector import Selector
import re

class MyImagesPipeline(ImagesPipeline):
    def __init__(self, store_uri, download_func=None, settings=None):
        super(MyImagesPipeline, self).__init__(store_uri, settings=settings, download_func=download_func)
        #wyong, 20170511
        self.image_url_map = {}

	#wyong, 20170515
	self.images_urls_field = settings.get('IMAGES_URLS_FIELD')
	self.images_url = settings.get('IMAGES_URL')


    def file_path(self, request, response=None, info=None):
        #wyong, 20170112
        o = urlparse(request.url)

        #wyong, 20170511
        #filename = '/dashboard/article/images/' + o.netloc +  o.path 
        filename = 'images/' + o.netloc +  o.path 
        logging.info("MyImagesPipeline, file : %s" % filename )

        return filename 

    def get_media_requests(self, item, info):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)

        #wyong, 20170515
        field = item.get(self.images_urls_field, [])
        if isinstance(field, list) and len(field) > 0 :
            field = field[0]

        if isinstance(field, str) or isinstance(field, unicode) or isinstance(field, bytes ) :
            #wyong, 20170511
            #selector = Selector( text = item['body'][0])
            selector = Selector( text = field )
            image_urls = selector.xpath('//img//@src').extract()

            for image_url in image_urls:
                full_image_url = image_url 
                o1 = urlparse(image_url)
                #if not ( o1.scheme || o1.netloc ) : 
                #if  ( !o1 || !o1.netloc || o1.netloc == '' ) :
                if  ((not o1) or (not o1.netloc)) :
                    o2 = urlparse(item['url'] )
                    full_image_url = o2.scheme + '://' + o2.netloc + image_url 
                elif (not o1.scheme) :
                    full_image_url = 'http:' + image_url

                #wyong, 20170511
                self.image_url_map[full_image_url] = image_url

                logging.info("MyImagesPipeline,begin to get url %s" % full_image_url )
                yield Request(full_image_url)
           
    #ref http://stackoverflow.com/questions/6116978/python-replace-multiple-strings
    def multiple_replace(self, rep, string ) :       
        pattern = re.compile("|".join([re.escape(k) for k in rep.keys()]), re.M)
        return pattern.sub( lambda m: rep[m.group(0)], string )

    def item_completed(self, results, item, info):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)
        
	# use 'IMAGES_URL' from settings.py,  wyong, 20170515
        rep = { self.image_url_map[x['url']]: "%s%s" % (self.images_url, x['path']) for ok, x in results if ok }

        #wyong, 20170515
        #item['body'][0] = self.multiple_replace(rep, item['body'][0]) 
        field = item.get(self.images_urls_field, [])
        if isinstance(field, list):
            if len(field ) > 0 :
                field[0] = self.multiple_replace(rep, field[0]) 
        elif isinstance(field, str) or isinstance(field, unicode) or isinstance(field, bytes):
            item.set(self.images_urls_field, self.multiple_replace(rep, field)) 
        return item
