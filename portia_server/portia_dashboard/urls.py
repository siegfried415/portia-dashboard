from django.conf.urls import url, include
from . import views
#from portia_api import urls

from . import feeds
from django.conf.urls.static import static

urlpatterns = [
    url(r'job/list$', views.job_list),
    url(r'job/log', views.job_log),
    url(r'job/cancel', views.job_cancel),
    url(r'job/delete', views.job_delete),

    url(r'schedule/list$', views.schedule_list ),
    url(r'schedule/add$', views.schedule_add ),
    url(r'schedule/del$', views.schedule_del ),

    url(r'article/list', views.article_list),
    url(r'article/detail', views.article_detail),
    url(r'article/del', views.article_del),
    url(r'article/rss/(?P<spider>[a-zA-Z0-9-_]+)$', feeds.LatestArticlesFeed()),
] + static('article/images', document_root = '/home/wyong/portia/data/articles/images')
