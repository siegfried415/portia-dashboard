import Ember from 'ember';
import Article from './VIPS/Article';


const Suggest = Ember.Object.extend({
    id : '',
    type : '', 
    element: '',
    content: ''
});

export default Ember.Service.extend({
    //uiState: Ember.inject.service(),

    annotationType : '',
    annotationSuggested : [],

    browser : Ember.inject.service(),
    document : Ember.computed.alias('browser.document'),

    init() {
        this._super();
    },

    _createSuggest(id, name,  element, type ) {
	 var suggest = Suggest.create();
         suggest.set('id', id );
         suggest.set('name', name );
	 suggest.set('element', element);
	 suggest.set('type', type ) ;
	 return suggest;
    },


    _clearSuggest() {
         this.annotationSuggested = [];
    },

    _appendSuggest(suggest) {
	 this.annotationSuggested.pushObject(suggest);
    },
    
    getLinksAnnotationSuggested() {
	var article = new Article(this.get('document'));
	article.parse_links();

	if(article.getMainLinksBlock() != null) {
	    this._appendSuggest( this._createSuggest(0, 'links', 
				    article.getMainLinksElement(), 'raw html' )) ;
	}

	this.set('annotationType' , 'links');

    },

    getItemAnnotationSuggested() {
	var article = new Article(this.get('document'));
	article.parse_item();

	var index = 0;
	if (article.getTitleBlock() != null ){
	    this._appendSuggest(this._createSuggest(index , 'title', 
				    article.getTitleElement(), 'text' ));
	    index = index + 1;
        }

	if (article.getDateBlock() != null ){
	    this._appendSuggest (this._createSuggest(index, 'date', 
				    article.getDateElement(), 'date' )); 
	    index = index + 1;
	}
	if (article.getTagsBlock() != null ){
	    this._appendSuggest(this._createSuggest(index, 'tags' , 
				    article.getTagsElement(), 'text' ));
	    index = index + 1;
	}

	if (article.getMainBodyBlock() != null ){
	    this._appendSuggest (this._createSuggest(index, 'body', 
				    article.getMainBodyElement(), 'safe html' ));
	}

        this.set('annotationType' , 'article');
    },

});
