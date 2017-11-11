define(function(require, exports, module) {
	"use strict";

	// External dependencies.
	var Backbone = require("backbone");

	// Defining the application router.
	module.exports = Backbone.Router.extend({
		routes: {
            "":"admin",
            "step1": "step1",
            "step2": "step2",
            "step3": "step3",
            "step4": "step4",
            "pay_ok": "pay_ok",
            "update_key": "update_key"
        },
        frameView:null,
        preRoute: function(clearMain, pageTag){
            var dtd = $.Deferred(), that = this;
            $(".datetimepicker").remove();
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
        admin:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/admin', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step1:function(){
            this.preRoute(false, 'step1').then(function(){
                require(['../view/orders/step1', '../../model/orders/step1'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step2:function(){
            this.preRoute(false, 'step2').then(function(){
                require(['../../view/orders/step2', '../../../model/orders/step2'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step3:function(){
            this.preRoute(false, 'step3').then(function(){
                require(['../../view/orders/step3', '../../model/orders/step3'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step4:function(){
            this.preRoute(false, 'step4').then(function(){
                require(['../../view/orders/step4', '../../model/orders/step4'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        pay_ok:function(){
            this.preRoute(false, 'pay_ok').then(function(){
                require(['../../view/orders/pay_ok', '../../model/orders/pay_ok'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        renew:function(){
            this.preRoute(false, 'renew').then(function(){
                require(['../../view/orders/renew', '../../model/orders/renew'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        update_key:function(){
            this.preRoute(false, 'update_key').then(function(){
                require(['../../view/orders/update_key', '../../model/orders/update_key'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
	});
});