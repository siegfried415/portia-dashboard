from django.conf import settings
from portia_api.jsonapi import JSONResponse
from portia_api.jsonapi.renderers import JSONRenderer

from .models import (Job, Log, Schedule,JobItem)
import time, datetime

import requests

from storage import (get_storage_class,create_project_storage)
from portia_orm.models import Project

import inspect
import uuid
import re
from django.db.models import Max

import logging
logger = logging.getLogger('portia_dashboard')

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
    index = 1
    for line in log.splitlines():
        if line.startswith(matchDate(line)):
            if currentDict:
                yield currentDict
            date, source, level, text = parseLine(line)
            currentDict = {
                               "index" : index,
                               "date": date,
                               "source":source,
                               "level":level,
                               "text":text
                          }
            index = index + 1
        else:
            currentDict["text"] += line

    yield currentDict


def _get_log_from_scrapyd(project_id, spider_id,  job_id ) :
    res = _request_get("%s/logs/%s/%s/%s.log" %(settings.SCRAPYD_URL,project_id, spider_id, job_id ))
    return res.text if res.status_code == 200 else ''



def _get_log(project_id, spider_id, job_id, job_status ):
    log = None
    try:
        log = Log.objects.get(id=job_id )

    except Log.DoesNotExist:
        content = _get_log_from_scrapyd(project_id, spider_id, job_id )
	log = Log.objects.create(id=job_id , content=content )
        return log

    if job_status != 'finished' :
        log.content = _get_log_from_scrapyd(project_id, spider_id, job_id )
        log.save()

    return log


def job_log(request):
    result = []
    project_id = request.GET.get('project')
    spider_id = request.GET.get('spider')
    job_id = request.GET.get('job')

    job = Job.objects.get(id=job_id)
    if job:
        log = _get_log(project_id, job.spider, job.id, job.status )
        if log :
            result = list(generateDicts(log.content))

    return JSONResponse({"project":project_id,"spider":spider_id, "job": job_id, "log":result})


def _get_log_count(project_id, spider_id, job_id, job_status ) :
    warnings, errors , criticals = 0,0,0
    log = _get_log(project_id, spider_id, job_id, job_status  )
    if log :
        try:
            result = list(generateDicts(log.content ))
            for item in result :
                if item['level'] == 'WARNING' :
                    warnings += 1
                elif item['level'] == 'ERROR' :
                    errors += 1
                elif item['level'] == 'CRITICAL' :
                    criticals += 1
        except KeyError:
            pass

    return warnings, errors, criticals


def job_cancel(request):
    project_id = request.GET.get('project')
    job_id = request.GET.get('job')

    res = _request_post("%s/cancel.json?project=%s&job=%s" %(settings.SCRAPYD_URL,project_id, job_id ))
    if res:
        result = res.json()
        if result.get("status", '') == 'ok' :
            return JSONResponse({'status':'ok'})

    return JSONResponse({'status':'error'})


def job_delete(request):
    id = request.GET.get('job')

    if id:
        Job.objects.get(id=id).delete()
        Log.objects.get(id=id ).delete()
        return JSONResponse({'status':'ok'})
    else:
        return JSONResponse({'status':'error'})



def _get_timestamp_from_string( timestring ) :
    dt = datetime.datetime.strptime(timestring,"%Y-%m-%d %H:%M:%S.%f")
    ts = time.mktime (dt.timetuple()) * 1000
    return ts


def _get_stub_job ():
    try:
        job = Job.objects.get(id='ffffffffffffffff0000000000000000')
    except Job.DoesNotExist:
	job = Job.objects.create(id = 'ffffffffffffffff0000000000000000', spider='', start_time = 0 , index = 0 )
    return job

def _get_last_start_time ():
    job = _get_stub_job()
    max_start_time = job.start_time
    return max_start_time


def _set_last_start_time(last_start_time) :
    job = _get_stub_job()
    job.start_time = last_start_time
    job.save()

def _get_last_index():
    job = _get_stub_job()
    last_index = job.index
    return last_index


def _set_last_index ( last_index ) :
    job = _get_stub_job()
    job.index = last_index
    job.save()

def _update_jobs_model(project_id) :

    #last_start_time = _get_last_start_time()
    updated_count = 0
    created_count = 0

    res = _request_get("%s/listjobs.json?project=%s" %(settings.SCRAPYD_URL,project_id))
    if res:
        jobids = []
        savedjobs={}
        for status in ['pending', 'running', 'finished']:
            data = res.json().get(status, [])

            for item in data:
                jobids.append(item['id'])
        #if the scrapyd was closed,the projects will be lost. So first check the projects from the databases
        if len(jobids)>0:
            Job.objects.exclude(id__in=jobids).update(status='lost connection')
            jobs=Job.objects.filter(id__in=jobids)
            for savedjob in jobs:
                savedjobs[savedjob.id]=savedjob


        for status in ['pending', 'running', 'finished']:

            data = res.json().get(status,[])
            jobs = []
            for item in data:
                created = False

                #try:
                    #job = Job.objects.get(id=item['id'])
                job=savedjobs.get(item['id'],None)

                #except Job.DoesNotExist:
                if not job:
                    if 'start_time' in item and _get_timestamp_from_string(item['start_time']) <= _get_last_start_time() :
                        # the job must be removed, so skip it
                        continue

                    job = Job.objects.create(id = item['id'], spider=item['spider'], index = ( _get_last_index() + 1 ))
                    _set_last_index(job.index)
                    created = True
                    created_count += 1

                #job maybe changed if not in 'finished' status.
                if job.status != 'finished' or job.start_time == 0 or job.end_time == 0 :
                    if 'start_time' in item :
                        job.start_time = _get_timestamp_from_string(item['start_time'])
                    if 'end_time' in item :
                        job.end_time = _get_timestamp_from_string(item['end_time'])

                    if status == 'finished' :
                        job.warning_count, job.error_count, job.critical_count = _get_log_count(project_id, job.spider, job.id, job.status )

                    job.status = status
                    job.save()
                    updated_count += 1

                if created == True and job.start_time > _get_last_start_time() :
                    _set_last_start_time(job.start_time)

    return created_count, updated_count

def _get_string_from_timestamp( timestamp) :
    return datetime.datetime.fromtimestamp(timestamp / 1000 ).strftime("%Y-%m-%d %H:%M:%S")

def job_list(request) :
    result = {}

    project_id = request.GET.get('project')
    spider = request.GET.get('spider', '')

    _update_jobs_model(project_id )

    for status in ['pending', 'running', 'finished']:
        res_jobs = []
        jobs = Job.objects.filter(status = status ).order_by('-start_time')
        for job in jobs :
           if (spider == '' or spider == job.spider ):
	       res_jobs.append({'id':job.id ,
                        'index' : job.index,
			'project':project_id,
			'spider':job.spider,
			'start_time': _get_string_from_timestamp(job.start_time),
			'end_time': _get_string_from_timestamp(job.end_time),
			'error_count': job.error_count,
			'warning_count': job.warning_count,
                        'critical_count': job.critical_count
                      })

        result[status] = res_jobs

    return JSONResponse(result)


def schedule_add(request):
    project = request.GET.get('project')
    spider = request.GET.get('spider')

    interval = request.GET.get('interval')
    times = request.GET.get('times')

    if project and spider and interval:
        schedule = Schedule(id = uuid.uuid1().hex,
                            project = project,
                            spider = spider,
                              start_time = int(time.time() * 1000),
                              interval = interval,
                            times = times,
                              date_update = int(time.time() * 1000)
                           )
        schedule.save()
        return JSONResponse({'status':'ok'})
    else:
        return JSONResponse({'status':'error'})


def schedule_list(request):
    result =[]
    schedules = Schedule.objects.all()
    for schedule in schedules:

        result.append({'id':schedule.id ,
                       'project':schedule.project,
                       'spider':schedule.spider,

                       'start_time': _get_string_from_timestamp(schedule.start_time),
                       'update_time': _get_string_from_timestamp(schedule.date_update),

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

def article_list(request):
    result =[]
    job = request.GET.get('job')
    items = JobItem.objects(job=job)

    for item in items:
       res = { 'id': str(item.id) ,
               'item-display-name' : 'item',
               'job':item.job,
               'spider':item.spider,
               'url':item.url,
               'time' : item.time.strftime("%Y-%m-%d %H:%M:%S")
             }
       result.append(res)

    return JSONResponse(result)

def article_detail(request):
    result = {}
    job_item_id = request.GET.get('job_item')
    job_items = JobItem.objects( id = job_item_id )

    if job_items[0] :
       for name, value in job_items[0].__dict__.iteritems():
           if not name.startswith('_') and not inspect.ismethod(value):
               #value = getattr(item, name )
               result[name] = value

    return JSONResponse(result)

def article_del(request):
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
