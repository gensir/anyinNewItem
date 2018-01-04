define([
    "text!./tpl/invoice_ok.html",
    "../../../app/lib/service",
    "bootbox"
    ],function(tpl,service,bootbox) {
    	
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '.contents',
        initialize:function () {
        	
        },
        render: function(query) {
            $(".text_tip a").attr("href",localStorage.dfsPdfUrl)
			this.$el.empty().html(template.compile(tpl,{})());
			this.jump();
        },
        events: {
         
        },
		jump: function() {
			var time = setInterval(showTime, 1000);
			var second = 5;

			function showTime() {
				if(second == 0) {
					window.location = 'orders.html';
					clearInterval(time);
				}
				$("#mes").html(second);
				second--;
			}
		},
    });
    return main;
});
