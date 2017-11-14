define([
    "text!./tpl/logs.html",
    "../../lib/service",
    "../../../app/lib/ukeys"
    ],function(logsTpl, service,ukey) {

        var Backbone = require('backbone');
        var template = require('art-template');
        
		var esealCode = localStorage.esealCode;
		var PKSC7 = localStorage.dSignature;
		var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;        
             
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            	
            },
            render: function () {
		        $(".container").empty();
		        this.logslist();
            },
		    events: {
		        'click .listtext li .file': 'Toggleshow',
		        'focus #keyword': 'MoreSearch',
		        'click #search_submit': 'logSearchs',
		        'click .logcon,.win-close,#close': 'close',
		        'change #s_state': 'operateStatus',
		        'change #s_type': 'signType',
		        'click #date1+em': 'remove_date',
		        'click #date2+em': 'remove_date2',
		        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
		        'click .pagination .NextPage:not(".no")': 'NextPage',
		        'click .pagination .index': 'currentPapge'
		    },
		    //调取日期控件
		    form_date() {
		        var _this = this
		        $('#date1,#date2').datetimepicker({
		            language: 'zh-CN',
		            weekStart: 1,
		            todayBtn: 1,
		            autoclose: 1,
		            todayHighlight: 1,
		            startView: 2,
		            minView: 2,
		            format: 'yyyy-mm-dd',
		            endDate: new Date(),
		            forceParse: 0,
		        }).unbind("changeDate").on('changeDate', function (e) {
		            _this.logSearchs();
		        })
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
		        var _this = this
		        var operateStatus = $("#s_state").val();
		        _this.logSearchs();
		        var text = $("#s_state").find("option:selected").text();
		        //console.log('签章状态：' + text);
		    },
		    //选择签章类型
		    signType(event) {
		        var _this = this
		        var signType = $("#s_type").val();
		        //console.log('签章状态：' + text);
		        _this.logSearchs();
		    },
		
		    //数据搜索
		    logSearchs(data, pageNum, pageSize) {
		        pageNum = pageNum || 1;
		        pageSize = pageSize || 10;
		        if ($("#date2").val() !== "" & $("#date2").val() < $("#date1").val()) {
		            alert("结束日期不能少于开始日期");
		            $("#date2").focus();
		            return false;
		        }
		        var data = {
		            "esealCode": esealCode,
		            "enterpriseCode": enterpriseCode,
		            "PKSC7": PKSC7,
		            "importName": $("#keyword").val(),
		            "operateStatus": $("#s_state").val(),
		            "signType": $("#s_type").val(),
		            "signTimeStart": $("#date1").val(),
		            "signTimeEnd": $("#date2").val(),
		        };
		        if (!Boolean(PKSC7)) {
		            $("#keyword,#s_state,#s_type,#date1,#date2").val("");
		            this.nosearch();
		            return false;
		        } else {
		            service.commSignetLog(pageNum, pageSize, data).done(res => {
		                var logsObj;
		                if (res.code != 0) {
		                    logsObj = {}
		                    $(".contents").append("<div class='nolist boxshow'>数据请求失败！</div>").css("margin-bottom", "20px")
		                } else {
		                    logsObj = res.data;
		                    this.model.set("totalPages", res.data.totalPages);
		                    this.model.get("tplhtml").data = logsObj;
		                   // this.$el.append(tpl(this.model.get("tplhtml")));
		                     this.$el.append(template.compile(this.model.get("tplhtml")));
		                    $(".contents>.logcon:not(:last)").remove();
		                    this.pagination(res.data.pageNum, res.data.totalPages);
		                    //$(".datetimepicker").remove();
		                    if (logsObj.list.length == 0) {
		                        $(".listtext").append("<li><div class='file no'>无签章日志记录，请重设条件查询！</div></li>").css("margin-bottom", "20px")
		                        $(".pagelist").remove();
		                    }
		                    if (pageNum == 1) {
		                        $("li.PreviousPage").addClass("no");
		                    } else if (pageNum == res.data.totalPages) {
		                        $("li.NextPage").addClass("no");
		                    } else {
		                        $("li.PreviousPage,li.NextPage").removeClass("no");
		                    }
		                    this.form_date();
		                }
		            });
		        }
		    },
		    //获取数据
		    logslist(data, pageNum, pageSize) {
		        pageNum = pageNum || 1;
		        pageSize = pageSize || 10;
		        var data = {
		            "esealCode": esealCode,
		            "enterpriseCode": enterpriseCode,
		            "PKSC7": PKSC7,
		        };
		        service.commSignetLog(pageNum, pageSize, data).done(res => {
		            var logsObj;
		            if (res.code != 0) {
		                logsObj = {}
		                $(".contents").append("<div class='nolist boxshow'>数据请求失败！</div>").css("margin-bottom", "20px")
		            } else {
		                logsObj = res.data;
		                this.model.set("totalPages", res.data.totalPages);
		                this.model.get("tplhtml").data = logsObj;
		                //this.$el.append(tpl(this.model.get("tplhtml")));
		               // this.$el.empty().html(template.compile(registerstep2,{})());
		                this.$el.append(template.compile(this.model.get("tplhtml")));
		                
		                
		                $(".contents>.logcon:not(:last)").remove();
		                this.pagination(res.data.pageNum, res.data.totalPages);
		                if (logsObj.list == "" && logsObj.list.length == 0) {
		                    $(".listtext").append("<li><div class='file' style='cursor: default;'>无签章日志记录！</div></li>").css("margin-bottom", "20px")
		                    $(".pagelist").remove();
		                }
		                if (pageNum == 1) {
		                    $("li.PreviousPage").addClass("no");
		                } else if (pageNum == res.data.totalPages) {
		                    $("li.NextPage").addClass("no");
		                } else {
		                    $("li.PreviousPage,li.NextPage").removeClass("no");
		                }
		                this.form_date();
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
		        var obj = {
		            "esealCode": esealCode,
		            "enterpriseCode": enterpriseCode,
		            "PKSC7": PKSC7,
		            "importName": $("#keyword").val(),
		            "operateStatus": $("#s_state").val(),
		            "signType": $("#s_type").val(),
		            "signTimeStart": $("#date1").val(),
		            "signTimeEnd": $("#date2").val(),
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
        return main;
    }
);