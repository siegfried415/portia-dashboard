
//import Ember from 'ember';
import DS from 'ember-data';


export default DS.Model.extend({
    /*
    project : DS.attr('string'),
    spider: DS.attr('string'),
    type: DS.attr('string'),
    log: DS.attr('string'),
    */
    //job : Ember.Object(),
    //collection : Ember.A(),

    findAll: function(project_id, spider_id, job_id) {
        //var __this = this; 
        //console.log('JobLogModel findAll(10), collection = ' + collection );

        var url = '/dashboard/job/log?project=' + project_id ;
        url += '&spider=' + spider_id;
        url += '&job=' + job_id ;

        //wyong, 20170413
        return $.getJSON(url).then( function(data) {
            console.log('JobLogModel findAll(20), data=' + data.log );


            //Ember.get(__this, 'collection').clear();
            /*
            $.each(data, function(i, row) {
                console.log('JobLogModel findAll(30), '+ i + " " +  row );
                var item = collection.contentArrayContains(row.id, row.job, collection);
                if (!item) {
                    console.log('ArticleModel findAll(40)' );
                    Ember.get(collection, 'collection').pushObject(row);
                    //row.set('isLoaded', true);
                    //row.set('isError', false);
                }
            });
            */

            //Ember.get(__this, "collection").pushObject(data);
            return data;

        });

        //return this.get('collection')[0];
    },

});
