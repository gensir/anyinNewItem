
var tpl = require('./tpl/index.html');
var uhead = require('../pub/tpl/uhead.html');
//var dialog = require('./tpl/dialog.html');
var index = Backbone.View.extend({
    el: '.container',
    initialize(){
        $(".wrapper").prepend(uhead)
    },
    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = index;