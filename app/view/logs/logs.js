import tpl from './tpl/logs.html';
var service=require('../../server/service').default;
var logs = Backbone.View.extend({
    el: '.contents',
    initialize(){
        this.render();
    },
    events: {
        'click .jilulist ul li .file': 'Toggleshow',
        'focus #search': 'searchmore',
        'click #search_submit': 'searchs',
        'click #close': 'close',
        'mouseleave .more': 'blur',
    },
    //选取日期
    form_date() {
        $('#date1,#date2').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            format: 'yyyy-mm-dd',
            forceParse: 0
        });
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
    searchmore() {
        $(".search .more").show()
    },
    //提交搜索
    searchs() {
        var search= $("#search").val();
        if(search.length == '') {
            this.nosearch();
        }
    },
    blur() {
        $('.more').blur(function() {
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
    serverdata() {
        var _this=this;
        service.getLogsList(1,5).done(function(res) {
            var obj;
            if(res.code != 0){
                obj = {}
            }else {
                obj = res.data.list;
            }
            _this.$el.html(tpl({data:obj}));
            _this.form_date();
        });
    }, 
        
    render: function() {
        //this.$el.html(tpl);
        this.serverdata();
        
        
    },
});

module.exports = logs;
