define([
    "text!./tpl/orders.html",
    "../../lib/service",
    "../../lib/public"
    ],function(orderstpl,service,publicUtil) {

        var Backbone = require('backbone');
        var template = require('art-template');
        var that;
		var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode
		var firmId;                
        
        var main = Backbone.View.extend({
            el: '.contents',
            initialize: function () {
            },
		    events: {
		        'click .eseallist .list>.nav': 'toggleList',
		        'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
		        'click .pagination .NextPage:not(".no")': 'NextPage',
		        'click .pagination .index': 'currentPapge',
		        'click #continue': 'continue',
		        'click #renew': 'renew'
		    },        //this.$el.empty().html(template.compile(orders)({}));    
		    render: function (query) {
		    	that = this;
		    	var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).loginType;
		        //2为ODC
		        //如果是ODC登录
		        if(isODC==2){			
		        	firmId = localStorage.indexFirmid;
		        }else{
		        	this.firmId = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId
		        }
		    	this.listPage();
		    },
		    continue: function(event) {
		        event.stopPropagation();
		        service.errorOrder(firmId).done(function (data) {
		            if (data.code == 0) {
		                localStorage.orderNo = data.data.list[0].orderNo;
		                localStorage.stepNum = "#step" + data.data.list[0].operateStep
		                window.location.href = "admin.html#step" + data.data.list[0].operateStep;
		            }
		        })
		    },
		    renew: function(event) {
		        event.stopPropagation();
		        var orderNo = $(event.currentTarget).parent().siblings(".nav0").text();
		        var esealCode = $(event.currentTarget).siblings("#esealCode").val();
		        var oid = $(event.currentTarget).siblings("#oid").val();
		        if (!Boolean(oid)) {
		            bootbox.dialog({
		                backdrop: true,
		                closeButton: false,
		                className: "common",
		                title: "登录提示",
		                message: '<div class="msgcenter"><em></em><span>订单已失效，不支持支付！</span></div',
		                buttons: {
		                    cancel: {
		                        label: "取消",
		                        className: "btn1",
		                        callback: function (result) {
		                            result.cancelable = false;
		                        }
		                    },
		                    confirm: {
		                        label: "确定",
		                        className: "btn2",
		                        callback: function (result) {
		                            result.cancelable = false;
		                            // localStorage.clear();
		                            // $.removeCookie('loginadmin');
		                            // result.cancelable = window.open('login.html', '_self');
		                        }
		                    },
		                }
		            })
		            return false;
		        }
		    },
		    toggleList: function(event) {
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
		    
		    listPage: function(data, pageNum, pageSize) {
		    	var _this = this
		        $(".listResult").hide();
		        pageNum = pageNum || 1;
		        pageSize = pageSize || 10;
		        var data = {
		            "enterpriseCode": enterpriseCode || "914403001923081808"
		        }
		        service.queryOrderList(pageNum, pageSize, data).done(function(res){
		            var tempObj;
		            if (res.code != 0) {
		                tempObj = {}
		            } else {
		                tempObj = res.data;
		                that.model.set("totalPages", res.data.totalPages)
		                that.model.get("tplhtml").data = tempObj;
		                //tat.$el.html(tpl(this.model.get("tplhtml")));
		                that.$el.html(template.compile(orderstpl)(that.model.get("tplhtml")));
		                
		                that.pagination(pageNum, res.data.totalPages)
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
		    pagediv: function(val, totalPages) {
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
		    currentPapge: function(e) {
		        this.active = $(e.currentTarget);
		        var pageNum = this.active.find("a").text()
		        this.pagediv(pageNum, this.model.get("totalPages"));
		    },
		    PreviousPage: function() {
		        this.active = "";
		        this.pagediv(1, this.model.get("totalPages"))
		    },
		    NextPage: function(e) {
		        this.active = $(".NextPage");
		        console.log(this.active.text(),this.model.get("totalPages"))
		        this.pagediv(this.model.get("totalPages"))
		    }


        });
        return main;
    }
);