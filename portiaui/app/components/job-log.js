import Ember from 'ember';

export default Ember.Component.extend({
    selectedItems : Ember.A(),
    columns: 
      [ 
	 {
	    "title": "Index",
	    "propertyName": "index",
	    "sortPrecedence" : 1 ,
	    "sortDirection" : "asc",
	    "isHidden" : "true"
	 },

	 {  
	    "title": "Date",
	    "propertyName": "date",
	 },

	 {  
	    "title": "Source",
	    "propertyName": "source",
	    "filterWithSelect": true
	 },

	 {  
	    "title": "Level",
	    "propertyName": "level",
	    "filterWithSelect": true,
	    "predefinedFilterOptions": [
		"INFO", 
		"DEBUG",
		"WARNING",
		"ERROR",
		"CRITICAL"
	    ]
	 },

	 {  
	    "title": "Text",
	    "propertyName": "text"
	 },

     ],

});
