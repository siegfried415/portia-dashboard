from .projects import BaseProjectModelRoute
from ..jsonapi.utils import cached_property
from portia_orm.models import Command 


class CommandRoute(BaseProjectModelRoute):
    lookup_url_kwarg = 'command_id'
    default_model = Command 

    @cached_property
    def action(self):
        return (self.project.spiders[self.kwargs.get('spider_id')]
                            .actions[self.kwargs.get('action_id')])

    def perform_create(self, serializer):
        spider = self.project.spiders[self.kwargs.get('spider_id')]
        action = spider.actions[self.kwargs.get('action_id')]
        #self.action # preload items and annotations
        return super(CommandRoute, self).perform_create(serializer)

    def get_instance(self):
        return self.get_collection()[self.kwargs.get('command_id')]

    def get_collection(self):
        project = self.project
        #project.schemas  # preload schemas and fields
        #project.extractors  # preload extractors
        spider = self.project.spiders[self.kwargs.get('spider_id')]
        action = spider.actions[self.kwargs.get('action_id')]
        return action.commands

    def get_detail_kwargs(self):
        return {
            'include_data': [
                'commands',
            ],
        }
