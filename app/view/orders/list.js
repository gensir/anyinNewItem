import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
var service=require('../../server/service').default;
var list = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
    },
    render: function (query) {
        service.queryOrderList(1,10).done(res=>{
			var tempObj;
			if(res.code != 0){
                tempObj = {}
			}else {
                tempObj = res.data.list;
			}
			this.$el.html(tpl({data:tempObj}));
		})
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