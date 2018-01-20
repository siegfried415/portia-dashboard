import Ember from 'ember';

export default Ember.Component.extend({

    selectedItems : Ember.A(),
    columns :  
      [ 
	 {
	    "component": "ember-models-table-select-row-checkbox",
	    "useFilter": false,
	    "mayBeHidden": false,
	    "componentForSortCell": "ember-models-table-select-all-rows-checkbox"
	 },

	 {  
	    "title" : "Id",
	    "propertyName": "id"
	 },

	 {  
	    "title" : "Spider",
	    "propertyName": "spider"
	 },

	 {  
	    "title" : "Start time",
	    "propertyName": "start_time",
	    "sortPrecedence" : 1 ,
	    "sortDirection" : "desc"
	 },

	 {  
	    "title" : "Update time",
	    "propertyName": "update_time"
	 },

	 {  
	    "title" : "Interval",
	    "propertyName": "interval"
	 },

	 {  
	    "title" : "Times",
	    "propertyName": "times"
	 },

	 {
	     "title":"Delete",
	     "component":"ember-models-table-delete-row"
	 }
       ],

    //pageSizeValues : [5, 10, 25, 50 ] , 

    actions: {
        removeSchedule(schedule) {
            var __this = this;

            $.getJSON('/dashboard/schedule/del',  {
                id:schedule.id
            }, function(data) {
                console.log('Your Schedule has been removed successfully', data);
                Ember.get(__this, 'schedules').removeObject(schedule);
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your schedule is not removed, ", error.detail );
            });

        },

        deleteSelectedSchedules(selectedSchedules) {
            var __this = this;

            $.each( this.get('selectedItems'), function(i, schedule ){
                $.getJSON('/dashboard/schedule/del',  {
                    id:schedule.id
                }, function(data) {
                    console.log('Your schedule has been removed successfully', data);
                    Ember.get(__this, 'schedules').removeObject(schedule);
                }, data => {
                    let error = data.errors[0];
                    if (error.status > 499) {
                        throw data;
                    }
                    console.log("Your schedule is not removed, ", error.detail );
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
