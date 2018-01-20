# Copyright (C) 2013 by Aivars Kalvans <aivars.kalvans@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

import re
import random
import base64
import logging

import requests
import json
import numpy 


log = logging.getLogger('slybot.RandomProxy')


class Mode:
    RANDOMIZE_PROXY_EVERY_REQUESTS, RANDOMIZE_PROXY_ONCE, SET_CUSTOM_PROXY = range(3)


class RandomProxy(object):
    def __init__(self, settings):
        self.mode = settings.get('PROXY_MODE')
        self.chosen_proxy = ''
        self.proxy_pool_server = settings.get('PROXY_POOL_SERVER')


    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.settings)


    def get_proxy(self):
        return requests.get("http://%s/get/" % (self.proxy_pool_server)).content

    def get_proxies(self):
        content = requests.get("http://%s/get_all/" % (self.proxy_pool_server)).content
        return json.loads(content) 

    def delete_proxy(self, proxy):
        requests.get("http://%s/delete/?proxy=%s" % (self.proxy_pool_server, proxy))


    def process_request(self, request, spider):
        
        '''
        #todo
        # Don't overwrite with a random one (server-side state for IP)
        if 'proxy' in request.meta:
            if request.meta["exception"] is False:
                return
        '''

        request.meta["exception"] = False
        if len(self.get_proxies()) == 0 :
            raise ValueError('All proxies are unusable, cannot proceed')

        if self.mode == Mode.RANDOMIZE_PROXY_EVERY_REQUESTS:
            proxy_address = "http://%s" % self.get_proxy()
        else:
            proxy_address = self.chosen_proxy

        '''
        #todo
        proxy_user_pass = self.proxies[proxy_address]

        if proxy_user_pass:
            request.meta['proxy'] = proxy_address
            basic_auth = 'Basic ' + base64.b64encode(proxy_user_pass.encode()).decode()
            request.headers['Proxy-Authorization'] = basic_auth
        else:
            log.debug('Proxy user pass not found')
        '''

        request.meta['proxy'] = proxy_address
        log.debug('Using proxy <%s>, %d proxies left' % ( proxy_address, 
                                                          len(self.get_proxies())))

    def process_exception(self, request, exception, spider):
        if 'proxy' not in request.meta:
            return
        if self.mode == Mode.RANDOMIZE_PROXY_EVERY_REQUESTS or self.mode == Mode.RANDOMIZE_PROXY_ONCE:
            proxy = request.meta['proxy']
            try:
                self.delete_proxy(proxy[7:])
            except KeyError:
                pass
            request.meta["exception"] = True
            if self.mode == Mode.RANDOMIZE_PROXY_ONCE:
                self.chosen_proxy = "http://%s" % self.get_proxy()
            log.info('Removing failed proxy <%s>, %d proxies left' % ( proxy[7:], 
                                                                       len(self.get_proxies())))
            return request
