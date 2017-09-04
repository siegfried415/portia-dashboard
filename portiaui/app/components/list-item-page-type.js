
import Ember from 'ember';
import ensurePromise from '../utils/ensure-promise';

export default Ember.Component.extend({
    tagName: '',

    sample: null,

    types: ['item', 'links'],

    actions: {
        savePageType() {
            const sample = this.get('sample');
            ensurePromise(sample).then(sample=> {
                if (!!sample) {
                    sample.save();
                }
            });
        }
    }
});
