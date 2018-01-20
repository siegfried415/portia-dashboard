
import Ember from 'ember';
//import {get} from '@ember/object';
import layout from '../templates/components/ember-models-table-select-all-rows-checkbox';

//import EmberModelsTableExt from './ember-models-table-ext'
//export default EmberModelsTableExt.extend({

export default Ember.Component.extend({
  layout,

  actions: {
    toggleAllSelection() {
      Ember.get(this, 'toggleAllSelection')();
    }
  }
});

