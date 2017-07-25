import tpl from './tpl/logs.html';
var service = require('../../server/service').default;
var logs = Backbone.View.extend({
    el: '.contents',
    initialize() {
    },
    events: {
        'click .listtext li .file': 'Toggleshow',
        'focus #keyword': 'MoreSearch',
        'click #search_submit': 'logslist',
        'click #close': 'close',
        'click .search .more .closes': 'close',
        //'blur .more': 'blur',
        "change #s_state": "operateStatus",
        "change #s_type": "signType",
        'click #date1+em': 'remove_date',
        'click #date2+em': 'remove_date2',

        'click .pagelist .PreviousPage': 'PreviousPage',
        'click .pagelist .NextPage': 'NextPage',
        'click .pagelist li.index': 'currentPapge'
    },
    //调取日期控件
    form_date() {
        $('#date1,#date2').datetimepicker({
            language: 'zh-CN',
            //clearBtn:true,
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            format: 'yyyy-mm-dd',
            forceParse: 0,
        });
    },
    remove_date() {
        $('#date1').val("");
    },
    remove_date2() {
        $('#date2').val("");
    },

    //签章记录显示详细记录
    Toggleshow(event) {
        var _this = event.currentTarget
        var ind = $(_this).parent(".listtext li").index();
        var int = $(_this).parent(".listtext li")
        $(".listtext li .details").slideUp();
        $(".listtext li").removeClass();
        var toggle = $(_this).parent(".jilulist li").find(".details");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
            $(int).addClass('active');
        } else {
            toggle.slideUp();
            $(int).removeClass('active');
        };
    },
    //显示详细搜索
    MoreSearch() {
        $(".search .more").show()
    },
    //关闭详细搜索
    blur() {
        $('.more').blur(function () {
            $(".more").hide();
        })
    },
    //禁用搜索提示
    nosearch() {
        $(".search .nosearch").show()
    },
    //关闭更多搜索
    close() {
        $(".search .nosearch").hide();
        $(".search .more").hide();
    },
    //选择签章状态
    operateStatus(event) {
        var operateStatus = $("#s_state").val();
        var text = $("#s_state").find("option:selected").text();
        //console.log('签章状态：' + text);
    },
    //选择签章类型
    signType(event) {
        var signType = $("#s_type").val();
        var text = $("#s_type").find("option:selected").text();
        //console.log('签章类型：' + text);
    },
    //提交搜索
    // searchs() {
    //     var importName = $("#keyword").val();
    //     var operateStatus = $("#s_state").val();
    //     var signType = $("#s_type").val();
    //     var signTimeStart = $("#date1").val();
    //     var signTimeEnd = $("#date2").val();
    //     if (signTimeEnd !== "" & signTimeEnd < signTimeStart) {
    //         alert("结束日期不能少于开始日期");
    //         $("#date2").focus();
    //         return false;
    //         // } else if (importName == "") {
    //         //     console.log("请输入搜索关键字");
    //         //     $("#keyword").focus();
    //         //     this.nosearch();
    //         //     return false;
    //     } else {
    //         var sobj = {
    //             "esealCode": "ff",
    //             "enterpriseCode": "",
    //             "PKCS7": "",
    //             "importName": importName,
    //             "operateStatus": operateStatus,
    //             "signType": signType,
    //             // "signTimeStart": signTimeStart,
    //             // "signTimeEnd": signTimeEnd,
    //         }
    //         this.logslist(sobj);
    //     };
    // },

    //获取数据
    logslist(data, pageNum, pageSize) {
        pageNum = pageNum || 1;
        pageSize = pageSize || 2;
        var importName = $("#keyword").val();
        var operateStatus = $("#s_state").val();
        var signType = $("#s_type").val();
        var signTimeStart = $("#date1").val();
        var signTimeEnd = $("#date2").val();
        var data = {
            "esealCode": "ff",
            "enterpriseCode": "",
            "PKCS7": "",
            "importName": importName,
            "operateStatus": operateStatus,
            "signType": signType,
            "signTimeStart": signTimeStart,
            "signTimeEnd": signTimeEnd,
        };
        service.commSignetLog(pageNum, pageSize, data).done(res => {
            var logsObj;
            if (res.code != 0) {
                logsObj = {}
            } else {
                logsObj = res.data;
            }
            this.model.set("totalPages", res.data.totalPages);
            this.model.get("tplhtml").data = logsObj;
            this.$el.html(tpl(this.model.get("tplhtml")));
            this.pagination(res.data.pageNum, res.data.totalPages);
            $(".datetimepicker").remove();
            if (logsObj.list.length == 0) {
                $(".listtext").append("<li><div class='file'>无签章日志记录，请重新搜索！</div></li>").css("margin-bottom","20px")
                $(".pagelist").remove();
            }
            this.form_date();
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
        var importName = $("#keyword").val();
        var operateStatus = $("#s_state").val();
        var signType = $("#s_type").val();
        var signTimeStart = $("#date1").val();
        var signTimeEnd = $("#date2").val();
        var obj = {
            "esealCode": "ff",
            "enterpriseCode": "",
            "PKCS7": "",
            "importName": importName,
            "operateStatus": operateStatus,
            "signType": signType,
            "signTimeStart": signTimeStart,
            "signTimeEnd": signTimeEnd,
        }
        this.logslist(obj, val)
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
        this.pagediv(pageNum, this.model.get("totalPages"));
    },
    PreviousPage() {
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget).prev();
        this.pagediv(this.model.get("totalPages"), this.model.get("totalPages"))
    },

    render: function (query) {
        $(".container").empty();
        this.logslist();

    }
});

module.exports = logs;
