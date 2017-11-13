define([
    "text!./tpl/admin.html",
    "text!../pub/tpl/footer.html",
    "../../lib/service",
    ],function(adminPageTpl, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(adminPageTpl)({}));
				this.lastFun();
            },
            events: {
                "click .startfind": "startfind",
                "click .details li.admin":"togglePage"
            },
            lastFun:function(){
            }
        });
        return main;
    }
);