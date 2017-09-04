service rabbitmq-server start
celery worker -A portia_dashboard -B -l debug 
