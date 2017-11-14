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
                require(['../../view/admin/step1', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step2:function(){
            this.preRoute(false, 'step2').then(function(){
                require(['../../view/admin/step2', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step3:function(){
            this.preRoute(false, 'step3').then(function(){
                require(['../../view/admin/step3', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step4:function(){
            this.preRoute(false, 'step4').then(function(){
                require(['../../view/admin/step4', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        pay_ok:function(){
            this.preRoute(false, 'pay_ok').then(function(){
                require(['../../view/admin/pay_ok', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        renew:function(){
            this.preRoute(false, 'renew').then(function(){
                require(['../../view/admin/renew', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        update_key:function(){
            this.preRoute(false, 'update_key').then(function(){
                require(['../../view/admin/update_key', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        }
	});
});