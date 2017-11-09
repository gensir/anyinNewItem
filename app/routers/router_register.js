define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"registerPage",
			"step1":"registerStep1",
			"step2":"registerStep2",			
			"step3":"registerStep3",			
			"step4":"registerStep4",	
			"step5":"registerStep5"			
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
		registerPage:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/registerPage', '../model/registerPage'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
       },
       registerStep1:function(){
       	
       }
		
		
        
	});
});