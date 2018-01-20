import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.store.peekRecord('command', params.command_id);
    },

    actions: {
        error() {
            this.transitionTo('projects.project.spider.action.data');
        }
    }
});
