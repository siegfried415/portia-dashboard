import Ember from 'ember';
//import DS from 'ember-data';
import JobModel from '../../../models/jobs';

const Pollster = Ember.Object.extend({
  interval: function() {
    //just for test, wyong, 20170411
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
        console.log('>>>>>>>>>>>>>>>>>>>>>>> model>>>>>>>>>>>>>>>>>>>>>>>>>');
        /*
        var projectModel = this.modelFor('projects.project');
        this.set('projectId', projectModel.get("id"));
        var spiderModel = this.modelFor('projects.project.spider');
        */
 
        //wyong, 20170906
        //var model = new JobModel();
        var model = this.store.createRecord('jobs');

        //wyong, 20170414
        return model.findAll(this.get('projectId') );
    },

    projectId:function(){
        var projectModel = this.modelFor('projects.project');
        return projectModel.get("id");
    }.property().readOnly(),

    /* wyong, 20170419
    spiderId:function(){
        var spiderModel = this.modelFor('projects.project.spider');
        //wyong, 20170414
        if(Ember.isNone(spiderModel)) {
            return '';
        }
        return spiderModel.get("id");
    }.property().readOnly(),
    */

    renderTemplate() {
        this.render('projects/project/jobs', {
            into: 'application',
            outlet: 'main'
        });
    },

    setupController (controller, model) {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>> setupController >>>>>>>>>>>>>>>>>>>>>>>');
        console.log('controller =' , controller);
        console.log('model = ',  model );
        var __this = this;
        if (Ember.isNone(this.get('pollster'))) {
            this.set('pollster', Pollster.create({
                onPoll: function() {
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>onPoll>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

                    //wyong, 20170906
                    //var jobModel = new JobModel();
                    var jobModel = Ember.get(__this, 'store').createRecord('jobs');
                   
                    //wyong, 20170412
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
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>deactivate>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        this.get('pollster').stop();
    }

});
