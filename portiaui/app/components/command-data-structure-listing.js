import Ember from 'ember';

export default Ember.Component.extend({
    dispatcher: Ember.inject.service(),
    tagName: '',
    useSwap: true, 

    actions: {
        sortEndAction: function(action) {
            var index = 0 ;
            this.get('action.orderedCommands').forEach(command => {
                 command.set('ind', index ) ;
                 command.save();
                 index = index + 1 ;
            });
        },
        
        /*
        addCommand:function(action) {
            this.get('dispatcher').addCommand(action, '', '', '' , ''  );
        }
        */
    }
});
