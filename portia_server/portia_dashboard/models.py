from __future__ import unicode_literals


#wyong, 20170306
from django.db import models 
#from portia_orm.models import (Project,Schema)

#wyong, 20170320
#from .utils import when_classes_prepared
#from .dynamic_models import build_existing_project_article_models
#from portia_orm.datastore import data_store_context

#wyong, 20170407
from mongoengine import connect, DynamicDocument, fields


class Schedule(models.Model) : 
    #wyong, 20170417
    #id = models.AutoField(primary_key = True)
    id = models.TextField(primary_key = True )

    project = models.TextField()
    spider = models.TextField()
    start_time = models.IntegerField()
    date_update = models.IntegerField()
    interval = models.IntegerField()
    #params = models.TextField()
    times = models.IntegerField()

    @property
    def pk(self):
        return self.id

#wyong, 20170407
connect('portia')

class JobItem(DynamicDocument) :
    spider = fields.StringField(max_length=200, required=True)
    job = fields.StringField(max_length=200, required=True)
    url = fields.URLField()
    #wyong, 20170517
    #time = fields.StringField()
    time = fields.DateTimeField()


# Build all existing survey response models as soon as possible
# This is optional, but is nice as it avoids building the model when the
# first relevant view is loaded.
# todo, need change dependencies to Project,  wyong, 20170315 
#when_classes_prepared('portia_orm', 
#                            ['Project', 'Schema'],
#                            build_existing_project_article_models)

#no need anymore, wyong, 20170407
#with data_store_context():
#    build_existing_project_article_models()


#todo, Survey-> Project, Question -> Schema, wyong, 20170315
# Connect signals
#pre_save.connect(signals.question_pre_save, sender=Question)
#post_save.connect(signals.question_post_save, sender=Question)
#post_delete.connect(signals.question_post_delete, sender=Question)
#post_save.connect(signals.survey_post_save, sender=Survey)
#pre_delete.connect(signals.survey_pre_delete, sender=Survey)
