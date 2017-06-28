import tpl from './tpl/step4.html'
var step4 = Backbone.View.extend({
    el: '.container',
    initialize(){
    },
    
    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = step4;