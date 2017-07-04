import tpl from './tpl/logs.html'
var logs = Backbone.View.extend({
    el: '.contents',
    initialize(){
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
        'click #search': 'searchshow',
        'click #search_submit': 'nosearch',
    },
    //签章记录弹出详细记录
    Toggleshow(event) {
        var _this = event.currentTarget
        var ind = $(_this).parent(".jilulist ul li").index();
        var int = $(_this).parent(".jilulist ul li")
        $(".jilulist ul li .details").slideUp();
        $(".jilulist ul li").removeClass();
        var toggle = $(_this).parent(".jilulist ul li").find(".details");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
            $(int).addClass('active');	
        } else {
            toggle.slideUp();
            $(int).removeClass('active');
        };
    }, 
    searchshow() {
        $(".search .more").show()
    },
    nosearch() {
        $(".search .nosearch").show()
    },

    render: function(query) {
        this.$el.html(tpl);
    },
});

module.exports = logs;
