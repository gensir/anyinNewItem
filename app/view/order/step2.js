import tpl from './tpl/step2.html'
var step2 = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    
    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = step2;