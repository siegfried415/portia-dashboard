_PROJECT_TEMPLATE = """\
{}\
"""


_SETTINGS_TEMPLATE = """\
# Automatically created by: slyd
import os

USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'

SPIDER_MANAGER_CLASS = 'slybot.spidermanager.ZipfileSlybotSpiderManager'
EXTENSIONS = {'slybot.closespider.SlybotCloseSpider': 1}

ITEM_PIPELINES = {
    #'slybot.dupefilter.DupeFilterPipeline': 1 ,
    #'slybot.django-dupefilter.DjangoDupeFilterPipeline': 10,
    #'slybot.image-pipeline.MyImagesPipeline' : 50,
    'slybot.django-pipeline.DjangoPipeline': 100
}

#IMAGES_STORE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../articles'))
#IMAGES_URLS_FIELD = 'body'
#IMAGES_URL  = 'http://localhost:9001/dashboard/article/'

#REFERRER_POLICY = "scrapy.spidermiddlewares.referer.OriginWhenCrossOriginPolicy"
SPIDER_MIDDLEWARES = {
    'slybot.spiderlets.SpiderletsMiddleware': 999, # as close as possible to spider output
    #'scrapy.spidermiddlewares.referer.RefererMiddleware':100
}

SPLASH_URL = "http://localhost:8050/render.html"
#SPLASH_COOKIES_DEBUG = True

DOWNLOADER_MIDDLEWARES = {
    #'scrapy.contrib.downloadermiddleware.httpproxy.HttpProxyMiddleware': 100,
    #'slybot.proxy.SquidProxyMiddleware': 110,
    #'slybot.pageactions.PageActionsMiddleware': 700,
    'slybot.actions.ActionsMiddleware': 715,
    'scrapy_splash.middleware.SplashCookiesMiddleware': 723,
    'slybot.splash.SlybotJsMiddleware': 725
}
PLUGINS = [
    'slybot.plugins.scrapely_annotations.Annotations',
    'slybot.plugins.selectors.Selectors'
]
#SLYDUPEFILTER_ENABLED = True
#DUPEFILTER_CLASS = 'scrapy_splash.SplashAwareDupeFilter'

PROJECT_ZIPFILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

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
    from local_slybot_settings import *
except ImportError:
    pass
"""


_SETUP_PY_TEMPLATE = """\
# Automatically created by: slyd

from setuptools import setup, find_packages

setup(
    name         = '%(name)s',
    version      = '1.0',
    packages     = find_packages(),
    package_data = {
        'spiders': ['*.json', '*/actions/*.json', '*/templates/*.json',  '*/templates/*/*.html']
    },
    data_files = [('', ['project.json', 'items.json', 'extractors.json'])],
    entry_points = {'scrapy': ['settings = spiders.settings']},
    zip_safe = True
)

"""


_SCRAPY_TEMPLATE = """\
# Automatically created by: slyd

[settings]
default = slybot.settings

[deploy:local]
url=http://localhost:6800
"""

_ITEMS_TEMPLATE = """\
{}
"""

_EXTRACTORS_TEMPLATE = """\
{}
"""


templates = {
    'PROJECT': _PROJECT_TEMPLATE,
    'SETTINGS': _SETTINGS_TEMPLATE,
    'SETUP': _SETUP_PY_TEMPLATE,
    'SCRAPY': _SCRAPY_TEMPLATE,
    'ITEMS': _ITEMS_TEMPLATE,
    'EXTRACTORS': _EXTRACTORS_TEMPLATE
}
