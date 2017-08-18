import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
import { GetQueryString } from '../../publicFun/public.js'
var service=require('../../server/service').default;
var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode

var list = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
        'click .pagination .NextPage:not(".no")': 'NextPage',
        'click .pagination .index': 'currentPapge'
    },
    render: function (query) {
    	this.listPage();
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
            }
            this.model.set("totalPages", res.data.totalPages)
            this.model.get("tplhtml").data = tempObj;
            this.$el.html(tpl(this.model.get("tplhtml")));
            this.pagination( pageNum, res.data.totalPages)
            if(res.data.list.length==0){
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
        })
    },
    // 点击上一页、下一�
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
        var maxShowPage = 5
        var firstShowPage = pageNumber - 2;
        if (firstShowPage <= 0) {
            firstShowPage = 1;
        }
        var lastShowPage = maxShowPage + firstShowPage - 1;
        if (lastShowPage > totalPages) {
            lastShowPage = totalPages;
        }
        if (lastShowPage - firstShowPage + 1 < maxShowPage) {
            firstShowPage = lastShowPage - maxShowPage + 1;
            firstShowPage = Math.max(firstShowPage, 1);
        }
        this.model.get("tplhtml").count = [];
        for (var i = firstShowPage; i <= lastShowPage; i++) {
            var pageIndex = '<li class="index"><a>' + i + '</a></li>';
            $(".appendPage").before(pageIndex)
        };
        if (!this.active) {
            this.active = $("#pageLimit .index").eq(0)
        } else {
        	console.log(isNaN(this.active.find('a').text()))
            if (isNaN(this.active.find('a').text())) {  //上下�  true
                this.active = $("#pageLimit .index").eq(pageNumber)
            }
            console.log($("#pageLimit a:contains(" + this.active.find('a').text() + ")"))
            this.active = $("#pageLimit a:contains(" + this.active.find('a').text() + ")").parents("li");
        }
        this.active.addClass("active").siblings().removeClass("active")
    },
    currentPapge(e) {
        this.active = $(e.currentTarget);
        var pageNum = this.active.find("a").text()
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
    PreviousPage(e) {	
        var pageNum = $(".pagination .active a").text();
        console.log(pageNum+"pre")
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget).prev();
        this.pagediv(this.model.get("totalPages"))
    },
});

module.exports = list;