
import Ember from 'ember';
import DS from 'ember-data';

const Schedule = Ember.Object.extend({
    id : '',
    project: '',
    spider : '',
    interval : 0 , 
});

export default DS.Model.extend({
    collection: Ember.A(),

    find: function(id ) {
        console.log('ScheduleModel find(10), id = ', id);
        var foundItem = this.contentArrayContains(id, this);

        if (!foundItem) {
            foundItem = Schedule.create({ id: id, isLoaded: false});
            this.get('collection').pushObject(foundItem);
        }

        return foundItem;
    },

    contentArrayContains: function(id, type) {
        var contains = null;

        Ember.get(type, 'collection').forEach(function(item) {
            if (item.get('id') === id) {
                contains = item;
            }
        });

        return contains;
    },

    findAll: function() {
        //var __this = this; 

        //wyong, 20170414
        return $.getJSON('/dashboard/schedule/list').then(function(data) {
            /*
            $.each(data, function(i, row) {
                var item = __this.contentArrayContains(row.id, __this );
                if (!item) {
                    item =  Schedule.create();
                    Ember.get(__this, 'collection').pushObject(item);
                }
                item.setProperties(row);
                item.set('isLoaded', true);
                item.set('isError', false);
            });
            */
            return data;

        });

        //return this.get('collection');
    },

});
