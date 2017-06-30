
var tpl = require('./tpl/index.html');
var uhead = require('../pub/tpl/uhead.html');
//var dialog = require('./tpl/dialog.html');
var index = Backbone.View.extend({
    el: '.container',
    initialize(){
        $(".wrapper").prepend(uhead)
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
    },
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
    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = index;