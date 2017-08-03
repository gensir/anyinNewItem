var tpl = require('./tpl/index.html');
var service = require('../../server/service').default;
import dialog from '../pub/tpl/dialog.html';
import ukeys from '../../publicFun/ukeys';
var dialogs = $($(dialog()).prop("outerHTML"));
var esealCode, enterpriseCode, PKCS7, status;
var esealCode = localStorage.esealCode;
//var enterpriseCode = localStorage.enterpriseCode;
var PKCS7 = localStorage.dSignature;
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
        var userdata = {
            "username": "深圳市创业印章科技有限公司",
            "status": "2",
            "loginDate": "2017-07-01"
        }
        this.model.get("tpl").userinfo = userdata;
        this.$el.html(tpl(this.model.get("tpl")));
        if (this.model.get("tpl").userinfo.status == 0) {
            _this.realname_Unknown();
        } else if (this.model.get("tpl").userinfo.status == 2) {
            _this.realname_no();
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
            className: "common realname",
            title: dialogs.find(".realname .title")[0].outerHTML,
            message: dialogs.find(".realname .msg1")[0].outerHTML,
            buttons: {
                cancel: {
                    label: "返回",
                    className: "btn1",
                    callback: function (result) {
                        result.cancelable = false;
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
            message: dialogs.find(".realname_no .msg1")[0].outerHTML,
            buttons: {
                cancel: {
                    label: "重新实名",
                    className: "btn2 shiming",
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
        pageNum = pageNum || 1;
        pageSize = pageSize || 5;
        var data = {
            "esealCode": esealCode || "22222222",
            "enterpriseCode": enterpriseCode,
            "PKCS7": PKCS7,
        };
        service.commSignetLog(pageNum, pageSize, data).done(res => {
            var logsObj;
            if (res.code != 0) {
                logsObj = {}
            } else {
                logsObj = res.data.list;
            }
            this.model.get("tpl").logdata = logsObj;
            this.$el.html(tpl(this.model.get("tpl")));
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
        pageNum = pageNum || 1;
        pageSize = pageSize || 3;
        var data = {
            "firmId": enterpriseCode || "nihao",
        };
        service.getEsealList(pageNum, pageSize, data).done(res => {
            var Esealobj;
            if (res.code != 0) {
                Esealobj = {}
            } else {
                Esealobj = res.data.list;
            }
            this.model.get("tpl").esealdata = Esealobj;
            this.$el.html(tpl(this.model.get("tpl")));
        });
    },
});

module.exports = index;