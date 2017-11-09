define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"ordersPage",
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
        ordersPage:function(){
            this.preRoute(false, 'ordersPage').then(function(){
                require(['../view/ordersPage', '../model/ordersPage'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
	});
});