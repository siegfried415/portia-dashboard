import Ember from 'ember';
//import JobItemsModel from '../../../../models/job-items';


export default Ember.Route.extend({
    model(params) {
        var model = this.store.createRecord('job-items');
        return model.findAll(params.job_id);
    },
 
    renderTemplate() {
        this.render({
            into: 'application',
            outlet: 'main'
        });
    },

});
