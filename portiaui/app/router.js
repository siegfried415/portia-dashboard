import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('projects', function() {
        this.route('project', {path: ":project_id"}, function() {
            this.route('spider', {path: "spiders/:spider_id"}, function() {
                this.route('sample', {path: "samples/:sample_id"}, function() {
                    this.route('data', function() {
                        this.route('annotation', {path: "annotations/:annotation_id"}, function() {
                            this.route('options');
                        });
                        this.route('item', {path: "items/:item_id"});
                    });
                });
                this.route('options');
                this.route('link-options');
                this.route('start-url', {path: "start-urls/:start_url_id"}, function() {
                    this.route('options');
                });
                this.route('action', {path:"actions/:action_id"} , function() {
                    this.route('data', function() {
                        this.route('command', {path: "commands/:command_id" });
                    });
                });
            });
            this.route('schema', {path: "schemas/:schema_id"}, function() {
                this.route('field', {path: "fields/:field_id"}, function() {
                    this.route('options');
                });
                this.route('options');
            });

            this.route('jobs', {path:'jobs'}, function() {
                this.route('job-log', {path:'job-log/:job_id'});
                this.route('job-items',{path:'job-items/:job_id'}, function() {
                    this.route('job-item', {path:'job-item/:job_item_id'});
                });
            } );
            this.route('schedule');


            this.route("conflicts", function(){
                this.route("conflict", {path: ':file_path'});
            });
            this.route('compatibility', {path: "*path"});
        });
    });
    this.route('browsers');
});

export default Router;
