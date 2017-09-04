import Ember from 'ember';

export default Ember.Service.extend({
    ajax: Ember.inject.service(),
    runningJobs:[],

    fetchJobs: Ember.on('init', function() {
        this.get('ajax').request('/jobs' ).then( jobs => {
            console.log("fetchJobs result=", jobs);
            this.set('runningJobs', jobs.data.running);
            console.log("fetchJobs result=", this.get('runningJobs'));
        }, () => {
            Ember.run.later(this, this.fetchJobs, 5000);
        });
    })
});
