var tpl = require('./tpl/index.html');
var service = require('../../server/service').default;
import dialog from '../pub//tpl/dialog.html';
var dialogs = $($(dialog()).prop("outerHTML"));
var index = Backbone.View.extend({
    el: '.container',
    initialize() {
        //this.load();
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
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

    load() {
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "common realname",
            title: dialogs.find(".realname .title")[0].outerHTML,
            message: dialogs.find(".realname .msg1")[0].outerHTML,
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

    //获取签章记录数据
    logslist() {
        var _this = this
        service.getLogsList(1, 5).done(res => {
            var obj;
            if (res.code != 0) {
                obj = {}
            } else {
                obj = res.data.list;
            }
            this.model.get("tpl").data = obj
            this.$el.html(tpl(this.model.get("tpl")));
        });
    },
    //获取印章数据
    getEsealList() {
        var data = {
            "firmId": "nihao"
        }
        service.getEsealList(this.model.get("pageNum"), this.model.get("pageSize"), data).done(res => {
            var Esealobj;
            if (res.code != 0) {
                Esealobj = {}
            } else {
                Esealobj = res.data.list;
            }
            this.model.get("tpl").esealValid = Esealobj
            this.$el.html(tpl(this.model.get("tpl")));
        });
    },
    render: function () {
        //this.$el.html(tpl);
        this.getEsealList();
        this.logslist();
    },
});

module.exports = index;