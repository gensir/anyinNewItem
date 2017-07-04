import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
var list = Backbone.View.extend({
    el: '.container',
    initialize() {
//      this.render();
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
//      'click .eseallist .list>.nav .loss': 'loss',
//      'click .eseallist .list>.nav .unfreeze': 'unfreeze',
//      'click .eseallist .list>.nav .logout': 'logout',
    },
    render: function (query) {
        this.$el.prepend(tpl);
    },
    toggleList(event) {
        var _this = event.currentTarget
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