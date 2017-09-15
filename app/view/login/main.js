var tpl = require('./tpl/main.html');
var service = require('../../server/service').default;
import ukeys from '../../publicFun/ukeys';
import dialog from '../pub/tpl/dialog.html';
var dialogs = $($(dialog()).prop("outerHTML"));
var main = Backbone.View.extend({
    el: "body",
    initialize() {
        this.render();
    },
    events: {
        'click #phoneLogin': 'phoneLogin',
        'click #ukeyLogin': 'ukeyLogin',
        'click .goregister': 'goregister',
        'change #seleBook': 'seleBook',
        'keyup .phoneKeyup': 'phoneKeyup',
        'keyup .ukeyKeyup': 'ukeyKeyup'
    },
    seleBook() {
        //$("#seleBook option").eq(0).attr("disabled","disabled")
    },
    render() {
        var _this = this;
        if ((!!window.ActiveXObject || "ActiveXObject" in window) && (navigator.userAgent.indexOf('Opera') < 0)) {
            this.$el.html(tpl({
                list: ukeys.ukeyName()
            }));
        } else {
            this.$el.html(tpl({
                list: null
            }));
        }
        this.toggleTab();
    },
    ukeyKeyup(event) {
        var event = event || window.event;
        var keyCode = event.keyCode || event.which; // 按键的keyCode
        if (keyCode == 13) {
            this.ukeyLogin(event, "ukeyLogin")
            return false;
        }

    },
    phoneKeyup(event) {
        var event = event || window.event;
        var keyCode = event.keyCode || event.which; // 按键的keyCode
        if (keyCode == 13) {
            this.phoneLogin(event, "phoneLogin")
            return false;
        }

    },
    toggleTab() {
        $(".head div.but").on("click", "span", function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(".mainbody ul li").eq($(this).index()).addClass("active").siblings().removeClass("active");
        })
    },
    goregister() {
        window.open('register.html#step1', '_self')
    },
    ukeyLogin(event, itemEle) {
        this.model.set({ "clickEle": itemEle || $(event.target).data('id') })
        var isValid = this.model.isValid();
        if (isValid) {
            return;
        }
        var selectedUkey = $("#seleBook option:selected").index() - 1
        if (selectedUkey == -1) {
            return;
        }
        var checkResult = ukeys.PIN($("#pinwd").val(), selectedUkey)
        var randomNum = ukeys.randomNum(ukeys.esealCode($("#pinwd").val(), selectedUkey))
        var PKSC7 = ukeys.dSignature(selectedUkey, randomNum)
        var data = {
            "loginType": 2,
            "esealCode": checkResult == true ? ukeys.esealCode($("#pinwd").val(), selectedUkey) : "",
            "codeError": checkResult ? 0 : 1,
            "entryptCert": checkResult == true ? ukeys.dCertificate(selectedUkey) : "",
            "keyType": checkResult == true ? ukeys.getCertType(selectedUkey) : "",
            "oid": ukeys.GetOid(selectedUkey),
            "enterpriseCode": ukeys.GetenterpriseCode(selectedUkey),
            "randomNum": randomNum,
            "signature": PKSC7,
        }
        if (PKSC7 != "") {
            service.userlogin(data).done(function (data) {
                if (!data.msg && data.code != 0) {
                    $.verify("ukeytip", "#seleBook", "您输入的用户名或密码错误");
                    return
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
                                    callback: function (result) {
                                        result.cancelable = false;
                                    }
                                },
                                confirm: {
                                    label: "继续",
                                    className: "btn2 sureLoss",
                                    callback: function (event) {
                                        numInd++;
                                        if (numInd == 1) {
                                            numInd = 0
                                            localStorage.firmId = data.data.firmId;
                                            localStorage.pointCode = data.data.pointCode;
                                            window.open('register.html#step2', '_self');
                                        } else {
                                            this.modal('hide');
                                        }
                                        return false;
                                    }
                                }
                            }
                        });
                        return
                    } else if (data.data.pointCode == 101 || data.data.pointCode == 104) {
                        var numInd = 0;
                        var dialog = bootbox.dialog({
                            backdrop: true,
                            //closeButton: false,
                            className: "common loss",
                            title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                            message: dialogs.find(".ukeyLoginTip .msg1.renew")[0].outerHTML,
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
                                        if (numInd == 1) {
                                            numInd = 0
                                            localStorage.firmId = data.data.firmId;
                                            localStorage.pointCode = data.data.pointCode;
                                            window.open('admin.html#renew', '_self');
                                        } else {
                                            this.modal('hide');
                                        }
                                        return false;
                                    }
                                }
                            }
                        });
                        return
                    } else if (data.data.pointCode == 102) {
                        var numInd = 0;
                        var dialog = bootbox.dialog({
                            backdrop: true,
                            //closeButton: false,
                            className: "common loss",
                            title: dialogs.find(".ukeyLoginTip .title")[0].outerHTML,
                            message: dialogs.find(".ukeyLoginTip .msg1.invalid")[0].outerHTML,
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
                                        if (numInd == 1) {
                                            numInd = 0
                                            localStorage.firmId = data.data.firmId;
                                            localStorage.pointCode = data.data.pointCode;
                                            window.open('admin.html#renew', '_self');
                                        } else {
                                            this.modal('hide');
                                        }
                                        return false;
                                    }
                                }
                            }
                        });
                        return
                    }

                    $.cookie('loginadmin', JSON.stringify(data.data))
                    window.open("index.html", "_self");
                } else if (data.code == 4) {
                    $.verify("passwd", "#passwd", "后台返回error");
                } else if (data.code == "500") {
                    $.verify("ukeytip", "#seleBook", data.msg);
                } else {
                    $.verify("ukeytip", "#seleBook", data.msg);
                }
                //window.open("index.html", "_self")
            })
        } else {
            $.verify("ukeytip", "#pinwd", "获取签名失败，请确认PIN输入正确");
        }

    },
    phoneLogin(event, itemEle) {
        // this.model.set({ 'pinwdError': this.$el.find("#pinwd").val(), validate: true });
        this.model.set({ "clickEle": itemEle || $(event.target).data('id') })
        var isValid = this.model.isValid();
        if (isValid) {
            return;
        }
        var data = {
            "mobile": $("#userName").val() || "13527761888,13926993742",
            "password": $("#passwd").val() || "123456",
            "captcha": "jskx",
            "loginType": 1
        }
        service.userlogin(data).done(function (data) {
            if (!data.msg && data.code != 0) {
                $.verify("phone", "#userName", "您输入的用户名或密码错误");
                return
            }
            if (data.code === 0) {
                $.cookie('loginadmin', JSON.stringify(data.data))
                window.open("index.html", "_self");
            } else if (data.code == "100") {
                $.verify("phone", "#userName", data.msg);
            } else if (data.code == "500") {
                $.verify("phone", "#userName", data.msg);
            }
        })
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
})
module.exports = main;