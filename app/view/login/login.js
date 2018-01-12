define(
    [
        "text!./tpl/login.html",
        "../../lib/service",
        "../../lib/ukeys",
        "text!../pub/tpl/dialog.html",
        "../../lib/public",
    ],
    function(tpl, service, ukeys, dialog, publicUtil) {
        var Backbone = require("backbone");
        var template = require("art-template");
        var bootbox = require("bootbox")
        var placeholder = publicUtil.placeholder;
        var dialogs = $(dialog);

        var main = Backbone.View.extend({
            el: "#main",
            initialize: function() {},
            events: {
                "click #phoneLogin": "phoneLogin",
                "click #ukeyLogin": "ukeyLogin",
                "click .goregister": "goregister",
                "change #seleBook": "seleBook",
                "keyup .phoneKeyup": "phoneKeyup",
                "keyup .ukeyKeyup": "ukeyKeyup"
            },
            render: function(param) {
                var that = this;
                that.$el.empty().html(template.compile(tpl, {})());
                if ((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0) {
                    that.$el.html(template.compile(tpl)({
                        list: ukeys.GetCertCount() && ukeys.ukeyName()
                    }));
                    $(".tipIE").hide();
                } else {
                    that.$el.html(template.compile(tpl)({}));
                    $(".tipIE").show();
                }
                that.toggleTab();
                placeholder();
            },
            ukeyKeyup: function(event) {
                var event = event || window.event;
                var keyCode = event.keyCode || event.which; // 按键的keyCode
                if (keyCode == 13) {
                    this.ukeyLogin(event, "ukeyLogin");
                    return false;
                }
            },
            phoneKeyup: function(event) {
                var event = event || window.event;
                var keyCode = event.keyCode || event.which; // 按键的keyCode
                if (keyCode == 13) {
                    this.phoneLogin(event, "phoneLogin");
                    return false;
                }
            },
            toggleTab: function() {
                $(".head div.but").on("click", "span", function() {
                    $(this).addClass("active").siblings().removeClass("active");
                    $(".mainbody ul li").eq($(this).index()).addClass("active").siblings().removeClass("active");
                });
            },
            goregister: function() {
                window.open("register.html#step1", "_self");
            },
            ukeyLogin: function(event, itemEle) {
                if(!ukeys.GetCertCount()){
                    $.verify("ukeytip", "#seleBook", "未检测到ukey,请插入ukey后重试");
                    return;
                }
                var that = this;
                that.model.set({
                    clickEle: itemEle || $(event.target).data("id")
                });
                var isValid = that.model.isValid();
                if (isValid) {
                    return;
                }
                var selectedUkey = $("#seleBook option:selected").index() - 1;
                if (selectedUkey == -1) {
                    return;
                }
                $("#ukeyLogin").attr("disabled",true).css('cursor','no-drop');
                var checkResult = ukeys.PIN($("#pinwd").val(), selectedUkey);
                var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1 : 2;
                var oid = ukeys.GetOid(selectedUkey);
                var esealCode = ukeys.esealCode($("#pinwd").val(), selectedUkey);
                var randomNumKey = keyType == 1 ? oid : esealCode;
                if (randomNumKey) {
                    var randomNum = ukeys.randomNum(randomNumKey, keyType);
                }
                var PKSC7 = ukeys.dSignature(selectedUkey, randomNum, $("#pinwd").val());

                // localStorage.publicKey = ukeys.dCertPublicKey(selectedUkey);
                var data = {
                    loginType: 2,
                    esealCode: checkResult == true ? esealCode : "",
                    codeError: checkResult ? 0 : 1,
                    entryptCert: checkResult == true ? ukeys.dCertificate(selectedUkey) : "",
                    keyType: checkResult == true ? keyType : "",
                    oid: oid,
                    enterpriseCode: ukeys.GetenterpriseCode(selectedUkey),
                    randomNum: randomNum,
                    signature: PKSC7,
                    signCertificateSn: ukeys.getCertSignSN(selectedUkey)
                };
                if(!ukeys.GetCertCount()){
                    $.verify("ukeytip", "#seleBook", "未检测到ukey,请插入ukey后重试");
                    return false;
                };
                service.userlogin(data).done(function(data) {
                    $("#ukeyLogin").attr("disabled",false).css('cursor','default');
                    if (!data.msg && data.code != 0) {
                        $.verify("ukeytip", "#seleBook", "您输入的用户名或密码错误");
                        return false;
                    }
                    if (data.code === 0) {
                        //$.verify("passwd", "#passwd");
                        if (data.data.pointCode == 100) {
                            var numInd = 0;
                            var dialog = bootbox.dialog({
                                backdrop: true,
                                //closeButton: false,
                                className: "common loss",
                                title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                                message: dialogs.find(".ukeyLoginTip .msg1")[0].outerHTML,
                                buttons: {
                                    cancel: {
                                        label: "返回",
                                        className: "btn1",
                                        callback: function(result) {
                                            result.cancelable = false;
                                        }
                                    },
                                    confirm: {
                                        label: "确定",
                                        className: "btn2 sureLoss",
                                        callback: function(event) {
                                            var loginODC = data.data;
                                            localStorage.firmId = loginODC.firmId;
                                            localStorage.pointCode = loginODC.pointCode;
                                            loginODC.enterpriseName = loginODC.enterpriseName || $("#seleBook option:selected").text();
                                            loginODC.oid = oid;
                                            loginODC.esealCode = esealCode;
                                            localStorage.loginODC = JSON.stringify(loginODC);
                                            window.open("register.html#step2", "_self");
                                            return false;
                                        }
                                    }
                                }
                            });
                            return;
                        } else if (data.data.pointCode == 101) {
                            var numInd = 0;
                            var dialog = bootbox.dialog({
                                backdrop: true,
                                //closeButton: false,
                                className: "common loss",
                                title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                                message: dialogs.find(".ukeyLoginTip .msgcenter.updata_key")[0].outerHTML,
                                buttons: {
                                    cancel: {
                                        label: "返回",
                                        className: "btn1",
                                        callback: function(result) {
                                            result.cancelable = false;
                                        }
                                    },
                                    confirm: {
                                        label: "确定",
                                        className: "btn2 sureLoss",
                                        callback: function(event) {
                                            var l_esealcode = data.data.esealCode;
                                            var l_oid = data.data.oid;
                                            var l_keytype = keyType;
                                            $.cookie("loginadmin", JSON.stringify(data.data));
                                            window.open("admin.html#update_key?esealcode=" + l_esealcode + "&oid=" + l_oid +"keyType=" + l_keytype, "_self");
                                            return false;
                                        }
                                    }
                                }
                            });
                            return;
                        } else if (data.data.pointCode == 102) {
                            var numInd = 0;
                            var dialog = bootbox.dialog({
                                backdrop: true,
                                //closeButton: false,
                                className: "common loss",
                                title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                                message: dialogs.find(".ukeyLoginTip .msgcenter.invalid")[0].outerHTML,
                                buttons: {
                                    cancel: {
                                        label: "返回",
                                        className: "btn1",
                                        callback: function(result) {
                                            result.cancelable = false;
                                        }
                                    },
                                    confirm: {
                                        label: "确定",
                                        className: "btn2 sureLoss",
                                        callback: function(event) {
                                            var l_esealcode = data.data.esealCode;
                                            var l_oid = data.data.oid;
                                            localStorage.u_keyType = keyType;
                                            $.cookie("loginadmin", JSON.stringify(data.data));
                                            window.open("admin.html#renew?esealcode=" + l_esealcode + "&oid=" + l_oid, "_self");
                                            return false;
                                        }
                                    }
                                }
                            });
                            return;
                        } else if (data.data.pointCode == 104) {
                            var numInd = 0;
                            var dialog = bootbox.dialog({
                                backdrop: true,
                                //closeButton: false,
                                className: "common loss",
                                title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                                message: dialogs.find(".ukeyLoginTip .msgcenter.renew")[0].outerHTML,
                                buttons: {
                                    cancel: {
                                        label: "返回",
                                        className: "btn1",
                                        callback: function(result) {
                                            result.cancelable = false;
                                        }
                                    },
                                    confirm: {
                                        label: "确定",
                                        className: "btn2 sureLoss",
                                        callback: function(event) {
                                            var l_esealcode = data.data.esealCode;
                                            var l_oid = data.data.oid;
                                            localStorage.u_keyType = keyType;
                                            $.cookie("loginadmin", JSON.stringify(data.data));
                                            window.open("admin.html#renew?esealcode=" + l_esealcode + "&oid=" + l_oid, "_self");
                                            return false;
                                        }
                                    }
                                }
                            });
                            return;
                        } else if (data.data.pointCode == 106) {
                            localStorage.ODCoid = oid;
                        }
                        $.cookie("loginadmin", JSON.stringify(data.data));
                        window.open("index.html", "_self");
                    } else if (data.code == 4) {
                        $.verify("passwd", "#passwd", "后台返回error");
                    } else if (data.code == "500") {
                        $.verify("ukeytip", "#seleBook", data.msg);
                    } else {
                        $.verify("ukeytip", "#seleBook", data.msg);
                    }
                    if (!Boolean(PKSC7)) {
                        //$.verify("ukeytip", "#pinwd", "ukey异常，获取客户端数字签名失败");
                    }
                });

            },
            phoneLogin: function(event, itemEle) {
                // this.model.set({ 'pinwdError': this.$el.find("#pinwd").val(), validate: true });
                this.model.set({
                    clickEle: itemEle || $(event.target).data("id")
                });
                var isValid = this.model.isValid();
                if (isValid) {
                    return;
                }
                $("#phoneLogin").attr("disabled",true).css('cursor','no-drop');
                var data = {
                    mobile: $("#userName").val() || "13527761888,13926993742",
                    password: $("#passwd").val() || "123456",
                    captcha: "jskx",
                    loginType: 1
                };
                service.userlogin(data).done(function(data) {
                    $("#phoneLogin").attr("disabled",false).css('cursor','default');
                    if (!data.msg && data.code != 0) {
                        $.verify("phone", "#userName", "您输入的用户名或密码错误");
                        return;
                    }
                    if (data.code === 0) {
                        $.cookie("loginadmin", JSON.stringify(data.data));
                        window.location.href = "index.html";
                    } else if (data.code == "100") {
                        $.verify("phone", "#userName", data.msg);
                    } else if (data.code == "500") {
                        $.verify("phone", "#userName", data.msg);
                    }
                });
                // bootbox.dialog({
                //     closeButton: false,
                //     className: "realName",
                //     title: "<div class='title'>未实名提示</div>",
                //     message: "<div class='message'>您尚未创建企业账号</br>以下将引导您创建企业账号，并与当前UKEY绑定</div>",
                //     buttons: {
                //         cancel: {
                //             label: "返回",
                //             className: "btn1"
                //         },
                //         confirm: {
                //             label: "继续",
                //             className: "btn2",

                //             callback: function () {
                //                 $(this).find(".message").html(123);
                //                 console.log($(this).find(".message").html())
                //                 if (i = 5) {
                //                     return false;
                //                 }

                //             }
                //         }
                //     }
                // })
            }
        });
        return main;
    }
);