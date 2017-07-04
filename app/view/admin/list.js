import tpl from './tpl/list.html'
import dialog from './tpl/dialog.html'
//var dialogs=$(dialog()).prop("outerHTML");
var dialogs = $($(dialog()).prop("outerHTML"));
var list = Backbone.View.extend({
    el: '.contents',
    initialize() {
        this.render();
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .eseallist .list>.nav .loss': 'loss',
        'click .eseallist .list>.nav .unfreeze': 'unfreeze',
        'click .eseallist .list>.nav .logout': 'logout',
        'click .topseal .boxmodel span': 'toggleTab',
        'click .license .accordion .nav .shut': 'shut',
        'click .license .accordion .nav .open': 'open'
    },
    render: function (query) {
        $(".container").empty();
                this.$el.prepend(tpl);
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
    toggleTab(event) {
        var _this = event.currentTarget;
        $(_this).addClass("active").siblings().removeClass("active");
        $(".mainbody").eq($(_this).index()).addClass("active").siblings(".mainbody").removeClass("active");
    },
    shut(){
        var numInd = this.model.get("numInd")
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "closeAllow common",
            title: dialogs.find(".closeAllow .title")[0].outerHTML,
            message: dialogs.find(".closeAllow .msg1")[0].outerHTML,
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
                        if (numInd == 1) {
                            var msg2 = dialogs.find(".msg2")[0].outerHTML
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg2);
                        } else if (numInd == 2) {
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
        return false;
    },
    open(){
        var numInd = this.model.get("numInd")
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "openAllow common",
            title: dialogs.find(".openAllow .title")[0].outerHTML,
            message: dialogs.find(".openAllow .msg1")[0].outerHTML,
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
                        if (numInd == 1) {
                            var msg2 = dialogs.find(".msg2")[0].outerHTML
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg2);
                        } else if (numInd == 2) {
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
        return false;
    },
    loss() {
        var numInd = this.model.get("numInd")
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "realName common",
            title: dialogs.find(".lossEseal .title")[0].outerHTML,
            message: dialogs.find(".lossEseal .msg1")[0].outerHTML,
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
                        if (numInd == 1) {
                            var msg2 = dialogs.find(".msg2")[0].outerHTML
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg2);
                        } else if (numInd == 2) {
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
        return false;
    },
    unfreeze() {
        var numInd = this.model.get("numInd");
        var unfreezeEseal = dialogs.find(".unfreezeEseal")
        bootbox.dialog({
            backdrop: true,
            //closeButton: false,
            className: "common unfreezeEseal",
            title: unfreezeEseal.find(".title")[0].outerHTML,
            message: unfreezeEseal.find(".msg1")[0].outerHTML,
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
                            var msg6 = unfreezeEseal.find(".msg6")[0].outerHTML
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            $(this).find(".bootbox-body").html(msg6);
                            //$(this).find(".btn1,.btn2").hide();
                            // var msg6 = unfreezeEseal.find(".msg6")[0].outerHTML
                            // $(_this).find(".bootbox-body").html(msg6);
                            // setTimeout(function () {
                            //     var data = { a: 2, b: 4 }
                            //     if (data.a == 1) {
                            //         var msg3 = unfreezeEseal.find(".msg3")[0].outerHTML
                            //         $(_this).find(".bootbox-body").html(msg3);
                            //         $(_this).find(".btn1").show();
                            //         $(_this).find(".btn2").show().html("重试");
                            //     } else if (data.b == 2) {
                            //         var msg4 = unfreezeEseal.find(".msg4")[0].outerHTML
                            //         $(_this).find(".bootbox-body").html(msg4);
                            //         $(_this).find(".btn1").show();
                            //         $(_this).find(".btn2").show().html("重试");
                            //     } else if (data.b == 3) {
                            //         var msg5 = unfreezeEseal.find(".msg5")[0].outerHTML
                            //         $(_this).find(".bootbox-body").html(msg5);
                            //         $(_this).find(".btn1").show();
                            //         $(_this).find(".btn2").show().html("重试");
                            //     } else if (data.b == 4) {
                            //         var msg6 = unfreezeEseal.find(".msg6")[0].outerHTML
                            //         $(_this).find(".bootbox-body").html(msg6);
                            //         $(_this).find(".btn1,.btn2").hide();
                            //         setTimeout(function () { _this.modal('hide'); }, 2000)
                            //     }

                            // }, 1000)
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
    }
});

module.exports = list;