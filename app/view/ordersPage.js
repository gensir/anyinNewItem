define([
    "text!../tpl/ordersPage.html",
//    "text!../tpl/comTable.html",
    "../../app/lib/service",
    "datetimepicker",
    "typeahead",
    "colResizable"
    ],function(ordersPageTpl, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(ordersPageTpl)({}));
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