
; (function ($) {
    $.fn.pagination = function (options) {
        var instance = new DoSomething(this, options);
        instance.createPage();
        instance.currentpage();
        instance.firstpage();
        instance.lastpage();
        instance.undown();
        return this;
    }
    function DoSomething($ele, options) {
        this.$ele = $ele;
        console.log(this.$ele.html())
        this.activeEle = ""
        this.opts = $.extend({}, $.fn.pagination.defaults, options);
        this.opts.pageNumber = parseInt(this.opts.pageNumber);
        this.opts.totalPages = parseInt(this.opts.totalPages);
    }
    DoSomething.prototype = {
        createPage: function () {
            this.$ele.empty();           
            var createhtml = ['<nav aria-label="Page navigation">',
                '<ul class="pagination" id="pageLimit">',
                ' <li class="firstpage"><a aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>',
                ' <li class="previous"><a aria-label="Previous"><span aria-hidden="true">&lt;</span></a></li>'
            ];
            var pageNumber = this.opts.pageNumber
            var totalPages = this.opts.totalPages
            var firstShowPage, maxShowPage = this.opts.maxShowPage
            if (pageNumber <= 3) {
                firstShowPage = 1
            } else {
                firstShowPage = pageNumber - 2;
            }
            var lastShowPage = maxShowPage + firstShowPage - 1;
            if (lastShowPage > totalPages) {
                lastShowPage = totalPages;
            }
            for (var i = firstShowPage; i <= lastShowPage; i++) {
                var pageIndex = '<li class="index"><a>' + i + '</a></li>';
                createhtml.push(pageIndex)
            };
            createhtml.push('<li class="next"><a aria-label="Next"><span aria-hidden="true">&gt;</span></a></li><li class="appendPage lastpage"><a aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>')
            this.$ele.append(createhtml.join(""))
            this.activeEle = this.$ele.find("a:contains(" + this.opts.pageNumber + ")").parents("li");
            this.activeEle.addClass("active").siblings().removeClass("active")
            this.opts.pageNumber == 1 || this.opts.pageNumber == this.opts.totalPages ? this.$ele.find("li:not('.index')").find("a").css({ "cursor": "not-allowed" }) : this.$ele.find("li:not('.index')").find("a").css("cursor", "pointer");
        },
        firstpage: function () {
            var _this = this;
            this.$ele.on("click", "li.firstpage", function () {
                _this.opts.pageNumber = 1;
                _this.createPage();
            })
        },
        currentpage: function () {
            var _this = this;
            this.$ele.on("click", "li.index", function () {
                _this.opts.pageNumber = $(this).text();
                _this.createPage()
            })
        },
        lastpage: function () {
            var _this = this;
            this.$ele.on("click", "li.lastpage", function () {
                _this.opts.pageNumber = _this.opts.totalPages
                _this.createPage()
            })
        },
        undown(val) {// 点击上一页、下一页
            var _this = this;
            this.$ele.on("click", "li.previous,li.next", function () {
                if ($(this).hasClass("previous")) {
                    _this.opts.pageNumber--;
                    _this.opts.pageNumber = Math.max(1, _this.opts.pageNumber);
                }
                if ($(this).hasClass("next")) {
                    _this.opts.pageNumber++;
                    _this.opts.pageNumber = Math.min(_this.opts.totalPages, _this.opts.pageNumber);
                }
                _this.createPage()
            })
        },
    };
    $.fn.pagination.else = function () {
        //doSomething...
    }
    $.fn.pagination.defaults = {
        pageNumber: 1,
        totalPages: 1,
        maxShowPage: 5,
        isLimit: true,
        isUpDown: true,
        ajax: null
    }
})(jQuery);
//module.exports = pagination;