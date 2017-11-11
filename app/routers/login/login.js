define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"login"
        },
        frameView:null,
        preRoute: function(clearMain, pageTag){
            var dtd = $.Deferred(), that = this;
            if(clearMain){
                $("#main").unbind().html('');
                dtd.resolve();
            } else {
                $("#main .contents").eq(0).unbind().html('');
                require(['../../view/pub/frame'],function(View){
                    that.frameView = new View();
                    that.frameView.render('.nav_'+pageTag);
                    dtd.resolve();
                });          
            }
            return dtd.promise();
        },
		login:function(){
            var debugLogin = false;
            this.preRoute(true,'login').then(function(){
                require(['../../view/login/login', '../../model/login/login'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
        
	});
});