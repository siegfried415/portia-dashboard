from .projects import BaseProjectModelRoute
from .serializers import ActionSerializer
from portia_orm.models import Action


class ActionRoute(BaseProjectModelRoute):
    lookup_url_kwarg = 'action_id'
    default_model = Action 

    def perform_create(self, serializer):
        self.project.spiders  # preload spiders
        super(ActionRoute, self).perform_create(serializer)

    def get_instance(self):
        return self.get_collection()[self.kwargs.get('action_id')]

    def get_collection(self):
        project = self.project
        #project.schemas  # preload schemas and fields
        #project.extractors  # preload extractors
        spider = project.spiders[self.kwargs.get('spider_id')]
        for action in spider.actions:
            action = Action.load(action.storage, action)
            #action.url
            spider.actions.add(action)
        return spider.actions

    def get_detail_kwargs(self):
        return {
            'include_data': [
                'commands',
            ],
        }


    def get_list_kwargs(self):
        excludes = (ActionSerializer.opts
                                    .default_kwargs['exclude_map']['actions'])
        return {
            'exclude_map': { 
                'actions': excludes +  [
                    'commands',
                ]
            }
        }
