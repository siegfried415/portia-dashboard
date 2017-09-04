_PROJECT_TEMPLATE = """\
{}\
"""


_SETTINGS_TEMPLATE = """\
# Automatically created by: slyd
import os

USER_AGENT = 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36'

SPIDER_MANAGER_CLASS = 'slybot.spidermanager.ZipfileSlybotSpiderManager'
EXTENSIONS = {'slybot.closespider.SlybotCloseSpider': 1}

#ITEM_PIPELINES = {'slybot.dupefilter.DupeFilterPipeline': 1}
ITEM_PIPELINES = {'slybot.django-pipeline.DjangoPipeline': 100}

SPIDER_MIDDLEWARES = {'slybot.spiderlets.SpiderletsMiddleware': 999}  # as close as possible to spider output
DOWNLOADER_MIDDLEWARES = {
    'slybot.pageactions.PageActionsMiddleware': 700,
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
        'spiders': ['*.json', '*/*.json', '*/*/*.html']
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
