import tpl from './tpl/logs2.html';
var service = require('../../server/service').default;
var logs2 = Backbone.View.extend({
    el: '.contents',
    initialize() {
    },
    events: {
        'click .pagelist .PreviousPage': 'PreviousPage',
        'click .pagelist .NextPage': 'NextPage',
        'click .pagelist li.index': 'currentPapge'
    },
    //获取数据
    logslist(pageNum, pageSize) {
        pageNum = pageNum || 1;
        pageSize = pageSize || 10;
        service.Operationlog(pageNum, pageSize).done(res => {
            var logsObj;
            if (res.code != 0) {
                logsObj = {}
            } else {
                logsObj = res.data;
            }
            this.model.set("totalPages", res.data.totalPages)
            this.model.get("tplhtml").data = logsObj;
            this.$el.html(tpl(this.model.get("tplhtml")));
            this.pagination(res.data.pageNum, res.data.totalPages)

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
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget).prev();
        this.pagediv(this.model.get("totalPages"), this.model.get("totalPages"))
    },

    render: function (query) {
        //this.$el.html(tpl);
        this.logslist()

    },
});

module.exports = logs2;