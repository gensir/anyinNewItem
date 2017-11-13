define([
    "text!./tpl/login.html",
    "text!../pub/tpl/dialog.html",
    "../../lib/service",
    "../../lib/ukeys",
    "bootbox"
    ],function(tpl,dialog,service,ukeys,bootbox) {
    // var dialogs = $($(dialog()).prop("outerHTML"));    
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
