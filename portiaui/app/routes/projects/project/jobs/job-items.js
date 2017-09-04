import Ember from 'ember';
import JobItemsModel from '../../../../models/job-items';


export default Ember.Route.extend({
    model(params) {
        //wyong, 20170328
        console.log("route/projects/project/job/item.js, params.job_id = " , params.job_id );

        //wyong, 20170906
        //var model = new JobItemsModel();
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
