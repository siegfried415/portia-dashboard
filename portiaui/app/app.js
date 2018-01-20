import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

//for debug
//Ember.run.backburner.DEBUG            = true;
//Ember.ENV.RAISE_ON_DEPRECATION        = true;
//Ember.LOG_STACKTRACE_ON_DEPRECATION   = true;
//Ember.LOG_BINDINGS                    = true;


App = Ember.Application.extend({
    modulePrefix: config.modulePrefix,
    podModulePrefix: config.podModulePrefix,
    Resolver,

    //for debug
    //LOG_TRANSITIONS: true, 
    //LOG_TRANSITIONS_INTERNAL:  true,
    //LOG_ACTIVE_GENERATION:     true,
    //LOG_VIEW_LOOKUPS:          true,
    //LOG_RESOLVER:              true,

    customEvents: {
        transitionend: 'transitionEnd'
    }
});

loadInitializers(App, config.modulePrefix);

export default App;
