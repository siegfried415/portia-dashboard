import Ember from 'ember';
import layout from '../templates/components/ember-models-table-cancel-row';

export default Ember.Component.extend({
  layout,
  actions: {
    sendAction(actionName, record, event) {
      Ember.get(this, 'sendAction')(actionName, record);
      event.stopPropagation();
    }
  }

});

