define(function(require, exports, module) {
	"use strict";
	var stepNum;
	var service = require('../../../app/lib/service');


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
            "renew?:query": "renew",
            "pay_ok?:query": "pay_ok",
            "update_key?:query": "update_key"
        },
        frameView:null,
        preRoute: function(clearMain, pageTag){
        	if(!/#license|#renew|#update_key|#pay_ok/.test(location.hash)){
	            this.hashChange();
	        }
            var dtd = $.Deferred(), that = this;
            $(".datetimepicker").remove();
            $("#main").unbind().html('');
            dtd.resolve();
            if (!clearMain) {
                require(['../../view/pub/frame'], function(View) {
                    that.frameView = new View();
                    that.frameView.render('.nav_' + pageTag);
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
        	localStorage.stepNum="#step1";
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/step1', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step2:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/step2', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step3:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/step3', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        step4:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/step4', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        pay_ok:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/pay_ok', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        renew:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/renew', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        update_key:function(){
            this.preRoute(false, 'admin').then(function(){
                require(['../../view/admin/update_key', '../../model/admin/admin'],function(View, Model){
                    var view = new View({model: new Model()});
                    view.render();
                });
            });
        },
        hashChange: function () {
	        var order = localStorage.orderNo;
	        stepNum = localStorage.stepNum;
	        if (window.location.hash != "") {
	            if (order) {
	                if (stepNum != window.location.hash) {
	                    service.status(order).done(function (data) {
	                        if (data.code == 0) {
	                            localStorage.stepNum = "#step" + data.data.operateStep;
	                            window.open("admin.html#step" + data.data.operateStep, '_self')
	                        }
	                    })
	                }
	            } else {
	                window.open("admin.html#step1", '_self')
	            }
	        }
	    }
	});
});