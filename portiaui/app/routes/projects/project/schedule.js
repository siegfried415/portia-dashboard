import Ember from 'ember';
import ScheduleModel from '../../../models/schedule';


export default Ember.Route.extend({
    model: function() {
        //wyong, 20170906
        //var model = new ScheduleModel();
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
