import Ember from 'ember';
import DS from 'ember-data';
import BaseModel from './base';

const Action = BaseModel.extend({
    name: DS.attr('string'),
    url: DS.attr('string'),
    spider: DS.belongsTo(),

    commands: DS.hasMany(),

    orderedCommands : Ember.computed('commands.@each.ind', function () {
        return this.get('commands').sortBy('ind');
    }),

    /*
    orderedCommands : Ember.computed.sort('commands.@each.ind', function (cmd1, cmd2) {
        var ind1 = cmd1.get('ind');
        var ind2 = cmd2.get('ind'); 
        if ( ind1 > ind2 ) {
            return 1;
        }else if ( ind1 < ind2) {
            return -1 ;
        }
        return 0;
    }),
    */

    /*
    body: DS.attr('string', {
        default: 'original_body'
    }),

    orderedActions: Ember.computed('items.content.@each.orderedAnnotations', function() {
        return [].concat(...this.get('items').mapBy('orderedAnnotations'));
    }),
    orderedChildren: Ember.computed('items.content.@each.orderedChildren', function() {
        return [].concat(...this.get('items').map(item => [item].concat(
            item.getWithDefault('orderedChildren', []))));
    })
    */
});

Action.reopenClass({
    normalizeTitle(title) {
        return title
            .trim()
            .replace(/[^a-z\s_-]/ig, '')
            .substring(0, 48)
            .trim()
            .replace(/\s+/g, ' ');
    }
});

export default Action;
