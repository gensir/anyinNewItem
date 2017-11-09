define([
    "text!../tpl/indexPage.html",
//    "text!../tpl/comTable.html",
    "../../app/lib/service",
    "datetimepicker",
    "typeahead",
    "colResizable"
    ],function(indexPageTpl, service) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
            render: function () {
				this.$el.empty().html(template.compile(indexPageTpl)({}));
				this.lastFun();
            },
            events: {
                "click .startfind": "startfind",
                "click .details li.index":"togglePage"                
            },
            lastFun:function(){
				console.log("你打开了主页");
            }
        });
        return main;
    }
);