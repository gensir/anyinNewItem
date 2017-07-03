import tpl from './tpl/update.html'
var update = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = update;