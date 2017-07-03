import tpl from './tpl/logs2.html'
var logs2 = Backbone.View.extend({
    el: '.contents',
    initialize(){
    },
    render: function(query) {
        this.$el.html(tpl);
    },
});

module.exports = logs2;