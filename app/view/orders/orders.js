define([
    "text!./tpl/orders.html",
    "text!../pub/tpl/footer.html",
    "../../lib/service",
    "../../lib/util",
    ],function(orders, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(orders)({}));
				this.lastFun();
            },
            events: {
                "click .startfind": "startfind",
                "click .details li.orders":"togglePage"
            },
            lastFun:function(){
            }
        });
        return main;
    }
);