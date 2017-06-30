var tpl = require('./tpl/index.html');
var uhead = require('../pub/tpl/uhead.html');
import dialog from './tpl/dialog.html'
var dialogs = $($(dialog()).prop("outerHTML"));
var index = Backbone.View.extend({
    el: '.container',
    initialize(){
        $(".wrapper").prepend(uhead);
        this.render();
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
        'click #test': 'load',
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
    
    load() {
        //var numInd = this.model.get("numInd")
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "realName",
            title: dialogs.find(".lossEseal .title")[0].outerHTML,
            message: dialogs.find(".lossEseal .msg1")[0].outerHTML,
            buttons: {
                cancel: {
                    label: "返回",
                    className: "btn1",
                    callback: function (result) {
                        //console.log(result, "cancel")
                        result.cancelable = false;
                    }
                },
            }
        })
        return false;
    },

    render: function (query) {
        this.$el.html(tpl);
    },
});

module.exports = index;