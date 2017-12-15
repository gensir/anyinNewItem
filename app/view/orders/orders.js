define([
    "text!./tpl/orders.html",
    "../../lib/service",
    "../../lib/public",
    "text!../pub/tpl/dialog.html",
    "bootbox"
], function(orderstpl, service, publicUtil, dialog, bootbox) {

    var Backbone = require('backbone');
    var template = require('art-template');
    var dialogs = $(dialogs);
    var that;
    var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
    var firmId=$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId;

    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function() {},
        events: {
            'click .eseallist .list>.nav': 'toggleList',
            'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
            'click .pagination .NextPage:not(".no")': 'NextPage',
            'click .pagination .index': 'currentPapge',
            'click #continue': 'continueGo',
            'click #update_key': 'update_key',
            'click #renew': 'renew'
        }, //this.$el.empty().html(template.compile(orders)({}));    
        render: function(query) {
            that = this;
            this.listPage();
        },
        
        continueGo: function(event) {       	
            event.stopPropagation();
            var orderNo = $(event.currentTarget).parent().siblings(".nav0").text();
            service.status(orderNo).done(function(data) {
                if(data.code == 0) {
                    localStorage.orderNo = data.data.orderNo;
                    localStorage.stepNum = "#step" + data.data.operateStep;
                    window.location.href = "admin.html#step" + data.data.operateStep;
                }
            })
        },
        //续费未完成再支付
        renew: function (event) {
            event.stopPropagation();
            var keyType = $(event.currentTarget).data('type');
            var certificateFirm = $(event.currentTarget).data('cert');
            localStorage.keyType = $(event.currentTarget).data('type');
            localStorage.certificateFirm = $(event.currentTarget).data('cert');
            if ((!keyType && !certificateFirm) || (certificateFirm == 2 )) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>该订单不支持再次支付操作，请重新下单！</span></div',
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
            } else if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
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
        //更新证书
        update_key: function(event) {
            event.stopPropagation();
            var orderNo = $(event.currentTarget).data('order');
            var esealCode = $(event.currentTarget).data('code');
            var oid = $(event.currentTarget).data('oid');
            var esealStatus = $(event.currentTarget).data('status');
            if (esealStatus != 7) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>您的证书正常，暂不需要更新！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function(result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            } else if (!((!!window.ActiveXObject || "ActiveXObject" in window) && navigator.userAgent.indexOf("Opera") < 0)) {
                bootbox.dialog({
                    backdrop: true,
                    closeButton: false,
                    className: "common",
                    title: "操作提示",
                    message: '<div class="msgcenter"><em></em><span>此功能只支持在IE浏览器中使用！</span></div',
                    buttons: {
                        confirm: {
                            label: "确定",
                            className: "btn2",
                            callback: function(result) {
                                result.cancelable = false;
                            }
                        },
                    }
                })
                return false;
            }
            //  else {
            //     window.location.href = "admin.html#update_key?orderNo=?" + orderNo + "&esealCode=" + esealCode + "&oid=" + oid;
            // }
        },
        toggleList: function(event) {
            var _this = event.currentTarget;
            var ind = $(_this).parent(".list").index();
            $(".eseallist .list .showHide").slideUp();
            var toggle = $(_this).parent(".list").find(".showHide");
            if(toggle.is(":hidden")) {
                toggle.slideDown();
                $(".nav").removeClass("nav_tac");
                $(_this).addClass("nav_tac");
                $(_this).next(".showHide").find(".tog_bot").click(function() {
                    toggle.slideUp();
                    $(_this).removeClass("nav_tac");
                });
            } else {
                toggle.slideUp();
                $(_this).removeClass("nav_tac");
            }
        },

        listPage: function(data, pageNum, pageSize) {
            var _this = this
            $(".listResult").hide();
            pageNum = pageNum || 1;
            pageSize = pageSize || 10;
            var data = {
                "enterpriseCode": enterpriseCode || "914403001923081808"
            }
            service.queryOrderList(pageNum, pageSize, data).done(function(res) {
                var tempObj;
                if(res.code != 0) {
                    tempObj = {}
                } else {
                    tempObj = res.data;
                    that.model.set("totalPages", res.data.totalPages)
                    that.model.get("tplhtml").data = tempObj;
                    //tat.$el.html(tpl(this.model.get("tplhtml")));
                    that.$el.html(template.compile(orderstpl)(that.model.get("tplhtml")));

                    that.pagination(pageNum, res.data.totalPages)
                    if(res.data.list.length == 0) {
                        $(".listResult").show();
                        $("nav").hide();
                    }
                    if(pageNum == 1) {
                        $("li.PreviousPage").addClass("no");
                    } else if(pageNum == res.data.totalPages) {
                        $("li.NextPage").addClass("no");
                    } else {
                        $("li.PreviousPage,li.NextPage").removeClass("no");
                    }
                }
            })
        },
        // 点击上一页、下一页
        pagediv: function(val, totalPages) {
            if(val < 1) {
                val = 1;
                return;
            }
            if(val > totalPages) {
                val = totalPages;
                return;
            }
            if(val === this.current) {
                return;
            }
            var data = {
                "enterpriseCode": enterpriseCode
            }
            this.listPage(data, val)
        },
        //pagination
        pagination: function(pageNumber, totalPages) {
            $("#pageLimit li.index").remove();
            var firstShowPage, maxShowPage = 5
            if(pageNumber <= 3) {
                firstShowPage = 1
            } else {
                firstShowPage = pageNumber - 2;
            }
            var lastShowPage = maxShowPage + firstShowPage - 1;
            if(lastShowPage > totalPages) {
                lastShowPage = totalPages;
            }
            this.model.get("tplhtml").count = [];
            for(var i = firstShowPage; i <= lastShowPage; i++) {
                var pageIndex = '<li class="index"><a>' + i + '</a></li>';
                $(".appendPage").before(pageIndex)
            };
            if(!this.active) {
                this.active = $("#pageLimit .index").eq(0)
            } else {
                if(this.active.hasClass("NextPage")) {
                    this.active = $(".NextPage");
                }
                if(isNaN(this.active.find('a').text()) && this.active.prev().text() != this.model.get("totalPages")) {
                    this.active = $("#pageLimit .index").eq(0)
                }
                if(this.active.prev().text() == this.model.get("totalPages")) {
                    this.active = this.active.prev()
                }
                this.active = $("#pageLimit a:contains(" + this.active.find('a').text() + ")").parents("li");
            }
            this.active.addClass("active").siblings().removeClass("active")
        },
        currentPapge: function(e) {
            this.active = $(e.currentTarget);
            var pageNum = this.active.find("a").text()
            this.pagediv(pageNum, this.model.get("totalPages"));
        },
        PreviousPage: function() {
            this.active = "";
            this.pagediv(1, this.model.get("totalPages"))
        },
        NextPage: function(e) {
            this.active = $(".NextPage");
            console.log(this.active.text(), this.model.get("totalPages"))
            this.pagediv(this.model.get("totalPages"))
        }

    });
    return main;
});