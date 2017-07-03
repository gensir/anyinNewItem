import tpl from './tpl/step5.html'
var step5 = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step5;