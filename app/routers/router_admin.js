define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"adminPage",
//			"": "orderList",
//          "login":"login",
//          "open_login":"openLogin",
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
        adminPage:function(){
            this.preRoute(false, 'adminPage').then(function(){
                require(['../view/adminPage', '../model/adminPage'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
	});
});