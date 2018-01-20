from __future__ import unicode_literals


from django.db import models 
from mongoengine import connect, DynamicDocument, fields


class Job(models.Model) :
    id = models.TextField(primary_key = True )
    index = models.IntegerField(default=0)
    spider = models.TextField(default='')
    start_time = models.IntegerField(default=0)
    end_time = models.IntegerField(default=0)
    status = models.TextField( default = '') 
    error_count= models.IntegerField(default=0)
    warning_count = models.IntegerField(default=0)
    critical_count = models.IntegerField(default=0)
  
    @property
    def pk(self):
        return self.id

class Log(models.Model):
    id = models.TextField(primary_key = True )
    content = models.TextField(default='')


class Schedule(models.Model) : 
    id = models.TextField(primary_key = True )

    project = models.TextField()
    spider = models.TextField()
    start_time = models.IntegerField()
    date_update = models.IntegerField()
    interval = models.IntegerField()
    times = models.IntegerField()

    @property
    def pk(self):
        return self.id

connect('portia')

class JobItem(DynamicDocument) :
    spider = fields.StringField(max_length=200, required=True)
    job = fields.StringField(max_length=200, required=True)
    url = fields.URLField()
    time = fields.DateTimeField()

