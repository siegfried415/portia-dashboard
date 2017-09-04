import Ember from 'ember';
//const { computed, observer } = Ember;
const { computed } = Ember;
import { task, timeout } from 'ember-concurrency';

const LIMIT = 15;
const TURN_PAGE_DEBOUNCE = 200;

//wyong, 20170414
export default Ember.Component.extend({
    isFiltering:  false,

    didReceiveAttrs() {
        //bugfix, wyong, 20170413
        const start = this.get('currentPage') * LIMIT ;

        const jobItems = this.get('sortedJobItems').slice(start, start + LIMIT);
        this.set('jobItems', jobItems);
        this.set('filteredJobItems', this.get('sortedJobItems'));
    },

    // Pagination
    currentPage: 0,
    hasPreviousPage: computed.gte('currentPage', 1),
    hasNextPage: computed('currentPage', 'filteredJobItems.length', function() {
        const max = (this.get('currentPage') + 1) * LIMIT;
        return max < this.get('filteredJobItems.length');
    }),
    pagination: computed('currentPage', 'jobItems.[]', function() {
        //wyong, 20170413
        const total = this.get('filteredJobItems.length');
        const start = (this.get('currentPage') * LIMIT) + 1;
        const end   = Math.min((this.get('currentPage') + 1) * LIMIT,
                               start + this.get('jobItems.length') - 1);
        return `( ${start}-${end}/${total} )`;
    }),

    turnPage: task(function * (offset) {
        this.set('isFiltering', true);

        yield timeout(TURN_PAGE_DEBOUNCE);

        this.set('isFiltering', false);
        const nextPage = this.get('currentPage') + offset;
        const start = nextPage * LIMIT;
        this.set('jobItems',
                 this.get('filteredJobItems').slice(start, start + LIMIT));
        this.set('currentPage', nextPage);
    }).drop(),

    /* 
    numJobItems: computed.readOnly('jobItems.length'),
    isLarge: computed.gt('jobItems.length', LIMIT),
    */

    sortedJobItems: computed.sort('all-jobItems', function(jobItem, other_jobItem) {
        const [a, b] = [jobItem, other_jobItem].map((jobItem) => {
            //wyong, 20170414
            //return jobItem.start_time;

            //wyong, 20170417
            var scrapyedTime = new Date(jobItem.time);
            return scrapyedTime.getTime();
        });

        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        }
        return 0;
    }),

    actions: {

        //wyong, 20170414
        removeJobItem(jobItem) {
            $.getJSON('/dashboard/article/del',  {
                job_item:jobItem.id
            }, function(data) {
                console.log('Your JobItem has been removed successfully', data);
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your jobItem is not removed, ", error.detail );
            });

            //todo, wyong, 20170414
            this.get('jobItems').removeObject(jobItem);
            this.get('filteredJobItems').removeObject(jobItem);
        },
    },
});
