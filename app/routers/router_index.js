define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
		    "":"indexPage",
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
        indexPage:function(){
            this.preRoute(false, 'indexPage').then(function(){
                require(['../view/indexPage', '../model/indexPage'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
//		loginPage:function(){
//          var debugLogin = false;
//          this.preRoute(true,'loginPage').then(function(){
//              require(['./view/login'],function(View){
//                  var view = new View({debugLogin: debugLogin});
//                  view.render();
//              });
//          });
//      },
//      openLogin:function(){
//          var debugLogin = true;
//          this.preRoute(true).then(function(){
//              require(['./view/login'],function(View){
//                  var view = new View({debugLogin: debugLogin});
//                  view.render();
//              });
//          });
//      },
//      orderList:function(){
//          this.preRoute(false, 'order_list').then(function(){
//              require(['./view/orderList', './model/orderList'],function(View, Model){
//                  var view = new View({model: new Model()});
//                  view.render();
//              });
//          });
//      },
//      detail:function(orderId,type){
//          this.preRoute(false, 'order_list').then(function(){
//              require(['./view/orderDetail'],function(View){
//                  var view = new View();
//                  view.render(orderId,type);
//              });
//          });
//      },
//      review:function(orderId, applyType){
//          this.preRoute(false, 'order_list').then(function(){
//              require(['./view/review'],function(View){
//	                var view = new View();
//	                view.render({orderId:orderId, applyType:applyType});
//	            });
//          });
//      }
	});
});