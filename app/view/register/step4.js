define([
    "text!./tpl/step4.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox"
    ],function(registerstep4,footer,service,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize:function () {
        	
        },
        events: {
          
        },     
        render: function(param) {
			this.$el.empty().html(template.compile(registerstep4,{})());
			this.$el.append(template.compile(footer,{})());
        	document.body.scrollTop = document.documentElement.scrollTop = 0;
        }

    });
    return main;
});
