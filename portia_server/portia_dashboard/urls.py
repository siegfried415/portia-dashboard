from django.conf.urls import url, include
from . import views
#from portia_api import urls

#wyong, 20170510
from . import feeds

#wyong, 20170511
#from django.views.static import serve
#from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #wyong, 20170410
    url(r'job/list$', views.job_list),
    url(r'job/log', views.job_log),
    #wyong, 20170413
    url(r'job/cancel', views.job_cancel),

    url(r'schedule/list$', views.schedule_list ),
    url(r'schedule/add$', views.schedule_add ),
    url(r'schedule/del$', views.schedule_del ),

    #wyong, 20170324
    url(r'article/list', views.article_list),
    #wyong, 20170417
    url(r'article/detail', views.article_detail),
    #wyong, 20170414 
    url(r'article/del', views.article_del),

    #wyong, 20170510
    #url(r'article/rss', feeds.LatestArticlesFeed()),

    #wyong, 20170516
    url(r'article/rss/(?P<spider>[a-zA-Z0-9-_]+)$', feeds.LatestArticlesFeed()),

] + static('article/images', document_root = '/home/wyong/portia-2.0.2-master/slyd/slyd/data/articles/images')
