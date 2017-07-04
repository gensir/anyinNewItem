import tpl from './tpl/logs.html'
var logs = Backbone.View.extend({
    el: '.contents',
    initialize(){
    },
    render: function(query) {
        this.$el.html(tpl);
    },
});

module.exports = logs;
