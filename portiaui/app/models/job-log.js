
import DS from 'ember-data';
export default DS.Model.extend({

    findAll: function(project_id, spider_id, job_id) {
        var url = '/dashboard/job/log?project=' + project_id ;
        url += '&spider=' + spider_id;
        url += '&job=' + job_id ;

        return $.getJSON(url).then( function(data) {
            /*
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
