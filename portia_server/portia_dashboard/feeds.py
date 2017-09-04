from django.contrib.syndication.views import Feed
#from django.urls import reverse
from .models import JobItem 
from django.utils.feedgenerator import Rss201rev2Feed
from django.utils.feedgenerator import Atom1Feed

#wyong, 20170510
#from dbgp.client import brk

#wyong, 20170516
from datetime import datetime

# RSS feeds powered by Django's syndication framework use MIME type
# 'application/rss+xml'. That's unacceptable to us, because that MIME type
# prompts users to download the feed in some browsers, which is confusing.
# Here, we set the MIME type so that it doesn't do that prompt.
class CorrectMimeTypeFeed(Rss201rev2Feed):
    mime_type = 'application/xml'


class LatestArticlesFeed(Feed):
    #title = "News scraped by Portia 2.0"
    #link = "/dashboard/article/rss"
    #description = "Updates on changes and additions to it news site."
    feed_type = CorrectMimeTypeFeed 

    def get_object(self, request, spider):
        #brk(host="192.168.1.135", port=9000)
        #return JobItem.objects.get(pk=beat_id)
        return {'name': spider}

    #wyong, 20170516
    def title(self, obj):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)

        if obj:
            return obj['name'] 
        else:
            return 'News scraped by Portia 2.0'

    #wyong, 20170516
    def link(self, obj):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)

        #return obj.get_absolute_url()
        if obj:
            return "/dashboard/article/%s/rss" % obj['name']
        else:
            return "/dashboard/article/rss"


    def items(self, obj):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)

        if obj :
            return JobItem.objects.filter(spider=obj['name']).order_by('-time')[:15]
        else :
            return JobItem.objects.order_by('-time')[:15]


    def item_title(self, item):
        #wyong, 20170510
        #brk(host="192.168.1.135", port=9000)

        return item.title[0]

    def item_description(self, item):
        return item.body[0]

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        #return reverse('news-item', args=[item.pk])
        return item.url

    #wyong, 20170516
    def item_pubdate(self, item):
        """
        Takes an item, as returned by items(), and returns the item's
        pubdate.
        """
        #brk(host="192.168.1.135", port=9000)

        try :
            #return datetime.strptime(item.date, "%Y-%m-%d %H:%M:%S")
            result = datetime.strptime(item.date[0], "%Y-%m-%d" )
        except Exception as e:
	    result = datetime.now()

        return result

    def item_updateddate(self, item):
        """
        Takes an item, as returned by items(), and returns the item's
        updateddate.
        """
        #brk(host="192.168.1.135", port=9000)

        #wyong, 20170517
        '''
        try :
            result = datetime.strptime(item.time, "%Y-%m-%d %H:%M:%S")
        except Exception as e:
	    result = datetime.now()

        return result
        '''
        return item.time


    def item_categories(self, item):
        """
        Takes an item, as returned by items(), and returns the item's
        categories.
        """
        #brk(host="192.168.1.135", port=9000)

        if hasattr(item, 'tags') :
            return item.tags[0].split(' ')
        else:
            return []
