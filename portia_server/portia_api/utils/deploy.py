from __future__ import absolute_import
import itertools
import json
import os
import sys
import glob
import tempfile
import shutil
import time
import urllib2
import netrc
from urlparse import urlparse, urljoin
from subprocess import Popen, PIPE, check_call

from w3lib.form import encode_multipart
import setuptools # not used in code but needed in runtime, don't remove!

from scrapy.utils.project import inside_project
from scrapy.utils.http import basic_auth_header
from scrapy.utils.python import retry_on_eintr
from scrapy.utils.conf import get_config, closest_scrapy_cfg

from django.conf import settings 


class ProjectDeployer(object):

    def __init__(self, project, storage ):
        self.project = project
        self.storage = storage


    def _log(self, message):
        sys.stderr.write(message + os.linesep)

    def _build_egg(self):
        #closest = closest_scrapy_cfg()
        closest = self.storage.path('scrapy.cfg')
        os.chdir(os.path.dirname(closest))

        '''
        if not os.path.exists('setup.py'):
            settings = get_config().get('settings', 'default')
            _create_default_setup_py(settings=settings)
        '''

        d = tempfile.mkdtemp(prefix="scrapydeploy-")
        o = open(os.path.join(d, "stdout"), "wb")
        e = open(os.path.join(d, "stderr"), "wb")
        retry_on_eintr(check_call, [sys.executable, 'setup.py', 'clean', '-a', 'bdist_egg', '-d', d], stdout=o, stderr=e)
        o.close()
        e.close()
        egg = glob.glob(os.path.join(d, '*.egg'))[0]

        return egg, d

    def _get_version(self):
        '''
        version = opts.version or target.get('version')
        if version == 'HG':
            p = Popen(['hg', 'tip', '--template', '{rev}'], stdout=PIPE)
            d = 'r%s' % p.communicate()[0]
            p = Popen(['hg', 'branch'], stdout=PIPE)
            b = p.communicate()[0].strip('\n')
            return '%s-%s' % (d, b)
        elif version == 'GIT':
            p = Popen(['git', 'describe'], stdout=PIPE)
            d = p.communicate()[0].strip('\n')
            if p.wait() != 0:
                p = Popen(['git', 'rev-list', '--count', 'HEAD'], stdout=PIPE)
                d = 'r%s' % p.communicate()[0].strip('\n')

            p = Popen(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], stdout=PIPE)
            b = p.communicate()[0].strip('\n')
            return '%s-%s' % (d, b)
        elif version:
            return version
        else:
        '''
        return str(int(time.time()))

    def _http_post(self, request):
        try:
            f = urllib2.urlopen(request)
            self._log("Server response (%s):" % f.code)
            response = f.read()
            print response 
            return  response 

        except urllib2.HTTPError, e:
            self._log("Deploy failed (%s):" % e.code)
            resp = e.read()
            try:
                d = json.loads(resp)
            except ValueError:
                print resp
            else:
                if "status" in d and "message" in d:
                    print "Status: %(status)s" % d
                    print "Message:\n%(message)s" % d
                else:
                    print json.dumps(d, indent=3)
        except urllib2.URLError, e:
            self._log("Deploy failed: %s" % e)

    def _upload_egg(self, eggpath, project, version ):
        with open(eggpath, 'rb' ) as f :
            eggdata = f.read()
 
        data = {
            'project': project,
            'version' : version, 
            'egg' : ('project.egg', eggdata),
        }

        body, boundary = encode_multipart(data)
        #url = _url(target, 'addversion.json')
        url = "%s/addversion.json" % settings.SCRAPYD_URL

        headers = {
            'Content-Type': 'multipart/form-data; boundary=%s' % boundary,
            'Content-Length': str(len(body)),
        }

        req = urllib2.Request(url, body, headers)
        #_add_auth_header(req, target)
        self._log('Deploying to project "%s" in %s' % (project, url))

        return self._http_post(req)


    def deploy(self):
        egg, tmpdir = self._build_egg()
        version = self._get_version()
        return self._upload_egg(egg, self.project.id, version)

