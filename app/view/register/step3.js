/**
 * Created by Administrator on 2017/6/20 0020.
 */
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