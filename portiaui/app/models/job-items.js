
import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    collection: Ember.A(),

    /*
    find: function(id ) {
        console.log('ScheduleModel find(10), id = ', id);
        var foundItem = this.contentArrayContains(id, this);

        if (!foundItem) {
            foundItem = Schedule.create({ id: id, isLoaded: false});
            this.get('collection').pushObject(foundItem);
        }

        return foundItem;
    },
    */

    contentArrayContains: function(id, job, type) {
        var contains = null;

        Ember.get(type, 'collection').forEach(function(item) {
            if (item['id'] === id && item['job'] === job ) {
                contains = item;
            }
        });

        return contains;
    },

    findAll: function(job) {
        //var collection = this; 
        //console.log('JobItemModel findAll(10), collection = ' + collection );

        //wyong, 20170414
        return $.getJSON('/dashboard/article/list?job=' + job).then(function(data) {
            console.log('JobItemModel findAll(20), data=' + data);

            /*
            Ember.get(collection, 'collection').clear();
            $.each(data, function(i, row) {
                console.log('JobItemModel findAll(30), '+ i + " " +  row );
                var item = collection.contentArrayContains(row.id, row.job, collection);
                if (!item) {
                    console.log('JobItemModel findAll(40)' );
                    Ember.get(collection, 'collection').pushObject(row);
                    //row.set('isLoaded', true);
                    //row.set('isError', false);
                }
            });
            */
            return data;

        });

        //return this.get('collection');
    },

});
