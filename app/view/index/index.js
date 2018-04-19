define([
    "text!./tpl/index.html",
    "../../lib/service",
    "bootbox",
    "text!../pub/tpl/dialog.html",
    "../../lib/ukeys",
], function (indextpl, service, bootbox, dialog, ukeys) {
    var Backbone = require('backbone');
    var template = require('art-template');
    var dialogs = $(dialog);

    var udata = $.cookie('loginadmin') && (JSON.parse($.cookie('loginadmin'))) || { user: {}, menuList: {} }
    var enterpriseCode = udata && udata.user && udata.user.enterpriseCode;
    var firmId = udata && udata.user && udata.user.firmId;
    var statusRemark = udata && udata.user && udata.user.statusRemark || "无";
    var Decrypt = $.cookie("logs_Decrypt") && JSON.parse($.cookie('logs_Decrypt'));
    var d_esealCode = Decrypt && Decrypt.logs_esealCode, d_oid = Decrypt && Decrypt.logs_oid, d_PKSC7 = Decrypt && Decrypt.logs_dSignature;
    var r_Oid, r_esealCode, r_keyType, r_certificateFirm, r_esealStatus;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function () { },
        render: function () {
            var _this = this;
            _this.userinfo();
            _this.userintegral();
            _this.logslist();
            _this.integral_ad();
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
        firmId: function () {
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
                                result.cancelable = window.location.href = 'login.html';
                            }
                        },
                    }
                })
                return false;
            }
        },
        //积分广告，登录后弹出一次
        integral_ad: function () {
            if (udata.user.status == 1 && $.cookie("loginadmin") !== undefined && ($.cookie("isadshow") === undefined || $.cookie("isadshow") == "")) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "integralad",
                    title: false,
                    message: '<div class="dialog_adbox">' +
                        '<button type="button" class="bootbox-close-button close" data-dismiss="modal" aria-hidden="true"></button>' +
                        '<a class="adlink" href="#" target="_blank" title="立即兑换"></a>' +
                        '<img src="./app/asset/img/integral_ad.png" alt="">' +
                        '</div>',
                    buttons: false
                })
                $.cookie("isadshow", true);
                return false;
            }
        },
        //续费操作证书验证
        renew: function (event) {
            event.stopPropagation();
            var that = this;
            r_Oid = $(event.currentTarget).data('oid');
            r_esealCode = $(event.currentTarget).data('code');
            r_keyType = $(event.currentTarget).data('type');
            r_certificateFirm = $(event.currentTarget).data('cert');
            r_esealStatus = $(event.currentTarget).data('status');
            localStorage.u_keyType = r_keyType;
            localStorage.u_certificateFirm = r_certificateFirm;
            var numInd = 0;
            var dialogsText = dialogs.find(".unlock");

            //可续费状态数组
            var arr = new Array([1, 6]);
            Array.prototype.in_array = function (e) {
                var r = new RegExp(',' + e + ',');
                return (r.test(',' + this.join(this.S) + ','));
            };
            //证书参数异常校验
            if (!r_Oid) {
                bootbox.dialog({
                    backdrop: true,
                    // closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该电子印章无OID，不能进行续期操作！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function (result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            } else if (!arr.in_array(r_esealStatus)) {
                //电子印章状态不为1, 6不允许续费
                bootbox.dialog({
                    backdrop: true,
                    // closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该电子印章状态不支持续费操作！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function (result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            } else if (!r_keyType || !r_certificateFirm) {
                //keyType为空时要求读取UKEY数据后进行回写
                bootbox.dialog({
                    backdrop: true,
                    // closeButton: false,
                    className: "common unlock",
                    title: "UKEY校验",
                    message: '<div class="msg1">该电子印章数据缺失，需要进行UKEY校验</br>请插入相对应的UKEY后点击“继续”</div',
                    buttons: {
                        cancel: {
                            label: "取消",
                            className: "btn1",
                            callback: function (result) {
                                result.cancelable = false;
                            }
                        },
                        confirm: {
                            label: "继续",
                            className: "btn2",
                            callback: function (event) {
                                numInd++;
                                var _this = this;
                                if (numInd == 1) {
                                    var msg4 = dialogsText.find(".msg4")[0].outerHTML;
                                    $(this).find(".bootbox-body").html(msg4);
                                    $(this).find(".btn1,.btn2").hide();
                                    setTimeout(function () {
                                        if (!ukeys.ukeyName().length) {
                                            numInd = 0;
                                            var msg3 = dialogsText.find(".msg3")[0].outerHTML;
                                            $(_this).find(".bootbox-body").html(msg3);
                                            $(_this).find(".btn1,.btn2").show();
                                            $(_this).find(".btn2").show().html("重试");
                                        } else {
                                            var msg6 = dialogsText.find(".msg6")[0].outerHTML;
                                            $(_this).find(".bootbox-body").html(msg6);
                                            $.each(ukeys.ukeyName(), function (ind, val) {
                                                $("#seleBook").append("<Option value='ind'>" + val + "</Option>");
                                            });
                                            $(_this).find(".btn1,.btn2").show();
                                            $(_this).find(".btn2").show().html("确定");
                                        }
                                    }, 1000);
                                } else if (numInd == 2) {
                                    // 验证KEY密码
                                    var selectedUkey = $("#seleBook option:selected").val();
                                    var unlockCode = $("#unlockCode").val();
                                    if (selectedUkey == "") {
                                        numInd = 1;
                                        $(_this).find("#seleBook-error").html("请选择一个证书");
                                        $(_this).find(".btn2").show().html("确定");
                                        $("#seleBook").change(function () {
                                            $("#seleBook-error").html("");
                                        });
                                    } else if (unlockCode.length < 6) {
                                        numInd = 1;
                                        $(_this).find("#unlock-error").html("请输入6位以上PIN码");
                                        $(_this).find(".btn2").show().html("确定");
                                        $("#unlockCode").keyup(function () {
                                            $("#unlock-error").html("");
                                        });
                                    } else {
                                        var selectedUkey = $("#seleBook option:selected").index() - 1;
                                        var ukey_oid = ukeys.GetOid(selectedUkey);
                                        var ukey_certificateFirms = ukeys.certificateFirms(selectedUkey);
                                        var ukey_keyType = ukeys.getCertType(selectedUkey) == "1" ? 1 : 2;
                                        console.log("证书OID：" + ukey_oid);
                                        console.log("caType：" + ukey_certificateFirms);
                                        console.log("keyType" + ukey_keyType);
                                        if (!ukeys.GetCertCount()) {
                                            numInd = 1;
                                            $(_this).find("#unlock-error").html("未检测到ukey，请插入ukey后重试");
                                            $(_this).find(".btn2").show().html("重试");
                                            return false;
                                        };
                                        if (ukey_oid != r_Oid) {
                                            numInd = 0;
                                            // $(_this).find("#unlock-error").html("您选择的UKEY与印章不符，请更换UKEY后重试").css({ "color": "red" });
                                            $(_this).find(".bootbox-body").html("<div class='msgcenter'><em></em><span>" + "您选择的UKEY与印章不符，请更换UKEY后重试" + "</span></div>");
                                            $(_this).find(".btn2").show().html("重试");
                                        } else {
                                            if (ukeys.PIN($("#unlockCode").val(), selectedUkey)) {
                                                service.updata_ukeyType(r_esealCode, ukey_oid, ukey_certificateFirms, ukey_keyType).done(function (data) {
                                                    if (data.code == 0) {
                                                        $(_this).find(".bootbox-body").html("<div class='msgcenter'><span>您的证书校验成功，请重新进行续费操作！</span></div>");
                                                        $(_this).find(".btn1,.btn2").hide();
                                                        setTimeout(
                                                            function () {
                                                                _this.modal("hide");
                                                                location.reload();
                                                            }, 3000);
                                                    } else {
                                                        numInd = 0;
                                                        $(_this).find(".bootbox-body").html("<div class='msgcenter'><em></em><span>" + data.msg + "</span></div>");
                                                        $(_this).find(".btn2").show().html("重试");
                                                    }
                                                });
                                            } else {
                                                numInd = 1;
                                                var GetOid = ukeys.GetOid(selectedUkey);
                                                var data = {
                                                    "oid": GetOid,
                                                    "errorCode": 1
                                                };
                                                service.checkPIN(data).done(function (data) {
                                                    if (data.code == 1) {
                                                        $(_this).find("#unlock-error").html(data.msg);
                                                        $(_this).find(".btn2").show().html("重试");
                                                    }
                                                    $("#unlockCode").change(function () {
                                                        $("#unlock-error").html("");
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }
                                //this.modal('hide');
                                return false;
                            }
                        },
                    }
                })
            } else {
                //有效期时长判断请求
                var data = {
                    "oid": r_Oid,
                    "esealCode": r_esealCode,
                    "keyType": r_keyType,
                    "caType": r_certificateFirm

                };
                service.check_cert_valid(data).done(function (res) {
                    if (res.code == 0) {
                        var pointCode = res.data.pointCode;
                        console.log("pointCode:" + pointCode)
                        if (pointCode == 0) {
                            //只可进行2年有效期续期
                            console.log("可进行2年续期")
                            localStorage.rennw_year = 2;
                            that.certType_Status();
                        } else if (pointCode == 1) {
                            //电子印章有效时长>730天，不可进行续期,弹出提示框“该电子印章有效时长大于两年，无需进行续期”，3s后隐藏
                            bootbox.dialog({
                                backdrop: true,
                                // closeButton: false,
                                className: "common",
                                title: "操作提示",
                                message: '<div class="msgcenter"><em></em><span>该电子印章有效时长大于两年，无需进行续期！</span></div',
                                buttons: {
                                    confirm: {
                                        label: "确定",
                                        className: "btn2",
                                        callback: function (result) {
                                            result.cancelable = false;
                                        }
                                    },
                                }
                            })
                            // setTimeout(function() {
                            //     bootbox.hideAll();
                            // }, 3000)
                            return false;
                        } else if (pointCode == 2) {
                            //只可进行2年有效期续期
                            console.log("可进行2年续期")
                            localStorage.rennw_year = 2;
                            that.certType_Status();
                        } else if (pointCode == 3 || pointCode == 4) {
                            //可进行2年、3年有效期续期
                            console.log("可进行2,3年续期")
                            localStorage.rennw_year = 3;
                            that.certType_Status();
                        } else if (pointCode == 5) {
                            //IYIN的NETCA电子印章有效时长<0，弹出提示框“该电子印章已过期，请前往电子印章受理门店办理续期业务”
                            bootbox.dialog({
                                backdrop: true,
                                // closeButton: false,
                                className: "common",
                                title: "操作提示",
                                message: '<div class="msgcenter"><em></em><span>该电子印章已过期，请前往受理门店办理续期业务！</span></div',
                                buttons: {
                                    confirm: {
                                        label: "确定",
                                        className: "btn2",
                                        callback: function (result) {
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
                            // closeButton: false,
                            className: "common",
                            title: "操作提示",
                            message: '<div class="msgcenter"><em></em><span>' + res.msg + '</span></div',
                            buttons: {
                                confirm: {
                                    label: "确定",
                                    className: "btn2",
                                    callback: function (result) {
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
        //浏览器判断及跳转
        certType_Status: function () {
            // // 安印的NETCA暂不开放续费
            // if (r_keyType == 2 && r_certificateFirm ==2) {
            //     bootbox.dialog({
            //         backdrop: true,
            //         // closeButton: false,
            //         className: "common",
            //         title: "操作提示",
            //         message: '<div class="msgcenter"><em></em><span>该电子印章的证书暂不支持在线续费！</span></div',
            //         buttons: {
            //             confirm: {
            //                 label: "确定",
            //                 className: "btn2",
            //                 callback: function(result) {
            //                     result.cancelable = false;
            //                 }
            //             },
            //         }
            //     })
            //     return false;
            // } else 
            if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                //浏览器判断
                bootbox.dialog({
                    backdrop: true,
                    // closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function (result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            } else {
                window.location.href = "admin.html#renew?esealcode=" + r_esealCode + "&oid=" + r_Oid;
            }
        },
        //更新证书提示
        updata_key: function (event) {
            event.stopPropagation();
            localStorage.u_keyType = $(event.currentTarget).data('type');
            localStorage.u_certificateFirm = $(event.currentTarget).data('cert');
            if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    // closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function (result) {
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
                "esealCode": d_esealCode,
                "oid": d_oid,
                "enterpriseCode": udata.user.enterpriseCode,
                "PKSC7": d_PKSC7,
            };
            service.commSignetLog(pageNum, pageSize, data).done(function (data) {
                var logsObj;
                if (data.code != 0) {
                    logsObj = 1;
                    _this.model.get("tpl").logdata = logsObj;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                } else {
                    logsObj = data.data.list;
                    _this.model.get("tpl").logdata = logsObj;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                }
                _this.getEsealLists();
            });
        },

        //获取印章数据
        getEsealLists: function (data, pageNum, pageSize) {
            var _this = this
            pageNum = pageNum || 1;
            pageSize = pageSize || 4;
            var data = {
                "enterpriseCode": udata.user.enterpriseCode
            };
            service.getEsealList(pageNum, pageSize, data).done(function (data) {
                var Esealobj;
                if (data.code != 0) {
                    $(".xufei ul").append("<li>接口数据请求失败！</li>");
                } else {
                    Esealobj = data.data.list;
                    _this.model.get("tpl").esealdata = Esealobj;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));

                    if (!Boolean(Esealobj)) {
                        // $(".xufei ul.blist").append("<li><span class='name'>无电子印章</span><span class='operate'><a href='admin.html#step1'>我要申请</a></span></li>");
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
        //积分查询
        userintegral: function () {
            var _this = this;
            var data = {
                "mobile": udata.user.mobile
            }
            service.getUserScore(data).done(function (res) {
                if (res.code == 0) {
                    _this.model.get("tpl").integraldata = res.data;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                } else {
                    _this.model.get("tpl").integraldata = 0;
                    _this.$el.html(template.compile(indextpl)(_this.model.get("tpl")));
                }
            })
        },
    });
    return main;
});