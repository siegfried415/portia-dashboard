import Ember from 'ember';
import { smartSelector } from '../../../../../utils/selectors';
import { RECORD_MODE } from '../../../../../services/browser';

import interactionEvent from '../../../../../utils/interaction-event';


export default Ember.Controller.extend({
    browser: Ember.inject.service(),
    dispatcher: Ember.inject.service(),
    uiState: Ember.inject.service(),
    webSocket: Ember.inject.service(),
    selectorMatcher: Ember.inject.service(),

    preventClickTwice : false,
    preventClick: false,

    recording: Ember.computed('browser.mode', function(){
        const mode = this.get('browser.mode');
        return (mode === RECORD_MODE);
    }),

    playing : false,

    project_id: Ember.computed.readOnly('uiState.models.project.id'),
    spider_id: Ember.computed.readOnly('uiState.models.spider.id'),
    currentAction: Ember.computed.readOnly('uiState.models.action'),

    currentPlayingCommandIndex : -1 , 

    disabled: Ember.computed.alias('browser.disabled'),
    document: Ember.computed.alias('browser.document'),
    loading: Ember.computed.alias('browser.loading'),
    url: Ember.computed.readOnly('browser.url'),
    
    inputTypes: [ "text", "password", "file", "datetime", "datetime-local", 
                  "date", "month", "time", "week", "number", "range", 
                  "email", "url", "search", "tel", "color" ],

    //action: Ember.computed.readOnly('uiState.models.action'),
    selectedElement: Ember.computed.readOnly('uiState.viewPort.selectedElement'),

    record(command, target, value) {
        const dispatcher = this.get('dispatcher');
        const action = this.get('uiState.models.action');
        const url = this.get('url');

        var max_ind = -1;
        action.get('commands').forEach(command => {
            if (command.get('ind') > max_ind ) { 
                max_ind = command.get('ind');
            }
        });

        dispatcher.addCommand(action, url, command, target, value, max_ind + 1, 
                              /* redirect = */ true);
    },


    makeEventByCommand(command) {

        var selector = command.get('tgt');

        var selectorMatcher = this.get('selectorMatcher');
        var elements = selector ? selectorMatcher.query(selector) : [];

        var event = {
            type : command.get('cmd'),
            target : elements[0],
        };
            
        if(event.type === 'click') {
            //get clientX and client Y from command.get('val'), 
            /*
            var coords = command.get('val').split(/,/);
            event.clientX = Number(coords[0]);
            event.clientY = Number(coords[1]);
            */

            var clientRect = elements[0].getBoundingClientRect();
            event.clientX = clientRect.left;
            event.clientY = clientRect.top;
        }
        else if (event.type === 'input') {
            event.value = event.target['value'] = command.get('val');
        } 

        return event ;
    },

    visit(url ) {
        this.set('loading', true);
        this.get('webSocket').send({
            _meta: {
                project: this.get('project'),
                spider: this.get('spider'),
            },
            _command: 'load',
            url: url,
        });
    },


    playback() {

        var commands = this.get('currentAction.orderedCommands');
        var currentPlayingCommandIndex = this.get('currentPlayingCommandIndex', -1 ) ;

        if(currentPlayingCommandIndex + 1  >= this.get('currentAction.orderedCommands.length') ) {
            this.set('playing', false);
            return;
        }

        //check if stoped by user 
        if ( this.get('playing', true ) === false ) {
            return;
        }

        var command = commands.objectAt(currentPlayingCommandIndex + 1 );
        var prevCommand = null;
        if ( currentPlayingCommandIndex >= 0 ) {
            prevCommand = commands.objectAt(currentPlayingCommandIndex);
        }

	if ( prevCommand && prevCommand.get('url') !== command.get('url')) { 
	    if ( this.get('loading') ) { 
	        Ember.run.later( () => { this.playback(); }, 1000 );
                return;
	    }
        }

        let event = this.makeEventByCommand(command);
        this.get('webSocket')._sendPromise ({
            _meta: {
                project: this.get('project_id'),
                spider: this.get('spider_id'),
            },
            _command: 'interact',
            interaction: interactionEvent(event)
        }).then(()=> {
            this.set('currentPlayingCommandIndex', currentPlayingCommandIndex + 1 ) ;
	    Ember.run.later(()=>{this.playback();}, 1000);
        });

        return;

    },

    _recordChange(event) {
        if (event.target.tagName ) {
	    var tagName = event.target.tagName.toLowerCase();
	    var type = event.target.type;
	    if ('input' === tagName && this.inputTypes.indexOf(type) >= 0) {
	        if (event.target.value.length > 0) {
		    this.record("input", smartSelector(event.target),
			    event.target.value);
	        } else {
		    this.record("input", smartSelector(event.target),
			    event.target.value);
	        }
	    } else if ('textarea' === tagName) {
	        this.record("input", smartSelector(event.target),
			event.target.value);
	    }
        }

    },

    _recordClick(event) {

        if (event.button === 0 ) {
            var top = event.pageY,
            left = event.pageX;
            var element = event.target;
            do {
                top -= element.offsetTop;
                left -= element.offsetLeft;
                element = element.offsetParent;
            } while (element);
            var selector = smartSelector(event.target);
            this.record("click", selector, left + ',' + top);
        }

    },

    actions: {
        startPlayback() {
            var commands = this.get('currentAction.orderedCommands');

            var command = commands.get('firstObject');
            if (command ) {
                this.set('playing', true);
                this.set('currentPlayingCommandIndex', -1 ) ;

                var commandUrl= command.get('url');
                if ( this.get('url') !== commandUrl ) {
                    // load url by send load command to splash server. 
                    this.visit(commandUrl);
                }
	        Ember.run.later(()=>{this.playback();}, 1000);
            }

        },

        stopPlayback() {
            this.set('playing', false);
        },

        startRecord() {
            const browser = this.get('browser');
            if ( browser.mode !== RECORD_MODE ) {
                browser.setRecordMode();
            }
        },

        stopRecord() {
            const browser = this.get('browser');
            if ( browser.mode === RECORD_MODE ) {
                browser.clearRecordMode();
            }
        },

        recordChange(event) {
            this._recordChange(event);
        },

        recordClick(event) {
            this._recordClick(event);
       },

   }

});
