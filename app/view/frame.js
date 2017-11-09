define([
    "text!../tpl/header.html",
    "text!../tpl/primary.html",
    "../../app/lib/service",
    ],function(header,primary,service) {

    var Backbone = require('backbone');
    var template = require('art-template');
   
    var main = Backbone.View.extend({
    	events:{
           // 'click .order-list li':'leftNavChioce'

        },
        el: '#main',
        initialize:function () {
        },
        render: function(pageTag) {
            var that=this
            this.$el.append(template.compile(header,{})());
            this.$el.append(template.compile(primary,{})());            

			this.pageTagChioce(pageTag);

        },
        pageTagChioce:function(pageTag){
			$(".u-head .menu li a").removeClass("active");
			$(pageTag).addClass("active");        	
        }
        
    });
    return main;
});
