import DS from 'ember-data';
import BaseModel from './base';

const Command = BaseModel.extend({
    url : DS.attr('string'),
    cmd : DS.attr('string'),
    tgt : DS.attr('string'),
    val : DS.attr('string'),
    ind : DS.attr('number', {
        defaultValue: 0
    }),

    action : DS.belongsTo(),

});

export default Command;
