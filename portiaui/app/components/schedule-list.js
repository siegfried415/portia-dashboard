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

        const schedules = this.get('sortedSchedules').slice(start, start + LIMIT);
        this.set('schedules', schedules);
        this.set('filteredSchedules', this.get('sortedSchedules'));
    },

    // Pagination
    currentPage: 0,
    hasPreviousPage: computed.gte('currentPage', 1),
    hasNextPage: computed('currentPage', 'filteredSchedules.length', function() {
        const max = (this.get('currentPage') + 1) * LIMIT;
        return max < this.get('filteredSchedules.length');
    }),
    pagination: computed('currentPage', 'schedules.[]', function() {
        //wyong, 20170413
        const total = this.get('filteredSchedules.length');
        const start = (this.get('currentPage') * LIMIT) + 1;
        const end   = Math.min((this.get('currentPage') + 1) * LIMIT,
                               start + this.get('schedules.length') - 1);
        return `( ${start}-${end}/${total} )`;
    }),

    turnPage: task(function * (offset) {
        this.set('isFiltering', true);

        yield timeout(TURN_PAGE_DEBOUNCE);

        this.set('isFiltering', false);
        const nextPage = this.get('currentPage') + offset;
        const start = nextPage * LIMIT;
        this.set('schedules',
                 this.get('filteredSchedules').slice(start, start + LIMIT));
        this.set('currentPage', nextPage);
    }).drop(),

    /* 
    numSchedules: computed.readOnly('schedules.length'),
    isLarge: computed.gt('schedules.length', LIMIT),
    */

    sortedSchedules: computed.sort('all-schedules', function(schedule, other_schedule) {
        const [a, b] = [schedule, other_schedule].map((schedule) => {
            //wyong, 20170414
            //return schedule.start_time;

            //wyong, 20170417
            var startTime = new Date(schedule.start_time);
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

        //wyong, 20170414
        removeSchedule(schedule) {
            $.getJSON('/dashboard/schedule/del',  {
                id:schedule.id
            }, function(data) {
                console.log('Your Schedule has been removed successfully', data);
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your schedule is not removed, ", error.detail );
            });

            //todo, wyong, 20170414
            this.get('schedules').removeObject(schedule);
            this.get('filteredSchedules').removeObject(schedule);
        },
    },
});
