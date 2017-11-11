define([
    "text!./tpl/step5.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "../../../app/lib/util",
    "bootbox"
    ],function(registerstep5,primary,service,util,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        render: function(param) {
			this.$el.empty().html(template.compile(registerstep5,{})());
			this.$el.append(template.compile(primary,{})());
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
