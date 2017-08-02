import dialog from '../pub/tpl/dialog.html'
var dialogs = $($(dialog()).prop("outerHTML"));
import ukeys from '../../publicFun/ukeys';
var header = {
    init: function () {
        this.nav();
        $(".rightbox").on("click", "a.locked ", function () {
            header.lock()
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
                    label: "返回",
                    className: "btn1",
                    callback: function (result) {
                        console.log(result, "cancel")
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
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
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
                                        $("#seleBook").append("<Option>" + val + "</Option>")
                                    })
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("解密");
                                }
                            }, 1000)
                        } else if (numInd == 2) {
                            // 验证KEY密码
                                var selectedUkey=$("#seleBook option:selected").index() - 1
                                if (ukeys.PIN($("#unlockCode").val(), selectedUkey)) {
                                    var esealCode = ukeys.esealCode($("#unlockCode").val(),selectedUkey)
                                    var randomNum = ukeys.randomNum(esealCode)
                                    var dSignature = ukeys.dSignature(selectedUkey , randomNum)
                                    // console.log("印章编码：" + esealCode)
                                    // console.log("随机码：" + randomNum)
                                    // console.log("签名：\n" + dSignature)
                                    localStorage.esealCode = esealCode
                                    localStorage.dSignature = dSignature
                                    //document.write("获取客户端数字签名：\n" + dSignature);
                                    var success = dialogsText.find(".success")[0].outerHTML
                                    $(_this).find(".bootbox-body").html(success);
                                    $(_this).find(".btn1,.btn2").hide();
                                    setTimeout(function () {
                                        _this.modal('hide');
                                        location.reload();
                                    }, 1200)
                                } else {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("PIN码不正确，请重新输入")
                                    $(_this).find(".btn2").show().html("重试");
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