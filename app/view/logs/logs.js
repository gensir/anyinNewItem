define([
    "text!./tpl/logs.html",
    "text!../pub/tpl/footer.html",
    "../../lib/service",
    "datetimepicker",
    ],function(logsPageTpl, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(logsPageTpl)({}));
				this.lastFun();
            },
            events: {
                "click .startfind": "startfind",
                "click .details li.logs":"togglePage"
            },
            lastFun:function(){
            }
        });
        return main;
    }
);