define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"registerPage_step1",
			"step1":"registerPage_step1",
			"step2":"registerPage_step2",			
			"step3":"registerPage_step3",			
			"step4":"registerPage_step4",	
			"step5":"registerPage_step5"	
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
		registerPage_step1:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/register/step1', '../model/register/step1'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render('step1');
                });
            });
       },
       registerPage_step2:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/register/step2', '../model/register/step2'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render('step2');
                });
            });       	
       },
       registerPage_step3:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/register/step3', '../model/register/step3'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render('step3');
                });
            });       	
       },		
       registerPage_step4:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/register/step4', '../model/register/step4'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render('step4');
                });
            });       	
       },		
       registerPage_step5:function(){
            var debugLogin = false;
            this.preRoute(true,'registerPage').then(function(){
                require(['../view/register/step5', '../model/register/step5'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render('step5');
                });
            });       	
       }    
       
	});
});