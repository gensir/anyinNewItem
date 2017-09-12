import dialog from '../pub/tpl/dialog.html'
var dialogs = $($(dialog()).prop("outerHTML"));
import ukeys from '../../publicFun/ukeys';
var service = require('../../server/service').default;
var header = {
    init: function () {
        this.nav();
        this.login();
        $(".rightbox").on("click", "a.locked ", function () {
            header.lock()
        })
        $(".rightbox").on("click", "a.logout", function () {
            header.logout()
        })
    },
    arrPath: location.pathname.split(/\//),
    nav: function () {
        function toggle(ele) {
            $(".u-head .menu a").removeClass("active").parent("li").find(ele).addClass("active");
        }
        for (var i = 0; i < this.arrPath.length; i++) {
            if (/.html/.test(this.arrPath[i])) {
                switch (this.arrPath[i]) {
                    case "index.html": toggle(".nav1"); break;
                    case "admin.html": toggle(".nav2"); break;
                    case "orders.html": toggle(".nav3"); break;
                    case "logs.html": toggle(".nav4"); break;
                }
            }
        }
    },
    login() {
        var _this = this
        if ($.cookie('loginadmin') === undefined) {
            _this.logintip();
        }
    },
    logintip() {
        var _this = this
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
                    callback: function (result) {
                        result.cancelable = window.open('login.html', '_self');
                    }
                },
            }
        })
        return false;
    },
    //退出
    logout() {
        var _this = this
        bootbox.dialog({
            backdrop: true,
            closeButton: true,
            className: "common",
            title: '确认退出？',
            message: '<div class="msgcenter"><em></em><span>确定现在退出账号吗？</span></div>',
            buttons: {
                cancel: {
                    label: "取消",
                    className: "btn1",
                    callback: function (result) {
                        result.cancelable = false;
                    }
                },
                confirm: {
                    label: "确定",
                    className: "btn2",
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
    //解密
    lock: function () {
        var _outthis = this;
        var numInd = 0;
        var dialogsText = dialogs.find(".unlock")
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
                    callback: function (result) {
                        //console.log(result, "cancel")
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
                            var msg4 = dialogsText.find(".msg4")[0].outerHTML
                            $(this).find(".bootbox-body").html(msg4);
                            $(this).find(".btn1,.btn2").hide();
                            setTimeout(function () {
                                if (!ukeys.ukeyName().length) {
                                    numInd = 0;
                                    var msg3 = dialogsText.find(".msg3")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg3);
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else {
                                    var msg6 = dialogsText.find(".msg6")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(msg6);
                                    $.each(ukeys.ukeyName(), function (ind, val) {
                                        $("#seleBook").append("<Option value="+ val +">" + val + "</Option>")
                                    })
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("解密");
                                }
                            }, 1000)
                        } else if (numInd == 2) {
                            // 验证KEY密码
                            var selectedUkey = $("#seleBook option:selected").val();
                            var unlockCode = $("#unlockCode").val();
                            if (selectedUkey == "") {
                                numInd = 1;                                
                                $(_this).find("#seleBook-error").html("请选择一个证书");
                                $(_this).find(".btn2").show().html("解密");
                                $("#seleBook").change(function(){
                                    $("#seleBook-error").html("");
                                });  
                            } else if (unlockCode.length < 6) {
                                numInd = 1;                                
                                $(_this).find("#unlock-error").html("请输入6位以上PIN码");
                                $(_this).find(".btn2").show().html("解密");
                                $("#unlockCode").keyup(function () {
                                    $("#unlock-error").html("");
                                });   
                            } else {
                                var selectedUkey = $("#seleBook option:selected").index() - 1;
                                if (ukeys.PIN($("#unlockCode").val(), selectedUkey)) {
                                    var esealCode = ukeys.esealCode($("#unlockCode").val(), selectedUkey);
                                    var randomNum = ukeys.randomNum(esealCode);
                                    var dSignature = ukeys.dSignature(selectedUkey, randomNum);
                                    var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
                                    //console.log("印章编码：" + esealCode)
                                    //console.log("随机码：" + randomNum)
                                    //console.log("签名：\n" + dSignature)
                                    //document.write("获取客户端数字签名：\n" + dSignature);
                                    var data = {
                                        "esealCode": esealCode,
                                        "enterpriseCode": enterpriseCode,
                                        "PKSC7": dSignature,
                                    };
                                    service.commSignetLog(1, 1, data).done(res => {
                                        if (res.code == 0) {
                                            localStorage.esealCode = esealCode;
                                            localStorage.dSignature = dSignature;                                            
                                            var success = dialogsText.find(".success")[0].outerHTML
                                            $(_this).find(".bootbox-body").html(success);
                                            $(_this).find(".btn1,.btn2").hide();
                                            setTimeout(function () {
                                                _this.modal('hide');
                                                location.reload();
                                            }, 1000)
                                        } else {
                                            numInd = 0;
                                            // var msg7 = dialogsText.find(".msg7")[0].outerHTML
                                            // $(_this).find(".bootbox-body").html(msg7);
                                            $(_this).find(".bootbox-body").html("<div class='msgcenter' style='font-size: 14px; white-space:nowrap;'><em></em><span>" + res.msg + "</span></div>");
                                            $(_this).find(".btn2").show().html("重试");
                                        }
                                    });
                                } else {
                                    numInd = 1;
                                    var GetOid = ukeys.GetOid(selectedUkey);
                                    localStorage.GetOid = GetOid;
                                    var data = {
                                        "oid": GetOid,
                                        "errorCode": 1
                                    };
                                    service.checkPIN(data).done(res => {
                                        if (res.code == 1) {
                                            $(_this).find("#unlock-error").html(res.msg);
                                            $(_this).find(".btn2").show().html("重试");
                                        }
                                        $("#unlockCode").change(function () {
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
        })
        return false;
    }

}
header.init();