from django.conf import settings
from portia_api.jsonapi import JSONResponse
from portia_api.jsonapi.renderers import JSONRenderer

#wyong, 20170306
from .models import (Schedule,JobItem)
import time, datetime


#wyong, 20170227
import requests

#wyong, 20170324
from storage import (get_storage_class,create_project_storage)
from portia_orm.models import Project
          
#wyong, 20170324
#from dbgp.client import brk

#wyong, 20170414
import inspect

#wyong, 20170417
import uuid 

#wyong, 20170915
import re

def _request_get(url):
    retryTime = 5
    res = None
    for i in range(retryTime):
        try:
            res = requests.get(url)#self.proxyUtil.getRandomProxy())
            if res.status_code !=200:
                continue
            break
        except:
            continue
    return res

#wyong, 20170413
def _request_post(url):
    retryTime = 5
    res = None
    for i in range(retryTime):
        try:
            res = requests.post(url)#self.proxyUtil.getRandomProxy())
            if res.status_code !=200:
                continue
            break
        except:
            continue
    return res

def matchDate(line):
    matchThis = ""
    matched = re.match(r'\d\d\d\d-\d\d-\d\d\ \d\d:\d\d:\d\d',line)
    if matched:
        #matches a date and adds it to matchThis            
        matchThis = matched.group() 
    else:
        matchThis = "NONE"
    return matchThis

def parseLine(line):
    return re.findall( r'(?P<date>\d\d\d\d-\d\d-\d\d\ \d\d:\d\d:\d\d) \[(?P<source>[^\]]+)\] (?P<level>INFO|DEBUG|ERROR|WARNING|CRITICAL): (?P<text>.*)', line ) [0]
    

def generateDicts(log):
    currentDict = {}
    for line in log.splitlines():
        if line.startswith(matchDate(line)):
            if currentDict:
                yield currentDict
            date, source, level, text = parseLine(line)
            currentDict = {"date": date, "source":source, "level":level, "text":text}
        else:
            currentDict["text"] += line
    yield currentDict


#wyong, 20170410
def job_log(request):
    #brk(host="192.168.1.135", port=9000)

    project_id = request.GET.get('project')
    spider_id = request.GET.get('spider')
    job_id = request.GET.get('job')

    res = _request_get("%s/logs/%s/%s/%s.log" %(settings.SCRAPYD_URL,project_id, spider_id, job_id ))

    result = res.text if res else '' 

    #change log to a list of dictionary, wyong, 20170914
    if result != '':
        result = list(generateDicts(result))

    return JSONResponse({"project":project_id,"spider":spider_id, "job": job_id,  "log" : result})
 

#wyong, 20170413
def job_cancel(request):
    #brk(host="192.168.1.135", port=9000)

    project_id = request.GET.get('project')
    job_id = request.GET.get('job')

    res = _request_post("%s/cancel.json?project=%s&job=%s" %(settings.SCRAPYD_URL,project_id, job_id ))
    if res:
        result = res.json()
        if result.get("status", '') == 'ok' :
            return JSONResponse({'status':'ok'})
    
    return JSONResponse({'status':'error'})
 


def job_list(request) :
    #bugfix, wyong, 20170426
    result = {}

    project_id = request.GET.get('project')
    #wyong, 20170414
    spider = request.GET.get('spider', '')

    res = _request_get("%s/listjobs.json?project=%s" %(settings.SCRAPYD_URL,project_id))
    if res:
        #todo, status is one of 'Pending', 'Running', 'Finished',  get status from request
        #status = 'all' 

        #wyong, 20170413
        #if status == 'all':
        #    result = res.json()
        #else:

        for status in ['pending', 'running', 'finished']:
            data = res.json().get(status,[])
            jobs = []
            for item in data:
                if (spider == '' or spider == item['spider']):
                    job = item;
                    #wyong, 20170413
                    job['project'] = project_id 

                    start_time = end_time = running_time = None
                    if 'start_time' in item.keys():
                        start_time = datetime.datetime.strptime(item['start_time'],"%Y-%m-%d %H:%M:%S.%f")
                        job['start_time'] = start_time.strftime("%Y-%m-%d %H:%M:%S")
                    if 'end_time' in item.keys():
                        end_time = datetime.datetime.strptime(item['end_time'],"%Y-%m-%d %H:%M:%S.%f")
                        job['end_time'] = end_time.strftime("%Y-%m-%d %H:%M:%S")
                    if start_time and end_time:
                        running_time = "%.2f"    %((end_time - start_time).total_seconds()/3600)
                        job['running_time'] = running_time
                    jobs.append(job)
            
            result[status] = jobs  

    return JSONResponse(result)
  

#wyong, 20170306
def schedule_add(request):
    #brk(host="192.168.1.135", port=9000)
    project = request.GET.get('project')
    spider = request.GET.get('spider')
    #startTime = request.GET.get('startTime')
    startTime = 0
    interval = request.GET.get('interval')
    times = request.GET.get('times')
    startTimestamp = int(time.time() * 1000)
    if startTime:
        startTimestamp = time.mktime(datetime.datetime.strptime(startTime,'%Y-%m-%d %H:%M:%S').timetuple())*1000
    if project and spider and interval:
        #wyong, 20170417
        schedule = Schedule(id = uuid.uuid1().hex, 
                            project = project, 
                            spider = spider, 
                              start_time = startTimestamp, 
                              interval = interval, 
                            times = times, 
                              date_update = int(time.time() * 1000)
                           )
        schedule.save()
        return JSONResponse({'status':'ok'})
    else:
        return JSONResponse({'status':'error'})


def schedule_list(request):
    #brk(host="192.168.1.135", port=9000)
    result =[]
    schedules = Schedule.objects.all()
    for schedule in schedules:
        #wyong, 20170417
        st_dt_obj = datetime.datetime.fromtimestamp( schedule.start_time / 1000 )
        up_dt_obj = datetime.datetime.fromtimestamp( schedule.date_update / 1000 )
        
        result.append({'id':schedule.id , 
                       'project':schedule.project, 
                       'spider':schedule.spider,

                       #wyong, 20170417
                       'start_time' : st_dt_obj.strftime("%Y-%m-%d %H:%M:%S"),
                       'update_time' : up_dt_obj.strftime("%Y-%m-%d %H:%M:%S"),

                       'interval' : schedule.interval,
                       'times' : schedule.times
                      })

    return JSONResponse(result)

def schedule_del(request):
    id = request.GET.get('id')
    if id:
        Schedule.objects.get(id=id).delete()
        return JSONResponse({'status':'ok'})
    else:
        return JSONResponse({'status':'error'})

#wyong, 20170324
def article_list(request):
    #brk(host="192.168.1.135", port=9000)

    result =[]
    job = request.GET.get('job')
    items = JobItem.objects(job=job)

    for item in items:
       res = { 'id': str(item.id) , 
               'job':item.job, 
               'spider':item.spider, 
               'url':item.url,
               #wyong, 20170517
               #wyong, 20170417
               'time' : item.time.strftime("%Y-%m-%d %H:%M:%S")
             }
       result.append(res)

    return JSONResponse(result)

#wyong, 20170417
def article_detail(request):
    #brk(host="192.168.1.135", port=9000)

    result = {} 
    job_item_id = request.GET.get('job_item')
    job_items = JobItem.objects( id = job_item_id )

    if job_items[0] :
       #wyong, 20170414
       for name, value in job_items[0].__dict__.iteritems():
           if not name.startswith('_') and not inspect.ismethod(value):
               #value = getattr(item, name )
               result[name] = value

    return JSONResponse(result)

#wyong, 20170417
def article_del(request):
    #wyong, 20170517
    spider_id = request.GET.get('spider')
    job_id = request.GET.get('job')
    job_item_id = request.GET.get('job_item')

    if spider_id :
        jobItems = JobItem.objects.filter(spider=spider_id)
        for item in jobItems :
            item.delete()
        return JSONResponse({'status':'ok'})
    elif job_id :
        jobItems = JobItem.objects.filter(job=job_id)
        for item in jobItems :
            item.delete()
        return JSONResponse({'status':'ok'})
    elif job_item_id:
        JobItem.objects.get(id=job_item_id).delete()
        return JSONResponse({'status':'ok'})
    else:
        return JSONResponse({'status':'error'})
