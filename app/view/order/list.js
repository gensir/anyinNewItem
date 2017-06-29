import tpl from './tpl/list.html'
var step1 = Backbone.View.extend({
    el: '.wrapper',
    initialize(){

    },
    
    render: function (query) {
        this.$el.append(tpl);
    },
});

module.exports = step1;