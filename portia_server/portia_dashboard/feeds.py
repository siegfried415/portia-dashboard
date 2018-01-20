from django.contrib.syndication.views import Feed
#from django.urls import reverse
from .models import JobItem 
from django.utils.feedgenerator import Rss201rev2Feed
from django.utils.feedgenerator import Atom1Feed


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
        #return JobItem.objects.get(pk=beat_id)
        return {'name': spider}

    def title(self, obj):
        if obj:
            return obj['name'] 
        else:
            return 'News scraped by Portia 2.0'

    def link(self, obj):
        if obj:
            return "/dashboard/article/%s/rss" % obj['name']
        else:
            return "/dashboard/article/rss"


    def items(self, obj):
        if obj :
            return JobItem.objects.filter(spider=obj['name']).order_by('-time')[:15]
        else :
            return JobItem.objects.order_by('-time')[:15]


    def item_title(self, item):
        return item.title[0]

    def item_description(self, item):
        return item.body[0]

    # item_link is only needed if NewsItem has no get_absolute_url method.
    def item_link(self, item):
        #return reverse('news-item', args=[item.pk])
        return item.url

    def item_pubdate(self, item):
        """
        Takes an item, as returned by items(), and returns the item's
        pubdate.
        """
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
        if hasattr(item, 'tags') :
            return item.tags[0].split(' ')
        else:
            return []
