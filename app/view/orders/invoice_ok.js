define([
    "text!./tpl/invoice_ok.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox"
    ],function(tpl,footer,service,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '.contents',
        initialize:function () {
        	
        },
        render: function(param) {
			this.$el.empty().html(template.compile(tpl,{})());
			this.$el.append(template.compile(footer,{})());
        	document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        events: {
         
        }
    });
    return main;
});
