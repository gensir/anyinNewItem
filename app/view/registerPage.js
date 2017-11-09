define([
    "text!../tpl/registerPage_step1.html",
    "text!../tpl/registerPage_step2.html",
    "text!../tpl/registerPage_step3.html",
    "text!../tpl/registerPage_step4.html",
    "text!../tpl/registerPage_step5.html",
    "text!../tpl/primary.html",
    "../../app/lib/service",
    "../../app/lib/util",
    "bootbox"
    ],function(registerPage_step1,registerPage_step2,registerPage_step3,registerPage_step4,registerPage_step5,primary,service,util,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        render: function(param) {
        	if( param =="step1" ){
        		this.$el.empty().html(template.compile(registerPage_step1,{})());
				this.$el.append(template.compile(primary,{})());
        	}else if( param =="step2" ){
        		this.$el.empty().html(template.compile(registerPage_step2,{})());
				this.$el.append(template.compile(primary,{})());        		
        	}else if( param =="step3" ){
        		this.$el.empty().html(template.compile(registerPage_step3,{})());
				this.$el.append(template.compile(primary,{})());               		
        	}else if( param =="step4" ){
        		this.$el.empty().html(template.compile(registerPage_step4,{})());
				this.$el.append(template.compile(primary,{})());       
        	}else if( param =="step5" ){
        		this.$el.empty().html(template.compile(registerPage_step5,{})());
				this.$el.append(template.compile(primary,{})());       
			}else{
        		this.$el.empty().html(template.compile(registerPage_step1,{})());
				this.$el.append(template.compile(primary,{})());				
			}
            this.lastFun();
        },
        events: {
                "click .startfind": "startfind",
                "click .details li.index":"togglePage"                
        },  
        lastFun:function(){
		
        },        
    });
    return main;
});
