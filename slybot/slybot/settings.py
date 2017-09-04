from __future__ import absolute_import

USER_AGENT = "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36"

SPIDER_MANAGER_CLASS = 'slybot.spidermanager.SlybotSpiderManager'
EXTENSIONS = {'slybot.closespider.SlybotCloseSpider': 1}
ITEM_PIPELINES = {
    #wyong, 20170515
    #'slybot.dupefilter.DupeFilterPipeline': 1,
    #'slybot.django-dupefilter.DjangoDupeFilterPipeline': 1,

    'slybot.meta.DropMetaPipeline': 2,

    #wyong, 20170510
    #'slybot.image-pipeline.MyImagesPipeline' : 50,
    'slybot.django-pipeline.DjangoPipeline':100 ,
}

#wyong, 20170512
#IMAGES_STORE = '/home/wyong/portia/data/articles'
#IMAGES_URLS_FIELD = 'body'
#IMAGES_URL  = 'http://localhost:9001/dashboard/article/'

SPIDER_MIDDLEWARES = {'slybot.spiderlets.SpiderletsMiddleware': 999}  # as close as possible to spider output
DOWNLOADER_MIDDLEWARES = {
    'slybot.pageactions.PageActionsMiddleware': 700,
    'scrapy_splash.middleware.SplashCookiesMiddleware': 723,
    'slybot.splash.SlybotJsMiddleware': 725
}
PLUGINS = [
    'slybot.plugins.scrapely_annotations.Annotations',
    'slybot.plugins.selectors.Selectors'
]
SLYDUPEFILTER_ENABLED = True
SLYDROPMETA_ENABLED = False
DUPEFILTER_CLASS = 'scrapy_splash.SplashAwareDupeFilter'
PROJECT_DIR = 'slybot-project'
FEED_EXPORTERS = {
    'csv': 'slybot.exporter.SlybotCSVItemExporter',
}
CSV_EXPORT_FIELDS = None


# Enable and configure the AutoThrottle extension (disabled by default)
# See http://doc.scrapy.org/en/latest/topics/autothrottle.html
AUTOTHROTTLE_ENABLED = True
# The initial download delay
AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
AUTOTHROTTLE_DEBUG = True 


try:
    from .local_slybot_settings import *
except ImportError:
    pass
