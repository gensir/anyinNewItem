import tpl from './tpl/logs.html'
var logs = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    render: function(query) {
        this.$el.html(tpl);
    },
});

module.exports = logs;
