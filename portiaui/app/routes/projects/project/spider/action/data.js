import Ember from 'ember';
const { inject: { service }} = Ember;

export default Ember.Route.extend({
    browser: service(),
    uiState: service(),


    init() {
        this._super(...arguments);
        this.scheduledRenderOverlays = null;
    },

    model() {
        return this.modelFor('projects.project.spider.action');
    },


    activate() {
        this.controllerFor('projects.project').setClickHandler(this.viewPortClick.bind(this));
        this.controllerFor('projects.project').setChangeHandler(this.viewPortChange.bind(this));
    },

    deactivate() {
        this.controllerFor('projects.project').clearClickHandler();
    },

    renderTemplate() {
        this.render('projects/project/spider/action/data/structure', {
            into: 'projects/project/spider/action/structure',
            outlet: 'action-structure'
        });

        this.render('projects/project/spider/action/data/toolbar', {
            into: 'projects/project/spider/action/toolbar',
            outlet: 'browser-toolbar'
        });

    },

    viewPortClick() {
        this.get('controller').send('recordClick', ...arguments);
    },

    viewPortChange() {
        this.get('controller').send('recordChange', ...arguments);
    },
});
