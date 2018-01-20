import Ember from 'ember';
import DS from 'ember-data';

const Job = Ember.Object.extend({
    id : '',
    items_display_name : 'items',
    log_display_name : 'log', 
});

export default DS.Model.extend({

    collection: Ember.A(),

    contentArrayContains: function(id, type) {
        var contains = null;

        this.collection.forEach(function(item) {
            if (item.id === id ) {
                if ( item.type !== type ) {
                    item.set('type',  type ) ; 
                }
                contains = item;
            }
        });

        return contains;
    },


    findAll : function(project) {
        var url = '/dashboard/job/list?project=' + project;
        var __this = this;

        return $.getJSON( url ).then(function(data) {

            var types = ['pending', 'running', 'finished'];
            types.forEach(function(type) {
                $.each(data[type], function(i,row ) {
                    var item = __this.contentArrayContains(row.id, type );
                    if (!item) {
                        var job = Job.create();
                        job.setProperties(row);
                        job.set( 'type' , type );
                        Ember.get(__this, 'collection').pushObject(job);
                        //jobs.pushObject(job);
                    } 
                });
            });
            return Ember.get(__this,'collection');
        });
    }
});
