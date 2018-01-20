import json
import re

import os 
#from scrapy_splash.middleware import SplashMiddleware
import logging

LUA_SOURCE = """
function main(splash)
    assert(splash:go(splash.args.url))


    local command_handler = {}
    command_handler['click'] = splash:jsfunc([[
        function(data ) {
            var events = ["mousemove", "mouseover", "mousedown", "mouseup", "click"];
            var elements = document.querySelectorAll(data.tgt);
            Array.prototype.forEach.call(elements, function(element){
                var clientRect = element.getBoundingClientRect();
                var clientX = clientRect.left + clientRect.width / 2;
                var clientY = clientRect.top + clientRect.height / 2;
                Array.prototype.forEach.call(events, function(event){
                    var ev = document.createEvent("MouseEvent");
                    ev.initMouseEvent(event, true, true, window, 0,
                                      clientX, clientY, clientX, clientY,
                                      false, false, false, false, 0, null);
                    element.dispatchEvent(ev);
                });
            });
        }
    ]])

    command_handler['scroll'] = splash:jsfunc([[
        function(data){
            var elements = document.querySelectorAll(data.tgt);
            Array.prototype.forEach.call(elements, function(element){
                if(element === document.documentElement && element.scrollHeight === document.body.scrollHeight){
                    element = document.body;
                }
                var maxY = element.scrollMaxY || element.scrollHeight;
                element.scrollTop = (data.val/100)*maxY;
            });
        }
    ]])

    command_handler['input'] = splash:jsfunc([[
        function(data) {
            var elements = document.querySelectorAll(data.tgt);
            Array.prototype.forEach.call(elements, function(element){
                var type;
                if(element.tagName === 'SELECT') {
                    type = 'change';
                    /*
		    for (var i = 0, len = select.options.length; i < len; i++) {
	            	var option = select.options[ i ];
			if (option.value === value) {
			    option.selected = true;
			    return;
			}
		    }
		    select.selectedIndex = -1;
                    */
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    type = 'input';
                    element.value = data.val;
                }
                var ev = document.createEvent('Event');
                ev.initEvent(type, true, false);
                element.dispatchEvent(ev);
            });
        }
    ]])

    local pre_command = null
    for i, command in ipairs(splash.args.js_commands) do 
        --wait sometimes to make sure splash has loaded the page 
        if pre_command then 
            if pre_command.url == command.url then 
                splash:wait(0.1)
            else
                splash:wait(2.0)
            end
        end 

        command_handler[command.cmd](command)
        pre_command = command

    end  

    splash:wait(2.0)

    splash:set_result_content_type("text/html")
    --return splash.html()
    return {
        html = splash:html(),
        cookies = splash:get_cookies(),
    }

end
"""

def _cmd_key(command):
    return command.get('ind', 0) 

def filter_for_url(url):
    def _filter(action):
        accept = action.get('url')
        if accept and accept != url:
            return False
        return True
    return _filter

log = logging.getLogger('slybot.SlybotJsMiddleware')

class ActionsMiddleware(object):
    def process_request(self, request, spider):
        splash_options = request.meta.get('splash', None)
        if not splash_options:  # Already processed or JS disabled
            return
        splash_args = splash_options.get('args', {})
        log.info("ActionMiddleware, process_request, url=" + splash_args.get('url') )

        actions = spider.actions
        url = splash_args['url']

        #todo, sometimes can't get the right actions
        actions = list(filter(filter_for_url(url), actions))

        if len(actions):
            #todo, process first action only.
            #splash_options['endpoint'] = 'execute'

            splash_args.update({
                "lua_source": LUA_SOURCE,
                "js_commands": sorted( actions[0].get('commands'), key=_cmd_key ) ,
            })

            #request = super(ActionsMiddleware, self).process_request(request, spider)


__all__ = ['ActionsMiddleware']
