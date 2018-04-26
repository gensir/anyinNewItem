define([
    "text!./tpl/license.html",
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
            this.enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
        },
        render: function () {
            that = this;
            // this.$el.empty().html(template.compile(tpl)({}));
            this.licenselist();
        },
        events: {
            'click .license .accordion .nav .shut': 'shut',
            'click .license .accordion .nav .open': 'open',
            'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
            'click .pagination .NextPage:not(".no")': 'NextPage',
            'click .pagination .index': 'currentPapge',
        },
        getSealName: function (target) {
            var _this = target.currentTarget;
            var ind = $(_this).parents(".list").index();
            return this.model.get("tplhtml").loginlist.list[ind].esealFullName;
        },
        //关闭登录权限
        shut: function (event) {
            if (!ukeys.issupport()) {
                return false;
            }
            var _that = this;
            var listdata = _that.model.get("tplhtml").loginlist.list[$(event.currentTarget).parents(".list").index()]
            var numInd = this.model.get("numInd");
            var Oid = $(event.currentTarget).data('oid');
            var c_esealCode = $(event.currentTarget).data('code');
            var dialogsText = dialogs.find(".closeAllow");
            //判断有几个可以登录的UKEY
            service.islicenseLast({ enterpriseCode: this.enterpriseCode }).done(function (res) {
                _that.licenseLast = res.data
            })
            bootbox.dialog({
                backdrop: true,
                //closeButton: false,
                className: "common closeAllow",
                title: dialogsText.find(".title")[0].outerHTML,
                message: (_that.licenseLast <= 1) ? dialogsText.find(".msgcenter")[0].outerHTML : dialogsText.find(".msg1.closeEseal").find("span").text('"' + listdata.esealFullName + '"').end()[0].outerHTML,
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
                                var getPIN = $("#closeCode").val();
                                var selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
                                if (!ukeys.GetCertCount()) {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("未检测到ukey，请插入ukey后重试");
                                    $(_this).find(".btn2").show().html("重试");
                                    return false;
                                };
                                if (ukeys.PIN($("#closeCode").val(), 0)) {
                                    if (Oid != ukeys.GetOid(selectedUkey)) {
                                        $(_this).find(".bootbox-body").html(msg4).end().find(".msg4").text("您插入的UKEY与选择的印章不符，请更换UKEY!");
                                        $(_this).find(".btn2").show().html("重试");
                                        numInd = 0;
                                        $(_this).find(".btn1,.btn2").show();
                                        return false;
                                    }
                                    var data = {
                                        "oid": Oid,
                                        "esealCode": c_esealCode,
                                        "keyStatus": Number(!(listdata.keyStatus))
                                    }
                                    service.loginLicense(data).done(function (res) {
                                        if (res.code == 0) {
                                            var success = dialogsText.find(".success").html("已成功关闭“" + listdata.esealFullName + "”的登录权限").get(0).outerHTML
                                            $(_this).find(".bootbox-body").html(success);
                                            $(_this).find(".btn1,.btn2").hide();
                                            //如果是已解密日志的ukey，则移除解密时保存的信息
                                            var logs_oid = $.cookie("logs_Decrypt") && JSON.parse($.cookie('logs_Decrypt')).logs_oid;
                                            if (Oid == logs_oid) {
                                                $.removeCookie("logs_Decrypt");
                                            }
                                        } else {
                                            var success = dialogsText.find(".success").css("color", "red").html(res.msg).get(0).outerHTML
                                            $(_this).find(".bootbox-body").html(success);
                                            $(_this).find(".btn1,.btn2").hide();
                                        }
                                        setTimeout(function () {
                                            _this.modal('hide');
                                            location.reload();
                                            // window.open("admin.html#license", "_self")
                                        }, 3000)

                                    })
                                } else {
                                    numInd = 1;
                                    var GetOid = ukeys.GetOid(selectedUkey);
                                    var data = {
                                        "oid": GetOid,
                                        "errorCode": 1
                                    };
                                    service.checkPIN(data).done(function (res) {
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
        //打开登录权限
        open: function (event) {
            event.stopPropagation();
            if (!ukeys.issupport()) {
                return false;
            }
            var _that = this;
            var listdata = _that.model.get("tplhtml").loginlist.list[$(event.currentTarget).parents(".list").index()]
            var numInd = this.model.get("numInd");
            var Oid = $(event.currentTarget).data('oid');
            var c_esealCode = $(event.currentTarget).data('code');
            var dialogsText = dialogs.find(".openAllow");
            bootbox.dialog({
                backdrop: true,
                //closeButton: false,
                className: "common openAllow",
                title: dialogsText.find(".title")[0].outerHTML,
                message: dialogsText.find(".msg1").find("span").text('"' + _that.getSealName(event) + '"').end()[0].outerHTML,
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
                                var getPIN = $("#openCode").val(),
                                    selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
                                if (!ukeys.GetCertCount()) {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("未检测到ukey，请插入ukey后重试");
                                    $(_this).find(".btn2").show().html("重试");
                                    return false;
                                };
                                if (ukeys.PIN($("#openCode").val(), 0)) {
                                    if (Oid != ukeys.GetOid(selectedUkey)) {
                                        $(_this).find(".bootbox-body").html(msg4).end().find(".msg4").text("您插入的UKEY与选择的印章不符，请更换UKEY!");
                                        $(_this).find(".btn2").show().html("重试");
                                        numInd = 0;
                                        $(_this).find(".btn1,.btn2").show();
                                        return false;
                                    }
                                    var data = {
                                        "oid": Oid,
                                        "esealCode":c_esealCode,
                                        "keyStatus": Number(!(listdata.keyStatus))
                                    }
                                    service.loginLicense(data).done(function (res) {
                                        if (res.code == 0) {
                                            var success = dialogsText.find(".success").html("已成功开启“" + listdata.esealFullName + "”的登录权限").get(0).outerHTML
                                            $(_this).find(".bootbox-body").html(success);
                                            $(_this).find(".btn1,.btn2").hide();
                                        } else {
                                            var success = dialogsText.find(".success").css("color", "red").html(res.msg).get(0).outerHTML
                                            $(_this).find(".bootbox-body").html(success);
                                            $(_this).find(".btn1,.btn2").hide();
                                        }
                                        setTimeout(function () {
                                            _this.modal('hide');
                                            location.reload();
                                            // window.open("admin.html#license", "_self")
                                        }, 3000)
                                    })
                                } else {
                                    numInd = 1;
                                    var GetOid = ukeys.GetOid(selectedUkey);
                                    var data = {
                                        "oid": GetOid,
                                        "errorCode": 1
                                    };
                                    service.checkPIN(data).done(function (res) {
                                        if (res.code == 1) {
                                            $(_this).find("#openCode-error").html(res.msg);
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
        //权限管理列表
        licenselist: function (pageNum, pageSize) {
            var data = {
                pageNum: pageNum || 1,
                pageSize: pageSize || 10,
                enterpriseCode: this.enterpriseCode
            }
            service.licenselist(data.pageNum, data.pageSize, data).done(function (res) {
                if (res.code != 0) {
                    var tempObjs = {}
                    that.model.get("tplhtml").loginlist = tempObjs;
                    that.$el.empty().html(template.compile(tpl)(that.model.get("tplhtml")));
					$("#licenseNav").remove();
					$(".eseallist").append("<div class='listResult'>" + res.msg + "</div>").css("margin-bottom", "20px")
                } else {
                    var tempObjs = res.data;
                    that.model.set("totalPages", res.data.totalPages)
                    that.model.get("tplhtml").loginlist = tempObjs;
                    that.$el.empty().html(template.compile(tpl)(that.model.get("tplhtml")));
                    that.pagination(res.data.pageNum, res.data.totalPages, $("#licenseNav"));
                    $(".license li.nav4:contains('开启登录权限')").attr("class", "nav4 open")
                    if (res.data && (!res.data.list || res.data.list.length == 0)) {
                        $(".eseallist").append("<div class='listResult'>无电子印章信息</div>").css("margin-bottom", "20px")
                        $("#licenseNav").remove();
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
            this.licenselist(val);
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
        }
    });
    return main;
});