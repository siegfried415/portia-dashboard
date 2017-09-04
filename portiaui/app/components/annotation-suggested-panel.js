import Ember from 'ember';
//const { inject: { service }, computed, observer } = Ember;

export default Ember.Component.extend({
    tagName: '',
    suggester: Ember.inject.service(),
    uiState: Ember.inject.service(),
    dispatcher: Ember.inject.service(),

    /*
    updateTitleElementId: Ember.observer('suggester.titleElementId', function() {
        this.set('titleElementId', this.get('suggester.titleElementId'));
    } ),
    */

    //wyong, 20170502
    //titleElementId: Ember.computed.readOnly('suggester.titleElementId'),
    //dateElementId: Ember.computed.readOnly('suggester.dateElementId'),
    //tagsElementId: Ember.computed.readOnly('suggester.tagsElementId'),
    //mainBodyElementId: Ember.computed.readOnly('suggester.mainBodyElementId'),
    suggests : Ember.computed.readOnly('suggester.annotationSuggested'),

    //wyong, 20170503
    suggestColors:[], 

    //failedMsg: computed.readOnly('extractedItems.failedExtractionMsg'),
    //failedExtraction: computed.readOnly('extractedItems.failedExtraction')
    
    //wyong, 20170502
    actions: {
        enterSuggest(suggest) {
            this.set('uiState.annotationSuggested.hoveredSuggest', suggest);
        },

        leaveSuggest() {
            this.set('uiState.annotationSuggested.hoveredSuggest', '' );
        },

        acceptSuggest(suggest) {
	    console.log("annotation-suggested-panel, acceptSuggest, suggest.name = " + suggest.name);
	    //wyong, 20170504
	    this.get('dispatcher').addAnnotation( null, /* auto item */
		suggest.element, 
		'content', /* attribute */
		false,  /* redirect = */ 
		suggest.name /* field name */
	    );
        },
    }

});
