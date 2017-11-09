define([
    "text!../tpl/loginPage.html",
    "../../app/lib/service",
    "../../app/lib/util",
    "bootbox"
    ],function(tpl,service,util,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        render: function(param) {
            this.$el.empty().html(template.compile(tpl,{})());
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
