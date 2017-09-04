//import Ember from 'ember';
import DS from 'ember-data';

/*
const Job = Ember.Object.extend({
    id : '',
    project : '', 
    spider : '',
    type : '', 
    log : ''
});
*/

export default DS.Model.extend({
    //collection: Ember.A(),

    find (id) {
        return this._super(id, this );
    },


    //wyong, 20170414
    findAll : function(project) {
        //var __this = this;
        //console.log("JobModel findAll(10), collection=" , collection);
        
        //wyong, 20170412 
        var url = '/dashboard/job/list?project=' + project;

        /* wyong, 20170419
        if (spider){
            url += '&spider=' + spider;
        } 
        */

        return $.getJSON( url ).then(function(data) {
            /*
            //console.log('JobModel findAll(20), data=' , data );
            var jobs = Ember.A();

            //Ember.get(__this, 'collection').clear();
            var types = ['pending', 'running', 'finished'];
            types.forEach(function(type) {
                $.each(data[type], function(i,row ) {
                    var job = Job.create();
                    job.setProperties(row);
                    job.set( 'type' , type );
                    //console.log('JobModel findAll(30), job =', job);
                    //Ember.get(__this, 'collection').pushObject(job);
                    jobs.pushObject(job);
                });
            });
           
            return jobs;
            */
            return data;

        });

        //return this.get('collection');
    }
    
});
