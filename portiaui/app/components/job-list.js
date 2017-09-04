import Ember from 'ember';
//const { computed, observer } = Ember;
const { computed } = Ember;
import { task, timeout } from 'ember-concurrency';

const LIMIT = 5;
const TURN_PAGE_DEBOUNCE = 200;

//wyong, 20170412
export default Ember.Component.extend({
    /*
    browser: Ember.inject.service(),
    dispatcher: Ember.inject.service(),
    notificationManager: Ember.inject.service(),
    routing: Ember.inject.service('-routing'),
    savingNotification: Ember.inject.service(),
    uiState: Ember.inject.service(),

    tagName:      '',
    jobSearch: '',
    */

    isFiltering:  false,

    didReceiveAttrs() {
        //bugfix, wyong, 20170413
        const start = this.get('currentPage') * LIMIT ;

        const jobs = this.get('sortedJobs').slice(start, start + LIMIT);
        this.set('jobs', jobs);
        this.set('filteredJobs', this.get('sortedJobs'));
    },

    // Pagination
    currentPage: 0,
    hasPreviousPage: computed.gte('currentPage', 1),
    hasNextPage: computed('currentPage', 'filteredJobs.length', function() {
        const max = (this.get('currentPage') + 1) * LIMIT;
        return max < this.get('filteredJobs.length');
    }),
    pagination: computed('currentPage', 'jobs.[]', function() {
        //wyong, 20170413
        const total = this.get('filteredJobs.length');
        const start = (this.get('currentPage') * LIMIT) + 1;
        const end   = Math.min((this.get('currentPage') + 1) * LIMIT,
                               start + this.get('jobs.length') - 1);
        return `( ${start}-${end}/${total} )`;
    }),

    turnPage: task(function * (offset) {
        this.set('isFiltering', true);

        yield timeout(TURN_PAGE_DEBOUNCE);

        this.set('isFiltering', false);
        const nextPage = this.get('currentPage') + offset;
        const start = nextPage * LIMIT;
        this.set('jobs',
                 this.get('filteredJobs').slice(start, start + LIMIT));
        this.set('currentPage', nextPage);
    }).drop(),

    /* 
    numJobs: computed.readOnly('jobs.length'),
    isLarge: computed.gt('jobs.length', LIMIT),
    */

    sortedJobs: computed.sort('all-jobs', function(job, other_job) {
        const [a, b] = [job, other_job].map((job) => {
            //wyong, 20170413
            //return job.get('id').toLowerCase();
            var startTime = new Date(job.start_time);
            return startTime.getTime();
        });

        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        }
        return 0;
    }),

    actions: {
        cancelJob(job) {
            /*
            this.get('dispatcher').removeJob(job);
            */

            //wyong, 20170413
            $.getJSON('/dashboard/job/cancel',  {
                project: job.project,
                job:job.id
            }, function(data) {
                console.log('Your Job has been removed successfully', data);
                this.get('jobs').removeObject(job);
                this.get('filteredJobs').removeObject(job);
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your schedule is not removed, ", error.detail );
            });
        },
    },
});
