import tpl from './tpl/step3.html'
var step3 = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    
    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = step3;