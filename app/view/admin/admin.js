define([
    "text!./tpl/admin.html",
    "../../lib/service",
    "../../lib/public",
    "../../lib/ukeys",
    "text!../pub/tpl/dialog.html",
    "bootbox"
], function (tpl, service, publicUtil, ukeys, dialogs, bootbox) {
    var dialogs = $(dialogs);
    var GetQueryString = publicUtil.GetQueryString;
    var sendmsg = publicUtil.sendmsg;
    var GetQueryStringBool = true;
    var Backbone = require('backbone');
    var template = require('art-template');
    var r_Oid, r_esealCode, r_keyType, r_certificateFirm, r_esealStatus;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function () {
            this.firmId = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId
            this.enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
        },
        render: function () {
            that = this;
            this.listPage();
        },
        events: {
            'click .eseallist .list>.nav': 'toggleList',
            'click .eseallist .renew': 'renew',
            'click .eseallist .updata_key': 'updata_key',
            'click .eseallist .list>.nav .loss,.eseallist .list>.toggle>.nav>.n3 .loss': 'loss',
            'click .eseallist .list>.nav .cancelloss': 'cancelloss',
            'click .eseallist .list>.nav .unfreeze': 'unfreeze',
            'click .eseallist .list>.nav .logout': 'logout',
            'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
            'click .pagination .NextPage:not(".no")': 'NextPage',
            'click .pagination .index': 'currentPapge',
            'click #step': 'step'
        },
        toggleList: function (event) {
            var _this = event.currentTarget
            var ind = $(_this).parent(".list").index();
            $(".eseallist .list .toggle").slideUp();
            var toggle = $(_this).parent(".list").find(".toggle");
            if (toggle.is(":hidden")) {
                toggle.slideDown();
                $(".nav").removeClass("nav_tac");
                $(_this).addClass("nav_tac");
                //$(_this).parent(".list").removeClass("listbl");

                $(_this).next(".toggle").find(".tog_bot").click(function () {
                    toggle.slideUp();
                    $(".nav").removeClass("nav_tac");
                    //$(_this).parent(".list").addClass("listbl");
                });
            } else {
                toggle.slideUp();
                $(".nav").removeClass("nav_tac");
                //$(_this).parent(".list").addClass("listbl");
            }
        },
        getSealName: function (target) {
            var _this = target.currentTarget;
            var ind = $(_this).parents(".list").index();
            return this.model.get("tplhtml").loginlist[ind].esealFullName;
        },
        //预挂失
        loss: function (event) {
            var _this = this;
            event.stopPropagation();
            var status = $(event.currentTarget).data('status');
            var esealFullName = $(event.currentTarget).data('name');
            var esealCode = $(event.currentTarget).data('code');
            var mobile = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.mobile
            // var mobile = "13590435949"
            var numInd = this.model.get("numInd");
            if (status == 1 || status == 6 || status == 7) {
                var dialog = bootbox.dialog({
                    backdrop: true,
                    //closeButton: false,
                    className: "common loss",
                    title: dialogs.find(".lossEseal .title")[0].outerHTML,
                    message: '<div class="msg1">您选择预挂失 <span>“' + esealFullName + '”</span></br>该电子印章相关功能将暂停使用</div>',
                    buttons: {
                        cancel: {
                            label: "返回",
                            className: "btn1",
                            callback: function (result) {
                                result.cancelable = false;
                            }
                        },
                        confirm: {
                            label: "继续",
                            className: "btn2 sureLoss",
                            callback: function (event) {
                                numInd++;
                                var _this = this;
                                if (numInd == 1) {
                                    var msg2 = dialogs.find(".msg2")[0].outerHTML;
                                    $(_this).find(".bootbox-body").html(msg2);
                                    sendmsg($(_this).find("#resend"));
                                    service.getSMSVerifCode(mobile).done(function (res) {
                                        if (res.code == 0) {
                                            console.log("短信发送成功")
                                        } else {
                                            $("#codetip").html(res.msg).css({ "color": "red" });
                                        }
                                    })
                                    $(_this).find("#resend").unbind().click(function (res) {
                                        sendmsg($(_this).find("#resend"));
                                        service.getSMSVerifCode(mobile).done(function (res) {
                                            if (res.code == 0) {
                                                console.log("短信重新发送成功")
                                            } else {
                                                $("#codetip").html(res.msg).css({ "color": "red" });
                                            }
                                        })
                                    })
                                } else if (numInd == 2) {
                                    var code = $(_this).find(".checkSmsCode").val();
                                    if (code.length < 6) {
                                        numInd = 1;
                                        $("#codetip").html("请输入6位验证码").css({ "color": "red" });
                                        $(".checkSmsCode").css({ "border-color": "red" });
                                        $(".checkSmsCode").keyup(function () {
                                            $("#codetip").html("");
                                            $(".checkSmsCode").css({ "border-color": "#ccc" })
                                        });
                                    } else {
                                        if (code == "000000") {
                                            numInd = 2;
                                            console.log("验证成功");
                                            $(_this).find(".btn2").show().html("确定");
                                            $(_this).find(".btn1").hide();
                                            $(_this).find(".bootbox-body").html('<div class="msg3" style="color:#333">已成功预挂失“' + esealFullName + '”，请在7个工作日内携带法人身份证、营业执照（副本）前往门店完成挂失操作。</div>');
                                        } else {
                                            var data = {
                                                "esealCode": esealCode,
                                                "mobilePhoneNo": mobile,
                                                "smsCode": code
                                            }
                                            service.updatePreLossStatus(data).done(function (res) {
                                                if (res.code == 0) {
                                                    numInd = 2;
                                                    console.log("验证成功");
                                                    $(_this).find(".btn2").show().html("确定");
                                                    $(_this).find(".btn1").hide();
                                                    $(_this).find(".bootbox-body").html('<div class="msg3" style="color:#333">已成功预挂失“' + esealFullName + '”，请在7个工作日内携带法人身份证、营业执照（副本）前往门店完成挂失操作。</div>');
                                                } else {
                                                    numInd = 1;
                                                    console.log("验证失败");
                                                    $("#codetip").html("手机验证码错误或超时，请重新获取").css({ "color": "red" });
                                                    $(".checkSmsCode").css({ "border-color": "red" });
                                                    // $(_this).find(".bootbox-body").html('<div class="msgcenter"><em></em><span>手机验证码错误！</span></div');
                                                    $(".checkSmsCode").keyup(function () {
                                                        $("#codetip").html("");
                                                        $(".checkSmsCode").css({ "border-color": "#ccc" })
                                                    });
                                                }
                                            })
                                        }
                                    }
                                } else {
                                    _this.modal('hide');
                                    location.reload();
                                }
                                return false;
                            }
                        }
                    }
                })
            } else {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common loss",
                    title: "预挂失",
                    message: '<div class="msgcenter"><em></em><span>该印章当前状态不允许此操作！</span></div',
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
            }
        },
        //取消预挂失
        cancelloss: function (event) {
            event.stopPropagation();
            var list_oid = $(event.currentTarget).data('oid');
            var esealCode = $(event.currentTarget).data('code');
            var esealFullName = $(event.currentTarget).data('name');
            var enterpriseCode = this.enterpriseCode;
            var numInd = 0;
            var dialogsText = dialogs.find(".unfreezeEseal");
            bootbox.dialog({
                backdrop: true,
                closeButton: false,
                className: "common unfreezeEseal",
                title: dialogsText.find(".title")[0].outerHTML,
                message: dialogsText.find(".msg1").find("span").text('“' + esealFullName + '”').end()[0].outerHTML,
                // message: '<div class="msgcenter"><em></em><span>确认取消已预挂失的“' + esealFullName + '”？</span></div',
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
                                    $(_this).find("#unlock-error").html("请输入6位或6位以上pin码");
                                    $(_this).find(".btn2").show().html("确定");
                                    $("#unlockCode").keyup(function () {
                                        $("#unlock-error").html("");
                                    });
                                } else {
                                    var selectedUkey = $("#seleBook option:selected").index() - 1;
                                    var ukey_oid = ukeys.GetOid(selectedUkey);
                                    console.log("证书标识：" + ukey_oid);
                                    console.log("Ukey：" + selectedUkey);
                                    if (!ukeys.GetCertCount()) {
                                        numInd = 1;
                                        $(_this).find("#unlock-error").html("未检测到ukey，请插入ukey后重试");
                                        $(_this).find(".btn2").show().html("重试");
                                        return false;
                                    };
                                    if (ukey_oid != list_oid) {
                                        numInd = 0;
                                        // $(_this).find("#unlock-error").html("您选择的UKEY与印章不符，请更换UKEY后重试").css({ "color": "red" });
                                        $(_this).find(".bootbox-body").html("<div class='msgcenter'><em></em><span>" + "您选择的UKEY与印章不符，请更换UKEY后重试" + "</span></div>");
                                        $(_this).find(".btn2").show().html("重试");
                                    } else {
                                        if (ukeys.PIN($("#unlockCode").val(), selectedUkey)) {
                                            var data = {
                                                "esealCode": esealCode,
                                                "oid": ukey_oid,
                                                "enterpriseCode": enterpriseCode
                                            };
                                            service.updateEsealStatus(data).done(function (data) {
                                                if (data.code == 0) {
                                                    var success = dialogsText.find(".success").html("已成功取消“" + esealFullName + "”的预挂失").get(0).outerHTML;
                                                    $(_this).find(".bootbox-body").html(success);
                                                    $(_this).find(".btn1,.btn2").hide();
                                                    setTimeout(
                                                        function () {
                                                            _this.modal("hide");
                                                            location.reload();
                                                        }, 3000);
                                                } else {
                                                    numInd = 0;
                                                    $(_this).find(".bootbox-body").html("<div class='msgcenter' style='font-size: 14px; white-space:nowrap;'><em></em><span>" + data.msg + "</span></div>");
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
        },
        //印章注销
        logout: function () {
            var numInd = this.model.get("numInd");
            var logoutEseal = dialogs.find(".logoutEseal")
            bootbox.dialog({
                backdrop: true,
                //closeButton: false,
                className: "common logoutEseal bigLogout",
                title: logoutEseal.find(".title")[0].outerHTML,
                message: logoutEseal.find(".log1")[0].outerHTML,
                buttons: {
                    cancel: {
                        label: "返回",
                        className: "btn1",
                        callback: function (result) {
                            //result.cancelable = false;
                        }
                    },
                    confirm: {
                        label: "继续",
                        className: "btn2",
                        callback: function (event) {
                            numInd++;
                            var _this = this;
                            if (true) {
                                var msg1 = logoutEseal.find(".msg1")[0].outerHTML
                                var msg2 = logoutEseal.find(".msg2")[0].outerHTML
                                // var msg3 = logoutEseal.find(".msg3")[0].outerHTML
                                var msg4 = logoutEseal.find(".msg4")[0].outerHTML
                                var msg5 = logoutEseal.find(".msg5")[0].outerHTML
                                var msg6 = logoutEseal.find(".msg6")[0].outerHTML
                                //var msg7 = logoutEseal.find(".msg7")[0].outerHTML
                                $(this).removeClass("bigLogout ")
                                //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                                $(this).find(".bootbox-body").html(msg2);
                                // $(this).find(".btn1,.btn2").hide();
                                if (numInd == 1) {
                                    var msg3 = logoutEseal.find(".msg1")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg1);
                                    $(_this).find(".btn1").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else if (numInd == 2) {
                                    var msg3 = logoutEseal.find(".msg1")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg1);
                                    $(_this).find(".btn1").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else if (numInd == 3) {
                                    var msg4 = logoutEseal.find(".msg4")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg4);
                                    $(_this).find(".btn1").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else if (numInd == 4) {
                                    var msg5 = logoutEseal.find(".msg5")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg5);
                                    $(_this).find(".btn1").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else if (numInd == 5) {
                                    var msg6 = logoutEseal.find(".msg6")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg6);
                                    $(_this).find(".btn1,.btn2").hide();
                                    setTimeout(function () {
                                        _this.modal('hide');
                                    }, 2000)
                                }

                            }
                            //this.modal('hide');
                            return false;
                        }
                    }
                }
            })
            return false;
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
                                        $(_this).find("#unlock-error").html("请输入6位或6位以上pin码");
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
        //印章管理列表
        listPage: function (pageNum, pageSize) {
            pageNum = pageNum || 1;
            pageSize = pageSize || 10;
            var querydata = {
                "enterpriseCode": this.enterpriseCode
            }
            service.getEsealList(pageNum, pageSize, querydata).done(function (res) {
                if (res.code != 0) {
                    var tempObj = {}
                    that.model.get("tplhtml").data = tempObj;
                    that.$el.empty().html(template.compile(tpl)(that.model.get("tplhtml")));
					$("#esealNav").remove();
					$(".eseallist").append("<div class='listResult'>" + res.msg + "</div>").css("margin-bottom", "20px")
                } else {
                    var tempObj = res.data;
                    that.model.set("totalPages", res.data.totalPages)
                    that.model.get("tplhtml").data = tempObj;
                    that.$el.empty().html(template.compile(tpl)(that.model.get("tplhtml")));
                    that.pagination(res.data.pageNum, res.data.totalPages, $("#esealNav"));
                    GetQueryStringBool = false;
                    if (res.data && (!res.data.list || res.data.list.length == 0)) {
                        $(".eseallist").append("<div class='listResult'>无电子印章信息</div>").css("margin-bottom", "20px");
                        $("#esealNav").remove();
                    }
                    //屏蔽非ODC的电子印章申请
                    var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                    //  isODC为1的时候是ODC登录的
                    if (!isODC) {
                        $("#step").hide();
                    }
                }
                if (pageNum == 1) {
                    $("li.PreviousPage").addClass("no");
                } else if (pageNum == res.data.totalPages) {
                    $("li.NextPage").addClass("no");
                } else {
                    $("li.PreviousPage,li.NextPage").removeClass("no");
                }
            })
        },
        // 点击上一页、下一页
        pagediv: function (val, totalPages) {
            if (val < 1) {
                val = 1;
                return;
            }
            if (val > totalPages) {
                val = totalPages;
                return;
            }
            if (val === this.current) {
                return;
            }
            this.listPage(val);
        },
        //pagination
        pagination: function (pageNumber, totalPages) {
            $("#pageLimit li.index").remove();
            var firstShowPage, maxShowPage = 5
            if (pageNumber <= 3) {
                firstShowPage = 1
            } else {
                firstShowPage = pageNumber - 2;
            }
            var lastShowPage = maxShowPage + firstShowPage - 1;
            if (lastShowPage > totalPages) {
                lastShowPage = totalPages;
            }
            this.model.get("tplhtml").count = [];
            for (var i = firstShowPage; i <= lastShowPage; i++) {
                var pageIndex = '<li class="index"><a>' + i + '</a></li>';
                $("#pageLimit .appendPage").before(pageIndex)
            };
            if (!this.active) {
                this.active = $(" #pageLimit .index").eq(0);
            } else {
                if (this.active.hasClass("NextPage")) {
                    this.active = $("#pageLimit .NextPage");
                }
                if (isNaN(this.active.find('a').text()) && this.active.prev().text() != this.model.get("totalPages")) {
                    this.active = $("#pageLimit .index").eq(0)
                }
                if (this.active.prev().text() == this.model.get("totalPages")) {
                    this.active = this.active.prev()
                }
                this.active = $("#pageLimit a:contains(" + this.active.find('a').text() + ")").parents("li");
            }
            this.active.addClass("active").siblings().removeClass("active")
        },
        currentPapge: function (e) {
            this.active = $(e.currentTarget);
            var pageNum = this.active.find("a").text()
            this.pagediv(pageNum, this.model.get("totalPages"));
        },
        PreviousPage: function () {
            this.active = "";
            this.pagediv(1, this.model.get("totalPages"))
        },
        NextPage: function (e) {
            this.active = $("#pageLimit .NextPage");
            console.log(this.model.get("totalPages"))
            this.pagediv(this.model.get("totalPages"), this.model.get("totalPages"))
        },
        step: function () {
            localStorage.stepNum = "#step1"
        }
    });
    return main;
});