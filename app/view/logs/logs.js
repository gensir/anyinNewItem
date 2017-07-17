import tpl from './tpl/logs.html';
var service = require('../../server/service').default;
var logs = Backbone.View.extend({
    el: '.contents',
    initialize() {
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
        'focus #keyword': 'MoreSearch',
        'click #search_submit': 'searchs',
        'click #close': 'close',
        'mouseleave .more': 'blur',
        "change #s_state": "SelectState",
        "change #s_type": "SelectType",
        'click #date1+em': 'remove_date',
        'click #date2+em': 'remove_date2',
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
        var ind = $(_this).parent(".jilulist ul li").index();
        var int = $(_this).parent(".jilulist ul li")
        $(".jilulist ul li .details").slideUp();
        $(".jilulist ul li").removeClass();
        var toggle = $(_this).parent(".jilulist ul li").find(".details");
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
    //选择状态
    SelectState(event) {
        var selected = $(event.currentTarget).find("option:selected").index() || "";
        switch (parseInt(selected)) {
            case 1: selected = 1; break;
            case 2: selected = 2; break;
        }
        this.SelectState = selected;
        console.log(this.SelectState);
    },
    //选择业务类型
    SelectType(event) {
        var selected = $(event.currentTarget).find("option:selected").index() || "";
        switch (parseInt(selected)) {
            case 1: selected = "单页签章"; break;
            case 2: selected = "骑缝签章"; break;
        }
        this.SelectType = selected;
        console.log(this.SelectType);
    },
    //提交搜索
    searchs() {
        var keyword = $("#keyword").val();
        var sTime = $("#date1").val();
        var eTime = $("#date2").val();
        if (eTime !== "" & eTime < sTime) {
            alert("结束日期不能少于开始日期");
            $("#date2").focus();
            return false;
        } else if (keyword == "") {
            console.log("请输入搜索关键字");
            $("#keyword").focus();
            this.nosearch();
            return false;
        } else {
            console.log("开始搜索");
            this.logslist({ keyword: $("#keyword").val(), sTime: $("#date1").val(), eTime: $("#date2").val(), SelectType: this.SelectType, SelectState: this.SelectState });
        };
    },
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

    //获取数据
    logslist() {
        service.getLogsList(1, 5).done(res => {
            var obj;
            if (res.code != 0) {
                obj = {}
            } else {
                obj = res.data.list;
            }
            this.$el.html(tpl({ data: obj }));
            this.form_date();
        });
    },
    render: function () {
        //this.$el.html(tpl);
        this.logslist();

    },
});

module.exports = logs;
