define(
    [
        "text!./tpl/header.html",
        "text!./tpl/footer.html",
        "../../lib/service",
        "../../lib/ukeys",
        "bootbox",
        "text!../pub/tpl/dialog.html"
    ],
    function(header, footer, service, ukeys, bootbox, dialog) {
        var Backbone = require("backbone");
        var template = require("art-template");
        var dialogs = $(dialog);
        var main = Backbone.View.extend({
            el: "#main",
            initialize: function() {},
            render: function(pageTag) {
                var that = this;
                that.$el.empty().html();
                that.$el.append(template.compile(header, {})());
                that.$el.append(template.compile(footer, {})());
                that.pageTagChioce(pageTag);
                that.login();
            },
            events: {
                "click .rightbox a.locked": "lock",
                "click .rightbox a.logout": "logout"
            },
            pageTagChioce: function(pageTag) {
                $(".u-head .menu li a").removeClass("active");
                $(pageTag).addClass("active");
            },
            login: function() {
                var _this = this;
                if ($.cookie("loginadmin") === undefined) {
                    _this.logintip();
                }
            },
            logintip: function() {
                var _this = this;
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common logintip",
                    title: dialogs.find(".logintip .title")[0].outerHTML,
                    message: dialogs.find(".logintip .msgcenter")[0].outerHTML,
                    buttons: {
                        cancel: {
                            label: "我要登录",
                            className: "btn2",
                            callback: function(result) {
                                result.cancelable = window.open("login.html", "_self");
                            }
                        }
                    }
                });
                return false;
            },
            //退出
            logout: function() {
                var _this = this;
                bootbox.hideAll();
                bootbox.dialog({
                    backdrop: true,
                    closeButton: true,
                    className: "common",
                    title: "确认退出？",
                    message:'<div class="msgcenter"><em></em><span>确定现在退出账号吗？</span></div>',
                    buttons: {
                        cancel: {
                            label: "取消",
                            className: "btn1",
                            callback: function(result) {
                                result.cancelable = false;
                            }
                        },
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function(result) {
                                localStorage.clear();
                                $.removeCookie("logs_Decrypt");
                                $.removeCookie("loginadmin");
                                result.cancelable = window.open("login.html", "_self");
                            }
                        }
                    }
                });
                return false;
            },
            //解密
            lock: function() {
                var numInd = 0;
                var dialogsText = dialogs.find(".unlock");
                bootbox.hideAll();
                bootbox.dialog({
                    backdrop: true,
                    //closeButton: false,
                    className: "common unlock",
                    title: dialogsText.find(".title")[0].outerHTML,
                    message: dialogsText.find(".msg1")[0].outerHTML,
                    buttons: {
                        cancel: {
                            label: "取消",
                            className: "btn1",
                            callback: function(result) {
                                //console.log(result, "cancel")
                                result.cancelable = false;
                            }
                        },
                        confirm: {
                            label: "继续",
                            className: "btn2",
                            callback: function(event) {
                                numInd++;
                                var _this = this;
                                if (numInd == 1) {
                                    var msg4 = dialogsText.find(".msg4")[0].outerHTML;
                                    $(this).find(".bootbox-body").html(msg4);
                                    $(this).find(".btn1,.btn2").hide();
                                    setTimeout(function() {
                                        if (!ukeys.ukeyName().length) {
                                            numInd = 0;
                                            var msg3 = dialogsText.find(".msg3")[0].outerHTML;
                                            $(_this).find(".bootbox-body").html(msg3);
                                            $(_this).find(".btn1,.btn2").show();
                                            $(_this).find(".btn2").show().html("重试");
                                        } else {
                                            var msg6 = dialogsText.find(".msg6")[0].outerHTML;
                                            $(_this).find(".bootbox-body").html(msg6);
                                            $.each(ukeys.ukeyName(), function(ind,val) {
                                                $("#seleBook").append("<Option value='ind'>" + val + "</Option>");
                                            });
                                            $(_this).find(".btn1,.btn2").show();
                                            $(_this).find(".btn2").show().html("解密");
                                        }
                                    }, 1000);
                                } else if (numInd == 2) {
                                    // 验证KEY密码
                                    var selectedUkey = $("#seleBook option:selected").val();
                                    var unlockCode = $("#unlockCode").val();
                                    if (selectedUkey == "") {
                                        numInd = 1;
                                        $(_this).find("#seleBook-error").html("请选择一个证书");
                                        $(_this).find(".btn2").show().html("解密");
                                        $("#seleBook").change(function() {
                                            $("#seleBook-error").html("");
                                        });
                                    } else if (unlockCode.length < 6) {
                                        numInd = 1;
                                        $(_this).find("#unlock-error").html("请输入6位或6位以上pin码");
                                        $(_this).find(".btn2").show().html("解密");
                                        $("#unlockCode").keyup(function() {
                                            $("#unlock-error").html("");
                                        });
                                    } else {
                                        var selectedUkey = $("#seleBook option:selected").index() - 1;
                                        if(!ukeys.GetCertCount()){
                                            numInd = 1;
                                            $(_this).find("#unlock-error").html("未检测到ukey，请插入ukey后重试");
                                            $(_this).find(".btn2").show().html("重试");
                                            return false;
                                        };
                                        if (ukeys.PIN($("#unlockCode").val(),selectedUkey)) {
                                            var oid = ukeys.GetOid(selectedUkey);
                                            var esealCode = ukeys.esealCode($("#unlockCode").val(),selectedUkey)
                                            var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1 : 2;
                                            var randomNumKey = keyType == 1 ? oid : esealCode;
                                            var randomNum = ukeys.randomNum(randomNumKey,keyType);
                                            var PKSC7 = ukeys.dSignature(selectedUkey,randomNum,$("#unlockCode").val());
                                            localStorage.removeItem("dSignature");
                                            var enterpriseCode = $.cookie("loginadmin") && JSON.parse($.cookie("loginadmin")).user.enterpriseCode;
                                            console.log("证书标识：" + oid)
                                            console.log("印章编码：" + esealCode)
                                            console.log("随机码：" + randomNum)
                                            // console.log("签名：\n" + PKSC7)
                                            // document.write("获取客户端数字签名：\n" + PKSC7);
                                            if (!Boolean(PKSC7)) {
                                                numInd = 0;
                                                $(_this).find(".bootbox-body")
                                                    .html("<div class='msgcenter'><em></em><span>" + "无法获取证书签名，解密失败！" + "</span></div>"
                                                );
                                                $(_this).find(".btn2").show().html("重试");
                                            } else {
                                                var data = {
                                                    "esealCode": esealCode,
                                                    "oid": oid,
                                                    "enterpriseCode": enterpriseCode,
                                                    "PKSC7": PKSC7
                                                };
                                                service.commSignetLog(1, 1, data).done(function(data) {
                                                    if (data.code == 0) {
                                                            //解密后的信息更改存储在cookie里，和登录信息保持一致，不然不退出关闭浏览器再次登录日志请求出错 /tan 2018-01-20
                                                            var Decrypt = {
                                                                "logs_esealCode" : esealCode,
                                                                "logs_oid" : oid,
                                                                "logs_dSignature" : PKSC7
                                                            }
                                                            $.cookie("logs_Decrypt", JSON.stringify(Decrypt));
                                                            var success = dialogsText.find(".success")[0].outerHTML;
                                                            $(_this).find(".bootbox-body").html(success);
                                                            $(_this).find(".btn1,.btn2").hide();
                                                            setTimeout(
                                                                function() {
                                                                    _this.modal("hide");
                                                                    location.reload();
                                                                },3000 );
                                                        } else {
                                                            numInd = 0;
                                                            $(_this).find(".bootbox-body")
                                                                .html("<div class='msgcenter' style='font-size: 14px; white-space:nowrap;'><em></em><span>" + data.msg + "</span></div>"
                                                            );
                                                            $(_this).find(".btn2").show().html("重试");
                                                        }
                                                    });
                                            }
                                        } else {
                                            numInd = 1;
                                            var GetOid = ukeys.GetOid(selectedUkey);
                                            var data = {
                                                "oid": GetOid,
                                                "errorCode": 1
                                            };
                                            service.checkPIN(data).done(function(data) {
                                                if (data.code == 1) {
                                                    $(_this).find("#unlock-error").html(data.msg);
                                                    $(_this).find(".btn2").show().html("重试");
                                                }
                                                $("#unlockCode").change(function() {
                                                    $("#unlock-error").html("");
                                                });
                                            });
                                        }
                                    }
                                }

                                //this.modal('hide');
                                return false;
                            }
                        }
                    }
                });
                return false;
            }
        });
        return main;
    }
);
