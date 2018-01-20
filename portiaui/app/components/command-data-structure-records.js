import Ember from 'ember';

export default Ember.Component.extend({
    dispatcher: Ember.inject.service(),
    uiState: Ember.inject.service(),

    actions: {
        removeCommand(command) {
            this.get('dispatcher').removeCommand(command);
        },

        saveCommand(command) {
            command.save();
        }
    }
});
