define([
	"text!./tpl/update_key.html",
	"text!../pub/tpl/footer.html",
	"../../../app/lib/service",
	"bootbox"
], function(tpl, primary, service, bootbox) {
	var template = require('art-template');
	var main = Backbone.View.extend({
		el: '.contents',
		initialize:function() {},
		render: function (query) {
	        this.$el.html(tpl);
	        document.body.scrollTop = document.documentElement.scrollTop = 0;
	    },
	});
	return main;
});