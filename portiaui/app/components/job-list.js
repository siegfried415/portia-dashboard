import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
    selectedItems : Ember.A(),

    finishedColumns :  
      [ 
	 {
	    "component": "ember-models-table-select-row-checkbox",
	    "useFilter": false,
	    "mayBeHidden": false,
	    "componentForSortCell": "ember-models-table-select-all-rows-checkbox"
	 },

	 {  
	    "propertyName": "id"
	 },

	 {  
	    "propertyName": "index",
	    "sortPrecedence" : 1 ,
	    "sortDirection" : "desc" ,
	    "isHidden" : "true"
	 },

	 {  
	    "propertyName": "spider",
	     "filterWithSelect": true,
	 },

	 {  
	    "propertyName": "start_time",
	 },

	 {  
	    "propertyName": "end_time"
	 },

	 {  
	    "title": "items", 
	    "propertyName": "items_display_name",
	    "routeName":"projects.project.jobs.job-items"
	 },
	 {
	    "title": "log",
	    "propertyName": "log_display_name",
	    "routeName":"projects.project.jobs.job-log"
	 },

	 {
	     "title":"warnning",
	     "propertyName": "warning_count",
	     "filterWithSelect": true,
	 },
	 {
	     "title":"error", 
	     "propertyName": "error_count", 
	     "filterWithSelect": true,
	 },
	 {
	     "title" : "critical",
	     "propertyName": "critical_count", 
	     "filterWithSelect": true,
	 },

	 {
	     "title":"delete",
	     "component":"ember-models-table-delete-row"
	 }
       ],


    pendingOrRunningColumns : 
       [ 
	 {
	    "component": "ember-models-table-select-row-checkbox",
	    "useFilter": false,
	    "mayBeHidden": false,
	    "componentForSortCell": "ember-models-table-select-all-rows-checkbox"
	 },

	 {
	    "propertyName": "id"
	 },

	 {  
	    "propertyName": "index",
	    "sortPrecedence" : 1 ,
	    "sortDirection" : "desc",
	    "isHidden" : "true"
	 },

	 {"propertyName": "spider"},
	 {
	    "propertyName": "start_time",
	 },

	 {"propertyName": "end_time"},

	 {  
	    "title": "items", 
	    "propertyName": "items_display_name",
	    "routeName":"projects.project.jobs.job-items"
	 },
	 {
	    "title": "log",
	    "propertyName": "log_display_name",
	    "routeName":"projects.project.jobs.job-log"
	 },

	 {
	     "title":"cancel",
	     "component":"ember-models-table-cancel-row"
	 },

	 {
	     "title":"delete",
	     "component":"ember-models-table-delete-row"
	 }
       ],


    pageSizeValues : [5, 10, 25, 50 ] , 
    pendingJobs: computed('jobs', 'jobs.@each.type',  function() {
        return this.get('jobs').filter(function(job) { return job.type === 'pending'; });
    }),

    runningJobs: computed('jobs','jobs.@each.type',  function() {
        return this.get('jobs').filter(function(job) { return job.type === 'running'; });
    }),

    finishedJobs: computed('jobs', 'jobs.@each.type', function() {
        return this.get('jobs').filter(function(job) { return job.type === 'finished'; });
    }),

    actions: {
        cancelJob(job) {
            $.getJSON('/dashboard/job/cancel',  {
                project: job.project,
                job:job.id
            }, function(data) {
                console.log('Your Job has been canceled successfully', data);
                this.get('jobs').removeObject(job);
                this.get('filteredJobs').removeObject(job);
                this.triggerChange();
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your job is not canceled, ", error.detail );
            });
        },

        deleteJob(job ) {
            var __this = this;

            $.getJSON('/dashboard/job/delete',  {
                project: job.project,
                job:job.id
            }, function(data) {
                console.log('Your job has been removed successfully', data);
                //this.get('jobs').removeObject(job);
                Ember.get(__this, 'jobs').removeObject(job);

                //this.get('filteredJobs').removeObject(job);
                //this.triggerChange();
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your job is not removed, ", error.detail );
            });
        },

        deleteSelectedJobs(selectedJobs) {
            var __this = this;

            $.each( this.get('selectedItems'), function(i, job ){
                $.getJSON('/dashboard/job/delete',  {
                    project: job.project,
                    job:job.id
                }, function(data) {
                    console.log('Your job has been removed successfully', data);
                    Ember.get(__this, 'jobs').removeObject(job);
                }, data => {
                    let error = data.errors[0];
                    if (error.status > 499) {
                        throw data;
                    }
                    console.log("Your job is not removed, ", error.detail );
                });
            });
        },

        displayDataChanged(data) {
            this.get('selectedItems').clear();
            var __this = this;

            $.each(data.selectedItems, function(i, item){
                Ember.get(__this, 'selectedItems').pushObject(item);
            });
        },

    },
});
