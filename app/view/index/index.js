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
    var esealCode = localStorage.logs_esealCode;
    var oid = localStorage.logs_oid;
    var PKSC7 = localStorage.logs_dSignature;
    var r_Oid, r_esealCode, r_keyType, r_certificateFirm, r_esealStatus;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function () { },
        render: function () {
            var _this = this;
            _this.userinfo();
            _this.logslist();
        },
        events: {
            // 'click .jilulist ul li .file': 'Toggleshow',
            'click .blist .renew': 'renew',
            'click .updata_key': 'updata_key',
        },
        //公司基本信息
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
            _this.firmId();
        },
        //是否有firmId
        firmId: function() {
            if (!firmId && $.cookie('loginadmin') !== undefined) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>无单位id信息，不能进行下一步操作！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function (result) {
                                localStorage.clear();
                                $.removeCookie('loginadmin');
                                result.cancelable = window.location.href ='login.html';
                            }
                        },
                    }
                })
                return false;
            }
        },
        //续费操作证书有效期验证
        renew: function(event) {
            event.stopPropagation();
            var that = this;
            r_Oid = $(event.currentTarget).data('oid');
            r_esealCode = $(event.currentTarget).data('code');
            r_keyType = $(event.currentTarget).data('type');
            r_certificateFirm = $(event.currentTarget).data('cert');
            r_esealStatus = $(event.currentTarget).data('status');
            localStorage.u_keyType = r_keyType;
            localStorage.u_certificateFirm = r_certificateFirm;
            var data = {
                "oid": r_Oid,
                "esealCode": r_esealCode,
                "keyType": r_keyType,
                "caType": r_certificateFirm

            };
            //印章参数判断
            if (!r_Oid && !r_keyType && !r_certificateFirm) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该电子印章参数异常，不能进行续期操作！</span></div',
                    buttons: {
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
            } else {
                //有效期时长判断请求
                service.check_cert_valid(data).done(function(res) {
                    if (res.code == 0) {
                        var pointCode = res.data.pointCode;
                        console.log(pointCode)
                        if (pointCode ==1) {
                            //电子印章有效时长>730天，不可进行续期,弹出提示框“该电子印章有效时长大于两年，无需进行续期”，3s后隐藏
                            bootbox.dialog({
                                backdrop: true,
                                closeButton: false,
                                className: "common",
                                title: "操作提示",
                                message: '<div class="msgcenter"><em></em><span>该电子印章有效时长大于两年，无需进行续期！</span></div',
                                buttons: {
                                    confirm: {
                                        label: "确定",
                                        className: "btn2",
                                        callback: function(result) {
                                            result.cancelable = false;
                                        }
                                    },
                                }
                            })
                            setTimeout(function() {
                                bootbox.hideAll();
                            }, 3000)
                            return false;
                        } else if (pointCode ==2) {
                            //只可进行2年有效期续期
                            console.log("可进行2年续期")
                            localStorage.rennw_year = pointCode;
                            that.certType_Status();
                        } else if (pointCode == 3 || pointCode == 4) {
                            //可进行2年、3年有效期续期
                            console.log("可进行2,3年续期")
                            localStorage.rennw_year = 3;
                            that.certType_Status();
                        } else if (pointCode ==5) {
                            //IYIN的NETCA电子印章有效时长<0，弹出提示框“该电子印章已过期，请前往电子印章受理门店办理续期业务”
                            bootbox.dialog({
                                backdrop: true,
                                closeButton: false,
                                className: "common",
                                title: "操作提示",
                                message: '<div class="msgcenter"><em></em><span>该电子印章已过期，请前往门店办理续期！</span></div',
                                buttons: {
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
                    } else {
                        bootbox.dialog({
                            backdrop: true,
                            closeButton: false,
                            className: "common",
                            title: "操作提示",
                            message: '<div class="msgcenter"><em></em><span>' + res.msg + '</span></div',
                            buttons: {
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
                });
            }
        },
        //续费状态及证书控制
        certType_Status: function() {
            //可续费状态数组
            var arr = new Array([1, 6, 14]);
            Array.prototype.in_array = function(e) {
                var r = new RegExp(',' + e + ',');
                return (r.test(',' + this.join(this.S) + ','));
            };
            //电子印章状态不为1, 6, 14不允许续费
            if (!arr.in_array(r_esealStatus)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该电子印章状态不支持续费操作！</span></div',
                    buttons: {
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
            } else if (r_keyType == 2 && r_certificateFirm ==2) {//安印的NETCA暂不开放续费
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该电子印章的证书暂不支持在线续费！</span></div',
                    buttons: {
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
            } else if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
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
            } else {
                window.location.href = "admin.html#renew?esealCode=" + r_esealCode + "&oid=" + r_Oid;
            }
        },
        //更新证书提示
        updata_key: function(event) {
            event.stopPropagation();
            localStorage.u_keyType = $(event.currentTarget).data('type');
            localStorage.u_certificateFirm = $(event.currentTarget).data('cert');
            if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
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
                "oid": oid,
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
                    // var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                    // //  isODC为1的时候是ODC登录的
					// if(!isODC){
					// 	$(".actionlist .nav1").hide();
					// }
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
                "enterpriseCode": enterpriseCode
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
                    // var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                    // //  isODC为1的时候是ODC登录的
					// if(!isODC){
					// 	$(".actionlist .nav1").hide();
					// }
                    
                    if (!Boolean(Esealobj)) {
                        $(".xufei ul.blist").append("<li><span class='name'>无电子印章</span><span class='operate'><a href='admin.html#step1'>我要申请</a></span></li>");
                        $(".xufei ul.blist").append("<li><span class='name'>无电子印章</span></li>");
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