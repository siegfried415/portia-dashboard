import Ember from 'ember';
import JobItemModel from '../../../../../models/job-item';


export default Ember.Route.extend({
    model(params) {
        //wyong, 20170328
        console.log("route/projects/project/jobs/job_items/job_item.js, params.job_item_id = ", 
                    params.job_item_id );

        //wyong, 20170906
        //var model = new JobItemModel();
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
