define([
    "text!./tpl/invoice.html",
    "../../lib/service",
    "../../lib/public",
    "text!../pub/tpl/dialog.html",
    "bootbox"
    ],function(tpl,service,public,bootbox,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var dialogs = $(dialogs);
    var main = Backbone.View.extend({
        el: '.contents',
        initialize:function () {
        	
        },
        render: function() {
			this.$el.empty().html(template.compile(tpl,{})());
        	document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        events: {
         
        }
    });
    return main;
});
