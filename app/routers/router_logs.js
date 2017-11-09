define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"logsPage"
        },
        frameView:null,
        preRoute: function(clearMain, pageTag){
            var dtd = $.Deferred(), that = this;
            $(".datetimepicker").remove();
            if(clearMain){
                $("#main").unbind().html('');
                dtd.resolve();
            }else{
               $("#main .contents").eq(0).unbind().html('');
                require(['../view/frame'],function(View){
                    that.frameView = new View();
                    that.frameView.render('.nav_'+pageTag);
                    dtd.resolve();
                });               
            }
            return dtd.promise();
        },
        logsPage:function(){
            this.preRoute(false, 'logsPage').then(function(){
                require(['../view/logsPage', '../model/logsPage'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
	});
});