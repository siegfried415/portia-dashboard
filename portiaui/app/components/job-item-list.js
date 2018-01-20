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
	    "title": "Id",
	    "propertyName": "id"
	 },

	 {  
	    "title": "Item",
	    "propertyName": "item-display-name",
	    "routeName":"projects.project.jobs.job-items.job-item"
	 },

	 {  
	    "title": "Spider",
	    "propertyName": "spider"
	 },

	 {  
	    "title": "Url",
	    "propertyName": "url"
	 },

	 {  
	    "title": "Scraped time",
	    "propertyName": "time",
	    "sortPrecedence" : 1 ,
	    "sortDirection" : "desc"
	 },

	 {
	     "title":"Delete",
	     "component":"ember-models-table-delete-row"
	 }
       ],

    actions: {
        removeJobItem(jobItem) {
            var __this = this;
            $.getJSON('/dashboard/article/del',  {
                job_item:jobItem.id
            }, function(data) {
                console.log('Your job item has been removed successfully', data);
                Ember.get(__this, 'jobItems').removeObject(jobItem);
            }, data => {
                let error = data.errors[0];
                if (error.status > 499) {
                    throw data;
                }
                console.log("Your job item is not removed, ", error.detail );
            });

        },

        deleteSelectedJobItems(selectedJobItems) {
            var __this = this;

            $.each( this.get('selectedItems'), function(i, jobItem ){
                $.getJSON('/dashboard/article/delete',  {
                    job_item:jobItem.id
                }, function(data) {
                    console.log('Your job item has been removed successfully', data);
                    Ember.get(__this, 'jobItems').removeObject(jobItem);
                }, data => {
                    let error = data.errors[0];
                    if (error.status > 499) {
                        throw data;
                    }
                    console.log("Your job item is not removed, ", error.detail );
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
