import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
var list = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
    },
    render: function (query) {
        this.$el.prepend(tpl);
    },
    toggleList(event) {
        var _this = event.currentTarget;
        var ind = $(_this).parent(".list").index();
        $(".eseallist .list .showHide").slideUp();
        var toggle = $(_this).parent(".list").find(".showHide");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
        } else {
            toggle.slideUp();
        }
    },
});

module.exports = list;