import tpl from './tpl/list.html'
import dialog from '../pub/tpl/dialog.html'
import { sendmsg } from '../../publicFun/public.js'
import { GetQueryString } from '../../publicFun/public.js'
import ukeys from '../../publicFun/ukeys';
var service = require('../../server/service').default;
var dialogs = $($(dialog()).prop("outerHTML"));
var GetQueryStringBool = true;
var mobile = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.mobile
var list = Backbone.View.extend({
    el: '.contents',
    initialize() {
        this.firmId = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId
        this.enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode

    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .eseallist .renew': 'renew',
        'click .eseallist .list>.nav .loss,.eseallist .list>.toggle>.nav>.n3 .loss': 'loss',
        'click .eseallist .list>.nav .cancelloss': 'cancelloss',
        'click .eseallist .list>.nav .unfreeze': 'unfreeze',
        'click .eseallist .list>.nav .logout': 'logout',
        'click .topseal .boxmodel span': 'toggleTab',
        'click .license .accordion .nav .shut': 'shut',
        'click .license .accordion .nav .open': 'open',
        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
        'click .pagination .NextPage:not(".no")': 'NextPage',
        'click .pagination .index': 'currentPapge',
        'click #step': 'step'
    },
    render: function (query) {
        $(".container").empty();
        this.listPage();
        if (!firmId && $.cookie('loginadmin') !== undefined) {
            bootbox.alert("获取单位id异常，无法完成ODC注册", function () { window.open('login.html', '_self'); })
            return;
        }
        //this.licenselist()

    },
    toggleList(event) {
        var _this = event.currentTarget
        var ind = $(_this).parent(".list").index();
        $(".eseallist .list .toggle").slideUp();
        var toggle = $(_this).parent(".list").find(".toggle");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
        } else {
            toggle.slideUp();
        }
    },
    toggleTab(event, license) {
        var _this = license || event.currentTarget;
        $(_this).addClass("active").siblings().removeClass("active");
        $(".mainbody").eq($(_this).index()).addClass("active").siblings(".mainbody").removeClass("active");
        if ($(_this)[0].id == "loginset") {
            this.active = ""
            this.licenselist(1)
        } else {
            this.active = ""
            this.listPage(1);
        }
        // if (GetQueryString("page") == "license" || $(_this)[0].id == "loginset") {
        //     alert($(_this)[0].id)
        //     this.licenselist()
        //     this.toggleTab(event, $("#loginset"))
        // }
    },
    getSealName(target) {
        var _this = target.currentTarget;
        var ind = $(_this).parents(".list").index();
        return this.model.get("tplhtml").loginlist[ind].esealFullName;
    },
    shut(e) {
        // function getName() {
        //     var _this = e.currentTarget;
        //     var ind = $(_this).parents(".list").index();
        //     return this.model.get("tplhtml").loginlist[ind].esealFullName;
        // }
        if (!ukeys.issupport()) {
            return false;
        }
        var _that = this, listdata = _that.model.get("tplhtml").loginlist[$(e.currentTarget).parents(".list").index()]
        var numInd = this.model.get("numInd");
        var dialogsText = dialogs.find(".closeAllow");
        service.licenseLast({ enterpriseCode: this.enterpriseCode }).done((res) => {
            _that.licenseLast = res.data
        })
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "closeAllow common",
            title: dialogsText.find(".title")[0].outerHTML,
            message: (_that.licenseLast <= 1) ? dialogsText.find(".msgcenter")[0].outerHTML : dialogsText.find(".msg1.closeEseal").find("span").text('"' + _that.getSealName(e) + '"').end()[0].outerHTML,
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
                    className: (_that.licenseLast <= 1) ? "btn2 closeAllowbtn2" : "btn2",
                    callback: function (event) {
                        numInd++;
                        var _this = this;
                        var msg3 = dialogsText.find(".msg3")[0].outerHTML
                        var msg4 = dialogsText.find(".msg4")[0].outerHTML
                        var msg6 = dialogsText.find(".msg6")[0].outerHTML
                        if (numInd == 1) {
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg4);
                            $(this).find(".btn1,.btn2").hide();
                            setTimeout(function () {
                                if (ukeys.GetCertCount() == 0) {
                                    numInd = 0;
                                    $(_this).find(".bootbox-body").html(msg3);
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else {
                                    $(_this).find(".bootbox-body").html(msg6);
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("继续");
                                    $.each(ukeys.ukeyName(), function (ind, val) {
                                        $(_this).find("#seleBook").append("<option>" + val + "</option>")
                                    })

                                }
                            }, 1000)
                        } else if (numInd == 2) {
                            // 验证KEY密码
                            var getPIN = $("#closeCode").val(), selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
                            if (ukeys.PIN($("#closeCode").val(), 0)) {
                                if (listdata.esealCode != ukeys.esealCode(getPIN, selectedUkey)) {
                                    $(_this).find(".bootbox-body").html(msg4).end().find(".msg4").text("您插入的UKEY与所选UKEY不符，请重新插入");
                                    $(_this).find(".btn2").show().html("重试");
                                    numInd = 0;
                                    $(_this).find(".btn1,.btn2").show();
                                    return false;
                                }
                                var data = {
                                    "esealCode": listdata.esealCode,
                                    "keyStatus": Number(!(listdata.keyStatus))
                                }
                                service.loginLicense(data).done((res) => {
                                    if (res.code == 0) {
                                        var success = dialogsText.find(".success").html("已成功关闭" + listdata.esealFullName + "的登录权限").get(0).outerHTML
                                        $(_this).find(".bootbox-body").html(success);
                                        $(_this).find(".btn1,.btn2").hide();
                                        window.open("admin.html?page=license", "_self")
                                    } else {
                                        var success = dialogsText.find(".success").css("color", "red").html(res.msg).get(0).outerHTML
                                        $(_this).find(".bootbox-body").html(success);
                                        $(_this).find(".btn1,.btn2").hide();
                                    }

                                    setTimeout(function () {
                                        window.open("admin.html?page=license", "_self")
                                        _this.modal('hide');
                                    }, 1500)
                                })
                            } else {
                                numInd = 1;
                                var GetOid = ukeys.GetOid(selectedUkey);
                                var data = {
                                    "oid": GetOid,
                                    "errorCode": 1
                                };
                                service.checkPIN(data).done(res => {
                                    if (res.code == 1) {
                                        $(_this).find("#closeCode-error").html(res.msg);
                                        $(_this).find(".btn2").show().html("重试");
                                    }
                                });
                            }
                        }
                        return false;
                    }
                }
            }
        })
        return false;
    },
    open(e) {
        if (!ukeys.issupport()) {
            return false;
        }
        var _that = this, listdata = _that.model.get("tplhtml").loginlist[$(e.currentTarget).parents(".list").index()]
        var numInd = this.model.get("numInd");
        var dialogsText = dialogs.find(".openAllow");
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "openAllow common",
            title: dialogsText.find(".title")[0].outerHTML,
            message: dialogsText.find(".msg1").find("span").text('"' + _that.getSealName(e) + '"').end()[0].outerHTML,
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
                    className: "btn2",
                    callback: function (event) {
                        numInd++;
                        var _this = this;
                        var msg3 = dialogsText.find(".msg3")[0].outerHTML
                        var msg4 = dialogsText.find(".msg4")[0].outerHTML
                        var msg6 = dialogsText.find(".msg6")[0].outerHTML
                        if (numInd == 1) {
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg4);
                            $(this).find(".btn1,.btn2").hide();
                            setTimeout(function () {
                                if (ukeys.GetCertCount() == 0) {
                                    numInd = 0;
                                    $(_this).find(".bootbox-body").html(msg3);
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("重试");
                                } else {
                                    $(_this).find(".bootbox-body").html(msg6);
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("继续");
                                    $.each(ukeys.ukeyName(), function (ind, val) {
                                        $(_this).find("#seleBook").append("<option>" + val + "</option>")
                                    })

                                }
                            }, 1000)
                        } else if (numInd == 2) {
                            // 验证KEY密码
                            var getPIN = $("#openCode").val(), selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
                            if (ukeys.PIN($("#openCode").val(), 0)) {
                                if (listdata.esealCode != ukeys.esealCode(getPIN, selectedUkey)) {
                                    $(_this).find(".bootbox-body").html(msg4).end().find(".msg4").text("您插入的UKEY与所选UKEY不符，请重新插入");
                                    $(_this).find(".btn2").show().html("重试");
                                    numInd = 0;
                                    $(_this).find(".btn1,.btn2").show();
                                    return false;
                                }
                                var data = {
                                    "esealCode": listdata.esealCode,
                                    "keyStatus": Number(!(listdata.keyStatus))
                                }
                                service.loginLicense(data).done((res) => {
                                    if (res.code == 0) {
                                        var success = dialogsText.find(".success").html("已成功开启" + listdata.esealFullName + "的登录权限").get(0).outerHTML
                                        $(_this).find(".bootbox-body").html(success);
                                        $(_this).find(".btn1,.btn2").hide();
                                    } else {
                                        var success = dialogsText.find(".success").css("color", "red").html(res.msg).get(0).outerHTML
                                        $(_this).find(".bootbox-body").html(success);
                                        $(_this).find(".btn1,.btn2").hide();
                                    }
                                    setTimeout(function () {
                                        window.open("admin.html?page=license", "_self")
                                        _this.modal('hide');
                                    }, 1500)
                                })
                            } else {
                                numInd = 1;
                                var GetOid = ukeys.GetOid(selectedUkey);
                                var data = {
                                    "oid": GetOid,
                                    "errorCode": 1
                                };
                                service.checkPIN(data).done(res => {
                                    if (res.code == 1) {
                                        $(_this).find("#openCode-error").html(res.msg);
                                        $(_this).find(".btn2").show().html("重试");
                                    }
                                });

                                //$(_this).find("#openCode-error").html("PIN码不正确，请重试")
                                //$(_this).find(".btn2").show().html("重试");
                            }
                        }
                        return false;
                    }
                }
            }
        })
        return false;
    },
    //预挂失
    loss(event) {
        var _this = this;
        event.stopPropagation();
        var status = $(event.currentTarget).data('status');
        var esealFullName = $(event.currentTarget).data('name');
        var esealCode = $(event.currentTarget).data('code');
        var numInd = this.model.get("numInd");
        if (status == 1 || status == 6 || status == 7) {
            var dialog = bootbox.dialog({
                backdrop: true,
                //closeButton: false,
                className: "common loss",
                title: dialogs.find(".lossEseal .title")[0].outerHTML,
                // message: dialogs.find(".lossEseal .msg1")[0].outerHTML,
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
                                $(this).find(".bootbox-body").html(msg2);
                                sendmsg($(this).find("#resend"));
                                service.getSMSVerifCode(mobile).done(res => {
                                    if (res.code == 0) {
                                        console.log("短信发送成功")
                                    } else {
                                        $("#codetip").html(res.msg).css({ "color": "red" });
                                    }
                                })
                                $(this).find("#resend").unbind().click(res => {
                                    sendmsg($(this).find("#resend"));
                                    service.getSMSVerifCode(mobile).done(res => {
                                        if (res.code == 0) {
                                            console.log("短信重新发送成功")
                                        } else {
                                            $("#codetip").html(res.msg).css({ "color": "red" });
                                        }
                                    })
                                })
                            } else if (numInd == 2) {
                                // let ele = $(this).find(".sureLoss");
                                // ele.attr("data-id", "lossCheck")
                                // _this.model.set({ "clickEle": ele.data('id') })
                                // var isValid = _this.model.isValid();
                                // if (isValid) {
                                //     numInd--
                                //     $(".checkSmsCode").css({ "border-color": "red" })
                                //     return false;
                                // } else {
                                //     $(".checkSmsCode").css({ "border-color": "#ccc" })
                                // }
                                var code = $(this).find(".checkSmsCode").val();
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
                                        $(this).find(".btn2").show().html("确定");
                                        $(this).find(".btn1").hide();
                                        $(this).find(".bootbox-body").html('<div class="msg3" style="color:#333">已成功预挂失“' + esealFullName + '”，请在7个工作日内携带法人身份证、营业执照（副本）前往门店完成挂失操作。</div>');
                                    } else {
                                        var data = {
                                            "esealCode": esealCode,
                                            "mobilePhoneNo": mobile,
                                            "smsCode": code
                                        }
                                        service.updatePreLossStatus(data).done(res => {
                                            if (res.code == 0) {
                                                numInd = 2;
                                                console.log("验证成功");
                                                $(this).find(".btn2").show().html("确定");
                                                $(this).find(".btn1").hide();
                                                $(this).find(".bootbox-body").html('<div class="msg3" style="color:#333">已成功预挂失“' + esealFullName + '”，请在7个工作日内携带法人身份证、营业执照（副本）前往门店完成挂失操作。</div>');
                                            } else {
                                                numInd = 2;
                                                console.log("验证失败");
                                                $(this).find(".bootbox-body").html('<div class="msgcenter"><em></em><span>验证无效，印章预挂失失败！</span></div');
                                                $(this).find(".btn1").show();
                                                $(this).find(".btn2").hide();
                                            }
                                        })
                                    }
                                }
                            } else if (numInd == 3) {
                                _this.modal('hide');
                                location.reload();
                            } else {
                                _this.modal('hide');
                            }
                            return false;
                        }
                    }
                }
            })
        } else {
            bootbox.alert("该印章当前状态不允许此操作")
        }
    },
    //取消预挂失提示
    cancelloss(event) {
        event.stopPropagation();
        var esealCode = $(event.currentTarget).data('code');
        var esealFullName = $(event.currentTarget).data('name');
        var numInd = this.model.get("numInd");
        var _this = this
        bootbox.dialog({
            backdrop: true,
            closeButton: false,
            className: "common loss",
            title: "取消预挂失",
            message: '<div class="msgcenter"><em></em><span>确认取消已预挂失的“' + esealFullName + '”？</span></div',
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
                        _this.cancellossfun(esealCode);
                    }
                },
            }
        })
    },
    //取消预挂失
    cancellossfun(esealCode) {
        var data = { "esealCode": esealCode }
        service.updateEsealStatus(data).done(res => {
            if (res.code == 0) {
                location.reload();
            } else {
                bootbox.alert(res.msg);
            }
        })
    },
    unfreeze() {
        var _outthis = this;
        var numInd = this.model.get("numInd");
        var dialogsText = dialogs.find(".unfreezeEseal")
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "common unfreezeEseal",
            title: dialogsText.find(".title")[0].outerHTML,
            message: dialogsText.find(".msg1")[0].outerHTML,
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
                                    $(_this).find(".btn1,.btn2").show();
                                    $(_this).find(".btn2").show().html("继续");

                                }
                            }, 1000)
                        } else if (numInd == 2) {
                            // 验证KEY密码
                            if (ukeys.PIN($("#unfreezeCode").val(), 0)) {
                                var success = dialogsText.find(".success")[0].outerHTML
                                $(_this).find(".bootbox-body").html(success);
                                $(_this).find(".btn1,.btn2").hide();
                                setTimeout(function () {
                                    _this.modal('hide');
                                }, 1200)
                            } else {
                                numInd = 1;
                                $(_this).find("#unfreezeCode-error").html("PIN码不正确，请重试")
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
    },
    logout() {
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
                                setTimeout(function () { _this.modal('hide'); }, 2000)
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
    //续费操作
    renew(event) {
        event.stopPropagation();
        var GetOid = $(event.currentTarget).data('oid');
        if (!Boolean(GetOid)) {
            bootbox.dialog({
                backdrop: true,
                closeButton: false,
                className: "common",
                title: "续费提示",
                message: '<div class="msgcenter"><em></em><span>印章数据异常，不支持在线续费！</span></div',
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
                            result.cancelable = false;
                        }
                    },
                }
            })
            return false;
        }
    },
    listPage(pageNum, pageSize) {
        pageNum = pageNum || 1;
        pageSize = pageSize || 10;
        var querydata = { "firmId": this.firmId || "nihao" }
        service.getEsealList(pageNum, pageSize, querydata).done(res => {
            if (res.code != 0) {
                var tempObj = {}
            } else {
                var tempObj = res.data.list;
                this.model.set("totalPages", res.data.totalPages)
                this.model.get("tplhtml").data = tempObj;
                this.$el.html(tpl(this.model.get("tplhtml")));
                this.pagination(res.data.pageNum, res.data.totalPages, $("#esealNav"))
                if (GetQueryString("page") == "license" && GetQueryStringBool) {
                    this.toggleTab(event, $("#loginset"))
                }
                GetQueryStringBool = false;
                if (res.data && (!res.data.list || res.data.list.length == 0)) {
                    $("#esealNav").hide();
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
    licenselist(pageNum, pageSize) {
        var data = {
            pageNum: pageNum || 1,
            pageSize: pageSize || 10,
            enterpriseCode: this.enterpriseCode || "e440301000412"
        }
        service.licenselist(data.pageNum, data.pageSize, data).done(res => {
            if (res.code != 0) {
                var tempObjs = {}
            } else {
                var tempObjs = res.data.list;
                this.model.set("totalPages", res.data.totalPages)
                this.model.get("tplhtml").loginlist = tempObjs;
                this.$el.html(tpl(this.model.get("tplhtml")));
                this.pagination(res.data.pageNum, res.data.totalPages, $("#licenseNav"));

                $("#loginset").addClass("active").siblings().removeClass("active");
                $(".mainbody").eq(1).addClass("active").siblings(".mainbody").removeClass("active");
                $(".license li.nav4:contains('开启登录权限')").attr("class", "nav4 open")
                if (res.data && (!res.data.list || res.data.list.length == 0)) {
                    $("#licenseNav").hide();
                }
            }
            if (data.pageNum == 1) {
                $("li.PreviousPage").addClass("no");
            } else if (data.pageNum == res.data.totalPages) {
                $("li.NextPage").addClass("no");
            } else {
                $("li.PreviousPage,li.NextPage").removeClass("no");
            }
        })
    },
    // 点击上一页、下一页
    pagediv(val, totalPages) {
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
        var _that = this;
        if ($("h3.boxmodel .active")[0].id == "loginset") {
            this.licenselist(val)
        } else {
            this.listPage(val)
        }
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
            $(".appendPage").before(pageIndex)
        };
        if (!this.active) {
            this.active = $("#pageLimit .index").eq(0)
        } else {
            if (this.active.hasClass("NextPage")) {
                this.active = $(".NextPage");
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
    currentPapge(e) {
        this.active = $(e.currentTarget);
        var pageNum = this.active.find("a").text()
        this.pagediv(pageNum, this.model.get("totalPages"));
    },
    PreviousPage() {
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(".NextPage");
        console.log(this.active.text(), this.model.get("totalPages"))
        this.pagediv(this.model.get("totalPages"))
    },
    step: function () {
        localStorage.stepNum = "#step1"
    }
});

module.exports = list;