import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
import { GetQueryString } from '../../publicFun/public.js'
var service=require('../../server/service').default;
var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
var firmId=$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId;
var list = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
        'click .pagination .NextPage:not(".no")': 'NextPage',
        'click .pagination .index': 'currentPapge',
        'click #continue': 'continue'
    },
    render: function (query) {
    	this.listPage();
    },
    continue(event) {
        service.errorOrder(firmId).done(function (data) {
            if (data.code == 0) {
                localStorage.orderNo = data.data.list[0].orderNo;
                localStorage.stepNum = "#step" + data.data.list[0].operateStep
                window.location.href = "admin.html#step" + data.data.list[0].operateStep;
            }
        })
        event.stopPropagation();
    },
    toggleList(event) {
        var _this = event.currentTarget;
        var ind = $(_this).parent(".list").index();
        $(".eseallist .list .showHide").slideUp();
        var toggle = $(_this).parent(".list").find(".showHide");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
        } else {
            toggle.slideUp();
        }
    },
    
    listPage(data, pageNum, pageSize) {
        $(".listResult").hide();
        pageNum = pageNum || 1;
        pageSize = pageSize || 10;
        var data = {
            "enterpriseCode": enterpriseCode || "914403001923081808"
        }
        service.queryOrderList(pageNum, pageSize, data).done(res => {
            var tempObj;
            if (res.code != 0) {
                tempObj = {}
            } else {
                tempObj = res.data;
                this.model.set("totalPages", res.data.totalPages)
                this.model.get("tplhtml").data = tempObj;
                this.$el.html(tpl(this.model.get("tplhtml")));
                this.pagination(pageNum, res.data.totalPages)
                if (res.data.list.length == 0) {
                    $(".listResult").show();
                    $("nav").hide();
                }
                if (pageNum == 1) {
                    $("li.PreviousPage").addClass("no");
                } else if (pageNum == res.data.totalPages) {
                    $("li.NextPage").addClass("no");
                } else {
                    $("li.PreviousPage,li.NextPage").removeClass("no");
                }
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
        var data = {
            "enterpriseCode": enterpriseCode
        }
        this.listPage(data, val)
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
            if(this.active.hasClass("NextPage")){
                this.active=$(".NextPage");
            }
            if (isNaN(this.active.find('a').text())&&this.active.prev().text()!=this.model.get("totalPages")) {
                this.active = $("#pageLimit .index").eq(0)
            }
            if(this.active.prev().text()==this.model.get("totalPages")){
                this.active=this.active.prev()
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
        console.log(this.active.text(),this.model.get("totalPages"))
        this.pagediv(this.model.get("totalPages"))
    }
});

module.exports = list;