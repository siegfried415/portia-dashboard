import Ember from 'ember';

export default Ember.Route.extend({
    browser: Ember.inject.service(),

    model(params) {
        return this.store.peekRecord('action', params.action_id);
    },

    afterModel(model) {
        return model.reload().then(model => {
            return model;
        });
    },

    renderTemplate() {
        this.render('projects/project/spider/action/structure', {
            into: 'projects/project/spider/structure',
            outlet: 'spider-structure'
        });
    
        this.render('projects/project/spider/action/toolbar', {
            into: 'projects/project',
            outlet: 'browser-toolbar'
        });
    },

    actions: {
        error() {
            this.transitionTo('projects.project.spider',
                this.modelFor('projects.project.spider'));
        }
    }
});
