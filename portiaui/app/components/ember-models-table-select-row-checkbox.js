
import Ember from 'ember';
//import {get} from '@ember/object';
import layout from '../templates/components/ember-models-table-select-row-checkbox';

export default Ember.Component.extend({
  layout,
  actions: {
    clickOnRow(index, record, event) {
      Ember.get(this, 'clickOnRow')(index, record);
      event.stopPropagation();
    }
  }
});

