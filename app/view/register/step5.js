define([
    "text!./tpl/step5.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox"
    ],function(registerstep5,primary,service,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        render: function(param) {
			this.$el.empty().html(template.compile(registerstep5,{})());
			this.$el.append(template.compile(primary,{})());
        	document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        events: {
         
        }
    });
    return main;
});
