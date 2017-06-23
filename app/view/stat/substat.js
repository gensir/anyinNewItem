import tpl from './tpl/subindex.html'
var Stat = Backbone.View.extend({
    el: '.subStat',
    initialize() {
        this.initView();
    },
    initView() {

    },
    render: function (query) {
        this.$el.html(tpl(query));
    },

    destroy: function () {
        this.$el.empty();
    }
});

module.exports = Stat;
