import Ember from 'ember';
//import JobModel from '../../../models/jobs';

const Pollster = Ember.Object.extend({
  interval: function() {
    return 5000; // Time between polls (in ms)
  }.property().readOnly(),

  // Schedules the function `f` to be executed every `interval` time.
  schedule: function(f) {
    return Ember.run.later(this, function() {
      f.apply(this);
      this.set('timer', this.schedule(f));
    }, this.get('interval'));
  },

  // Stops the pollster
  stop: function() {
    Ember.run.cancel(this.get('timer'));
  },

  // Starts the pollster, i.e. executes the `onPoll` function every interval.
  start: function() {
    this.set('timer', this.schedule(this.get('onPoll')));
  },

  onPoll: function(){
    // Issue JSON request and add data to the store
  }
});

export default Ember.Route.extend({
    model: function() {
        var model = this.store.createRecord('jobs');
        return model.findAll(this.get('projectId') );
    },

    projectId:function(){
        var projectModel = this.modelFor('projects.project');
        return projectModel.get("id");
    }.property().readOnly(),

    renderTemplate() {
        this.render('projects/project/jobs', {
            into: 'application',
            outlet: 'main'
        });
    },

    setupController (controller, model) {
        var __this = this;
        if (Ember.isNone(this.get('pollster'))) {
            this.set('pollster', Pollster.create({
                onPoll: function() {
                    var jobModel = Ember.get(__this, 'store').createRecord('jobs');
                    jobModel.findAll(Ember.get(__this, 'projectId')).then(function(jobs){
                        controller.set('model', jobs ) ;
                    });
                }
            }));
        }
        
        //set controller's model with model, for the first time
        controller.set('model', model);

        this.get('pollster').start();
    },

    // This is called upon exiting the Route
    deactivate () {
        this.get('pollster').stop();
    }

});
