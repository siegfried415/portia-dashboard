import Ember from 'ember';
const { inject: { service } } = Ember;
//const { inject: { service }, computed } = Ember;

export default Ember.Component.extend({
    suggester: service(),

    //numItems: computed.readOnly('extractedItems.items.length'),
    //isExtracting: computed.alias('extractedItems.isExtracting')
});
