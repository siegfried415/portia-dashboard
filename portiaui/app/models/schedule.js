
import Ember from 'ember';
import DS from 'ember-data';

const Schedule = Ember.Object.extend({
    id : '',
    project: '',
    spider : '',
    start_time : '',
    update_time : '',
    interval : 0 , 
    times: 0 , 
});

export default DS.Model.extend({
    collection: Ember.A(),

    find: function(id ) {
        var foundItem = this.contentArrayContains(id );

        if (!foundItem) {
            foundItem = Schedule.create({ id: id, isLoaded: false});
            this.get('collection').pushObject(foundItem);
        }

        return foundItem;
    },

    contentArrayContains: function(id ) {
        var contains = null;

        this.collection.forEach(function(item) {
            if (item.get('id') === id) {
                contains = item;
            }
        });

        return contains;
    },

    findAll: function() {
        var url = '/dashboard/schedule/list';
        var __this = this;

        return $.getJSON(url).then(function(data) {
            $.each(data, function(i, row) {
                var item = __this.contentArrayContains(row.id, __this );
                if (!item) {
                    item =  Schedule.create();
                    item.setProperties(row);
                    Ember.get(__this, 'collection').pushObject(item);
                }
            });

            return Ember.get(__this,'collection');

        });

    },

});
