import tpl from './tpl/logs2.html';
var service = require('../../server/service').default;
var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
var logs2 = Backbone.View.extend({
    el: '.contents',
    initialize() {
    },
    render: function (query) {
        //this.$el.html(tpl);
        $(".container").empty();
        this.logslist();
    },
    events: {
        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
        'click .pagination .NextPage:not(".no")': 'NextPage',
        'click .pagination .index': 'currentPapge'
    },
    //获取数据
    logslist(pageNum, pageSize, data) {
        pageNum = pageNum || 1;
        pageSize = pageSize || 10;
        var data = {
            "enterpriseCode": enterpriseCode || "11"
        }
        service.Operationlog(pageNum, pageSize, data).done(res => {
            var logsObj;
            if (res.code != 0) {
                logsObj = {}
                $(".listtext").append("<li><div class='file no'>服务器异常</div></li>").css("margin-bottom", "20px")
            } else {
                logsObj = res.data;
                this.model.set("totalPages", res.data.totalPages);
                this.model.get("tplhtml").data = logsObj;
                this.$el.html(tpl(this.model.get("tplhtml")));
                this.pagination(res.data.pageNum, res.data.totalPages);
                if (logsObj.list == "" && logsObj.list.length == 0) {
                    $(".listtext").append("<li><div class='file no'>无操作日志记录！</div></li>").css("margin-bottom", "20px")
                    $(".pagelist").remove();
                }
                if (pageNum == 1) {
                    $("li.PreviousPage").addClass("no");
                } else if (pageNum == res.data.totalPages) {
                    $("li.NextPage").addClass("no");
                } else {
                    $("li.PreviousPage,li.NextPage").removeClass("no");
                }
            }
        });
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

        this.logslist(val);
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

module.exports = logs2;