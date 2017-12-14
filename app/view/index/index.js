define([
    "text!./tpl/index.html",
    "../../lib/service",
    "bootbox",
    "text!../pub/tpl/dialog.html",
], function (indextpl, service, bootbox, dialog) {
    var Backbone = require('backbone');
    var template = require('art-template');
    var dialogs = $(dialog);

    var udata = $.cookie('loginadmin') && (JSON.parse($.cookie('loginadmin'))) || { user: {}, menuList: {} }
    var enterpriseCode = udata && udata.user && udata.user.enterpriseCode;
    var firmId = udata && udata.user && udata.user.firmId;
    var statusRemark = udata && udata.user && udata.user.statusRemark || "无";
    var esealCode = localStorage.esealCode;
    var PKSC7 = localStorage.dSignature;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function () { },
        render: function () {
            var _this = this;
            _this.userinfo();
            _this.logslist();
            if (!firmId&&$.cookie('loginadmin') !== undefined) {
                bootbox.alert("获取单位id异常，无权限访问", function () { window.open('login.html', '_self'); })
                return;
            }
            
            //屏蔽非ODC的电子印章申请
            var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
//          		isODC为1的时候是ODC登录的
			if(!isODC){
				$(".actionlist .nav1").css("visibility","hidden");
			}
			
        },
        events: {
            // 'click .jilulist ul li .file': 'Toggleshow',
            'click .renew': 'renew'
        },
        userinfo: function (event) {
            var _this = this
            var userdata = $.cookie('loginadmin') && (JSON.parse($.cookie('loginadmin'))) || { user: {}, menuList: {} }
            _this.model.get("tpl").userinfo = userdata;
            _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
            if (userdata.user.status == 0) {
                _this.realname_Unknown();
            } else if (userdata.user.status == 2) {
                _this.realname_no();
            } else if (userdata.user.status == 3) {
                _this.realname();
            }
        },
        //续费操作
        renew: function(event) {
            event.stopPropagation();
            var GetOid = $(event.currentTarget).data('oid');
            localStorage.keyType = $(event.currentTarget).data('type');
            localStorage.certificateFirm = $(event.currentTarget).data('cert');
            if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
                        // cancel: {
                        //     label: "取消",
                        //     className: "btn1",
                        //     callback: function(result) {
                        //         result.cancelable = false;
                        //     }
                        // },
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function(result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            }
        },
        //签章记录弹出详细记录
        Toggleshow: function (event) {
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
        //认证审核中
        realname_Unknown: function () {
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
                            $.removeCookie('loginadmin');
                            result.cancelable = window.open('login.html', '_self');
                        }
                    },
                }
            })
            return false;
        },
        //审核未通过
        realname_no: function () {
            var _this = this
            bootbox.dialog({
                backdrop: true,
                closeButton: false,
                className: "common realname_no",
                title: dialogs.find(".realname_no .title")[0].outerHTML,
                message: $(dialogs.find(".realname_no .msgcenter")[0].outerHTML).append("<span style='color:#f00;'>【" + statusRemark + "】</span>"),
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
        //未实名
        realname: function () {
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
        logslist: function (pageNum, pageSize, data) {
            var _this = this
            pageNum = pageNum || 1;
            pageSize = pageSize || 4;
            var data = {
                "esealCode": esealCode,
                "enterpriseCode": enterpriseCode,
                "PKSC7": PKSC7,
            };
            service.commSignetLog(pageNum, pageSize, data).done(function (data) {
                var logsObj;
                if (data.code != 0) {
                    logsObj = {}
                    $(".jilulist ul").append("<li><div class='file'>接口数据请求失败！</div></li>");
                } else {
                    logsObj = data.data.list;
                    _this.model.get("tpl").logdata = logsObj;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                    //屏蔽非ODC的电子印章申请
                    var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                    //  isODC为1的时候是ODC登录的
					if(!isODC){
						$(".actionlist .nav1").css("visibility","hidden");
					}
                }
                _this.getEsealList();
            });
        },

        //获取印章数据
        getEsealList: function (data, pageNum, pageSize) {
            var _this = this
            pageNum = pageNum || 1;
            pageSize = pageSize || 4;
            var data = {
                "firmId": firmId
            };
            service.getEsealList(pageNum, pageSize, data).done(function (data) {
                var Esealobj;
                if (data.code != 0) {
                    $(".xufei ul").append("<li>接口数据请求失败！</li>");
                } else {
                    Esealobj = data.data.list;
                    _this.model.get("tpl").esealdata = Esealobj;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                    
                    //屏蔽非ODC的电子印章申请
                    var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                    //  isODC为1的时候是ODC登录的
					if(!isODC){
						$(".actionlist .nav1").css("visibility","hidden");
					}
                    
                    if (!Boolean(Esealobj)) {
                        $(".xufei ul.blist").append("<li><span class='name'>无电子印章</span><span class='operate'><a href='admin.html#step1'>我要申请</a></span></li>");
                    } else {
                        for (var i = 0; i < Esealobj.length; i++) {
                            var date1 = new Date(),
                                dates = data.data.list[i].validEnd;
                            // dates = "2017-9-30 12:45:25";
                            if (Boolean(dates)) {
                                var date2 = new Date(dates.replace(/-/g, "/"));
                                var count = (date2.getTime() - date1.getTime()) / (24 * 60 * 60 * 1000);
                                if (count < 0) {
                                    $(".blist li").eq(i).find("span.date").html("已过期");
                                } else {
                                    $(".blist li").eq(i).find("span.date").html(Math.ceil(count) + "天");
                                }
                            }
                        }
                    }

                }
            });
        },
    });
    return main;
});