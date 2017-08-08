import tpl from './tpl/list.html'
import dialog from '../pub/tpl/dialog.html'
import { sendmsg } from '../../publicFun/public.js'
import { GetQueryString } from '../../publicFun/public.js'
import ukeys from '../../publicFun/ukeys';
var service = require('../../server/service').default;
var dialogs = $($(dialog()).prop("outerHTML"));
var GetQueryStringBool = true;
var list = Backbone.View.extend({
    el: '.contents',
    initialize() {
        this.firmId = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId
        this.enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .eseallist .list>.nav .renew': 'renew',
        'click .eseallist .list>.nav .loss': 'loss',
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
    shut(e) {
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
            message: _that.licenseLast <= 1 ? dialogsText.find(".msg1")[0].outerHTML : dialogsText.find(".msg1.closeEseal")[0].outerHTML,
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
                    className: _that.licenseLast <= 1 ? "btn2 closeAllowbtn2" : "btn2",
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
                                if (ukeys.ConnectKey()) {
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
                                $(_this).find("#closeCode-error").html("PIN码不正确，请重试")
                                $(_this).find(".btn2").show().html("重试");
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
                        var msg3 = dialogsText.find(".msg3")[0].outerHTML
                        var msg4 = dialogsText.find(".msg4")[0].outerHTML
                        var msg6 = dialogsText.find(".msg6")[0].outerHTML
                        if (numInd == 1) {
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg4);
                            $(this).find(".btn1,.btn2").hide();
                            setTimeout(function () {
                                if (ukeys.ConnectKey()) {
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
                                $(_this).find("#openCode-error").html("PIN码不正确，请重试")
                                $(_this).find(".btn2").show().html("重试");
                            }
                        }
                        return false;
                    }
                }
            }
        })
        return false;
    },
    loss() {
        var _this = this;
        var numInd = this.model.get("numInd")
        var dialog = bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "common loss",
            title: dialogs.find(".lossEseal .title")[0].outerHTML,
            message: dialogs.find(".lossEseal .msg1")[0].outerHTML,
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
                            var msg2 = dialogs.find(".msg2")[0].outerHTML
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg2);
                            sendmsg($(this).find("#resend"));
                            service.getSMSVerifCode().done(res => {
                            })
                            $(this).find("#resend").unbind().click(res => {
                                sendmsg($(this).find("#resend"));
                                service.getSMSVerifCode().done(res => {
                                })
                            })
                        } else if (numInd == 2) {
                            let ele = $(this).find(".sureLoss");
                            ele.attr("data-id", "lossCheck")
                            _this.model.set({ "clickEle": ele.data('id') })
                            var isValid = _this.model.isValid();
                            if (isValid) {
                                numInd--
                                $(".checkSmsCode").css({ "border-color": "red" })
                                return false;
                            } else {
                                $(".checkSmsCode").css({ "border-color": "#ccc" })
                            }
                            service.checkSmsCode().done(res => {
                                if (res.code == 0) {
                                    console.log("验证成功")
                                }
                            })
                            var msg3 = dialogs.find(".msg3")[0].outerHTML
                            $(this).find(".modal-footer .btn2").hide();
                            $(this).find(".bootbox-body").html(msg3);
                        } else {
                            this.modal('hide');
                        }
                        return false;
                    }
                }
            }
        })
        dialog.init(function () {
            // $(this).find(".sureLoss").unbind().click(function () {
            //     service.getSMSVerifCode().done(res => {

            //     })
            // })
        });
        return false;
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
    renew() {
        window.open("admin.html#renew", "_self")
        return false
    },
    listPage(pageNum, pageSize) {
        pageNum = pageNum || 1;
        pageSize = pageSize || 5;
        var querydata = { "firmId": this.firmId || "nihao" }
        service.getEsealList(pageNum, pageSize, querydata).done(res => {
            var tempObj;
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
            pageSize: pageSize || 5,
            enterpriseCode: this.enterpriseCode || "e440301000412"
        }
        service.licenselist(data.pageNum, data.pageSize, data).done(res => {
            var tempObj;
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
    pagination: function (pageNumber, totalPages, nav) {
        nav.find("li.index").remove();
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
            nav.find(".appendPage").before(pageIndex)
        };
        if (!this.active) {
            this.active = nav.find("li.index").eq(0)
        } else {
            if (isNaN(this.active.find('a').text())) {
                this.active = nav.find("li.index").eq(0)
            }
            this.active = nav.find("a:contains(" + this.active.find('a').text() + ")").parents("li");
        }
        this.active.addClass("active").siblings().removeClass("active")
    },
    currentPapge(e) {
        this.active = $(e.currentTarget);
        var pageNum = this.active.find("a").text()
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
    PreviousPage() {
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget).prev();
        this.pagediv(this.model.get("totalPages"))
    },
    step: function () {
        localStorage.stepNum = "#step1"
    }
});

module.exports = list;