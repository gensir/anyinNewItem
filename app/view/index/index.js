var tpl = require('./tpl/index.html');
var service = require('../../server/service').default;
import dialog from '../pub/tpl/dialog.html';
import ukeys from '../../publicFun/ukeys';
var dialogs = $($(dialog()).prop("outerHTML"));
var udata = $.cookie('loginadmin') && (JSON.parse($.cookie('loginadmin'))) || {user:{},menuList:{}}
var enterpriseCode = udata.user.enterpriseCode;
var firmId = udata.user.firmId;
var statusRemark = udata.user.statusRemark || "无";
var esealCode = localStorage.esealCode;
var PKSC7 = localStorage.dSignature;
var index = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    render: function () {
        //this.$el.html(tpl);
        this.userinfo();
        this.getEsealList();
        this.logslist();
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
    },
    userinfo: function (event) {
        var _this = this
        var userdata = $.cookie('loginadmin') && (JSON.parse($.cookie('loginadmin'))) || { user: {}, menuList: {} }
        _this.model.get("tpl").userinfo = userdata;
        _this.$el.html(tpl(_this.model.get("tpl")));
        if (userdata.user.status == 0) {
            _this.realname_Unknown();
        } else if (userdata.user.status == 2) {
            _this.realname_no();
        } else if (userdata.user.status == 3) {
            _this.realname();
        }
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
    realname_Unknown() {
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "common realname_Unknown",
            title: dialogs.find(".realname_Unknown .title")[0].outerHTML,
            message: dialogs.find(".realname_Unknown .msg1")[0].outerHTML,
            buttons: {
                cancel: {
                    label: "返回",
                    className: "btn1",
                    callback: function (result) {
                        localStorage.clear();
                        // $.removeCookie('loginadmin');
                        // result.cancelable = window.open('login.html', '_self');
                    }
                },
            }
        })
        return false;
    },
    realname_no() {
        var _this = this
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "common realname_no",
            title: dialogs.find(".realname_no .title")[0].outerHTML,
            message: $(dialogs.find(".realname_no .msgcenter")[0].outerHTML).append("<span style='color:#f00;'>【" + statusRemark + "】</span>" ),
            buttons: {
                cancel: {
                    label: "重新实名",
                    className: "btn2",
                    callback: function (result) {
                        result.cancelable = window.open('register.html#step3', '_self');
                    }
                },
            }
        })
        return false;
    },
    realname() {
        var _this = this
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "common realname",
            title: dialogs.find(".realname .title")[0].outerHTML,
            message: dialogs.find(".realname .msgcenter")[0].outerHTML,
            buttons: {
                cancel: {
                    label: "我要实名认证",
                    className: "btn2",
                    callback: function (result) {
                        result.cancelable = window.open('register.html#step3', '_self');
                    }
                },
            }
        })
        return false;
    },
    //获取签章记录数据
    logslist(pageNum, pageSize, data) {
        var _this = this
        pageNum = pageNum || 1;
        pageSize = pageSize || 5;
        var data = {
            "esealCode": esealCode || "22222222",
            "enterpriseCode": enterpriseCode,
            "PKSC7": PKSC7,
        };
        service.commSignetLog(pageNum, pageSize, data).done(res => {
            var logsObj;
            if (res.code != 0) {
                logsObj = {}
                $(".jilulist ul").append("<li><div class='file'>接口数据请求失败！</div></li>");
            } else {
                logsObj = res.data.list;
                _this.model.get("tpl").logdata = logsObj;
                _this.$el.html(tpl(_this.model.get("tpl")));
            }
        });
    },

    datecalc() {
        var date1 = new Date();
        var date2 = new Date('2018-01-01');
        var date = (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000);
        if (date < 0) {
            console.log("已过期")
        } else {
            console.log(parseInt(date) + '天')
            //alert(parseInt(date) + '天');
        }
    },
    //获取印章数据
    getEsealList(data, pageNum, pageSize) {
        var _this = this
        pageNum = pageNum || 1;
        pageSize = pageSize || 3;
        var data = {
            "firmId": firmId || "nihao",
        };
        service.getEsealList(pageNum, pageSize, data).done(res => {
            var Esealobj;
            if (res.code != 0) {
                Esealobj = {}
                $(".xufei ul").append("<li>接口请求失败</li>");
            } else {
                Esealobj = res.data.list;
                _this.model.get("tpl").esealdata = Esealobj;
                _this.$el.html(tpl(_this.model.get("tpl")));

            }
        });
    },
});

module.exports = index;