import tpl from './tpl/index.html'
var Stat = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    render: function(query) {
        this.$el.html(tpl);
    },
});

module.exports = Stat;
