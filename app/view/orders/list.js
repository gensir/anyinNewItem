import tpl from './tpl/list.html'
//var dialogs=$(dialog()).prop("outerHTML");
import { GetQueryString } from '../../publicFun/public.js'
var service=require('../../server/service').default;
var list = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .PreviousPage': 'PreviousPage',
        'click .NextPage': 'NextPage',
        'click nav li.index': 'currentPapge'
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
    
    listPage(querydata, pageNum, pageSize) {	   	
        pageNum = pageNum || 1;
        pageSize = pageSize || 5;
        service.queryOrderList(pageNum, pageSize).done(res => {
            var tempObj;
            if (res.code != 0) {
                tempObj = {}
            } else {
                tempObj = res.data;
            }
            this.model.set("totalPages", res.data.totalPages)
            this.model.get("tplhtml").data = tempObj;
            this.$el.html(tpl(this.model.get("tplhtml")));
            this.pagination(res.data.pageNum, res.data.totalPages)
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
        
        this.listPage()
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
            if (isNaN(this.active.find('a').text())) {
                this.active = $("#pageLimit .index").eq(0)
            }
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
        this.active = $(e.currentTarget);
        var pageNum = this.active.find("a").text()
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget);
        var pageNum = this.active.find("a").text()
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
});

module.exports = list;