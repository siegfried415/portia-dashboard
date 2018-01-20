import Ember from 'ember';

export default Ember.Service.extend({
    ajax: Ember.inject.service(),
    runningJobs:[],

    fetchJobs: Ember.on('init', function() {
        this.get('ajax').request('/jobs' ).then( jobs => {
            this.set('runningJobs', jobs.data.running);
        }, () => {
            Ember.run.later(this, this.fetchJobs, 5000);
        });
    })
});
