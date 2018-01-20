import Ember from 'ember';

export default Ember.Controller.extend({
    browser: Ember.inject.service(),

    queryParams: ['url', 'baseurl'],

    url: Ember.computed.alias('browser.url'),
    baseurl: Ember.computed.alias('browser.baseurl'),
    clickHandler: null,

    setClickHandler(fn) {
        this.clickHandler = fn;
    },

    clearClickHandler() {
        this.clickHandler = null;
    },

    /*
    setInputHandler(fn) {
        this.inputHandler = fn;
    },

    clearInputHandler() {
        this.inputHandler = null;
    },
    */

    setChangeHandler(fn) {
        this.changeHandler = fn;
    },

    clearChangeHandler() {
        this.changeHandler = null;
    },

    actions: {
        viewPortClick() {
            if (this.clickHandler) {
                this.clickHandler(...arguments);
            }
        },

        /*
        viewPortInput() {
            if (this.inputHandler) {
                this.inputHandler(...arguments);
            }
        },
        */

        viewPortChange() {
            if (this.changeHandler) {
                this.changeHandler(...arguments);
            }
        }
    }
});
