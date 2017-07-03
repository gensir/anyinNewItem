import tpl from './tpl/pay.html'
var pay = Backbone.View.extend({
    el: '.container',
    initialize(){
        window.setTimeout("window.location='#update'",5000); 
    },
    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = pay;