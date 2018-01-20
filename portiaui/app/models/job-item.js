
import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    collection: Ember.A(),

    contentArrayContains: function(id, job, type) {
        var contains = null;

        Ember.get(type, 'collection').forEach(function(item) {
            if (item['id'] === id && item['job'] === job ) {
                contains = item;
            }
        });

        return contains;
    },

    findAll: function( job_item_id ) {

        return $.getJSON('/dashboard/article/detail?job_item=' + job_item_id ).then(function(data) {
            /*
            Ember.get(collection, 'collection').clear();
            $.each(data, function(i, row) {
                var item = collection.contentArrayContains(row.id, row.job, collection);
                if (!item) {
                    Ember.get(collection, 'collection').pushObject(row);
                    //row.set('isLoaded', true);
                    //row.set('isError', false);
                }
            });
            */
            return data;

        });

    },

});
