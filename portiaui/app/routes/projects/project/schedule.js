import Ember from 'ember';
//import ScheduleModel from '../../../models/schedule';


export default Ember.Route.extend({
    model: function() {
        var model = this.store.createRecord('schedule');
        return model.findAll();
    },

    renderTemplate() {
        this.render({
            into: 'application',
            outlet: 'main'
        });
    },

});
