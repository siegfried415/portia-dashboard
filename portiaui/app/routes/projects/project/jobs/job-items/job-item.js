import Ember from 'ember';
//import JobItemModel from '../../../../../models/job-item';


export default Ember.Route.extend({
    model(params) {
        var model = this.store.createRecord('job-item');
        return model.findAll(params.job_item_id );
    },
 
    renderTemplate() {
        this.render({
            into: 'application',
            outlet: 'main'
        });
    },

});
