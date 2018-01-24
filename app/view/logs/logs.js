define([
	"text!./tpl/logs.html",
	"text!./tpl/search.html",
	"../../lib/service",
    "../../lib/public",
	"datetimepickercn",
	"bootbox"
], function(logsTpl, search, service, publicUtil, datetimepicker,bootbox) {
	var Backbone = require('backbone');
	var template = require('art-template');
    // var placeholder = publicUtil.placeholder;
    var Decrypt = $.cookie("logs_Decrypt") && JSON.parse($.cookie('logs_Decrypt'));
    var d_esealCode = Decrypt && Decrypt.logs_esealCode;
    var d_oid = Decrypt && Decrypt.logs_oid;
    var d_PKSC7 = Decrypt && Decrypt.logs_dSignature;
	var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;

	var main = Backbone.View.extend({
		el: '.contents',
		initialize: function() {},
		render: function() {
			this.$el.html(template.compile(search, {})());
			$(".container").empty();
            this.logslist();
            publicUtil.placeholder();
		},
		events: {
			'click .listtext li .file': 'Toggleshow',
			"click .listtext li .togglehide": "togglehide",
			'focus #keyword': 'MoreSearch',
			'blur #keyword': 'keywordblur',
			'click #search_submit': 'keysearchs',
			'click .logcon,.win-close,#close': 'close',
			'change #s_state': 'operateStatus',
			'change #s_type': 'signType',
			'click #s_date_1 em': 'remove_date',
			'click #s_date_2 em': 'remove_date2',
			'click .pagination .PreviousPage:not(".no")': 'PreviousPage',
			'click .pagination .NextPage:not(".no")': 'NextPage',
			'click .pagination .index': 'currentPapge'
		},
		//调取日期控件
		form_date: function(event) {
			var _this = this
			$('#s_date_1 input').datetimepicker({
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
			}).unbind("changeDate").on('changeDate', function(e) {
				$('#s_date_1 .placeholder').hide();
				_this.logSearchs();
			});
			$('#s_date_2 input').datetimepicker({
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
			}).unbind("changeDate").on('changeDate', function(e) {
				$('#s_date_2 .placeholder').hide();
				_this.logSearchs();
			});
		},
		remove_date: function() {
			$('#s_date_1 input').val("");
		},
		remove_date2: function() {
			$('#s_date_2 input').val("");
		},

		//签章记录显示详细记录
		Toggleshow: function(event) {
			var _this = event.currentTarget
			var ind = $(_this).parent(".listtext li").index();
			var int = $(_this).parent(".listtext li")
			var inp = $(_this).siblings(".togglehide")
			$(".listtext li .details").slideUp();
			$(".listtext li").removeClass();
			var toggle = $(_this).parent(".jilulist li").find(".details");
			if(toggle.is(":hidden")) {
				toggle.slideDown();
				$(int).addClass('active');
			} else {
				toggle.slideUp();
				$(int).removeClass('active');
			};
		},
		togglehide: function(event) {
			var _this = event.currentTarget
			$(".listtext li .details").slideUp();
			var toggle = $(_this).parent(".jilulist li").find(".details");
			toggle.slideUp();
		},
		//显示详细搜索
		MoreSearch: function() {
			$(".search .more").show();
			$(".inputbox").addClass('active');
		},
		//禁用搜索提示
		nosearch: function() {
			$(".search .nosearch").show()
		},
		keywordblur: function() {
			$(".inputbox").removeClass('active');
		},
		//关闭更多搜索
		close: function() {
			$(".search .nosearch").hide();
			$(".search .more").hide();
			$(".inputbox").removeClass('active');
		},
		//选择签章状态
		operateStatus: function(event) {
			var _this = this
			var operateStatus = $("#s_state").val();
			_this.logSearchs();
			var text = $("#s_state").find("option:selected").text();
			//console.log('签章状态：' + text);
		},
		//选择签章类型
		signType: function(event) {
			var _this = this
			var signType = $("#s_type").val();
			//console.log('签章状态：' + text);
			_this.logSearchs();
		},
		//关键字搜索
		keysearchs: function(event) {
			if ($("#keyword").val() == "") {
				bootbox.alert({ 
					size: "small",
					title: "提示",
					message: "请输入文档名/印章名", 
				  });
				return false;
			} else {
				_this.logSearchs();
			}
		},
		//数据搜索
		logSearchs: function(data, pageNum, pageSize) {
			var _this = this
			pageNum = pageNum || 1;
			pageSize = pageSize || 10;
			if($("#s_date_2 input").val() !== "" && $("#s_date_2 input").val() < $("#s_date_1 input").val()) {
				bootbox.alert({ 
					size: "small",
					title: "提示",
					message: "结束日期不能少于开始日期", 
				  });
				$("#s_date_2 input").focus();
				return false;
			}
			var data = {
				"esealCode": d_esealCode,
				"oid": d_oid,
				"enterpriseCode": enterpriseCode,
				"PKSC7": d_PKSC7,
				"importName": $("#keyword").val(),
				"operateStatus": $("#s_state").val(),
				"signType": $("#s_type").val(),
				"signTimeStart": $("#s_date_1 input").val(),
				"signTimeEnd": $("#s_date_2 input").val(),
			};
			if(!Boolean(d_PKSC7)) {
				$("#keyword,#s_state,#s_type,#s_date_1 input,#s_date_2 input").val("");
				this.nosearch();
				return false;
			} else {
				service.commSignetLog(pageNum, pageSize, data).done(function(data) {
					var logsObj;
					if(data.code != 0) {
						logsObj = {}
						$(".contents").append("<div class='nolist boxshow'>数据请求失败！</div>").css("margin-bottom", "20px")
					} else {
						logsObj = data.data;
						_this.model.set("totalPages", data.data.totalPages);
						_this.model.get("tplhtml").data = logsObj;
						_this.$el.append(template.compile(logsTpl)(_this.model.get("tplhtml")));
						$(".contents>.logcon:not(:last)").remove();
						_this.pagination(data.data.pageNum, data.data.totalPages);
						//$(".datetimepicker").remove();
						if(logsObj.list.length == 0) {
							$(".listtext").append("<li><div class='file no'>无签章日志记录，请重设条件查询！</div></li>").css("margin-bottom", "20px")
							$(".pagelist").remove();
						}
						if(pageNum == 1) {
							$("li.PreviousPage").addClass("no");
						} else if(pageNum == data.data.totalPages) {
							$("li.NextPage").addClass("no");
						} else {
							$("li.PreviousPage,li.NextPage").removeClass("no");
						}
						_this.form_date();
					}
				});
			}
		},
		//获取数据
		logslist: function(data, pageNum, pageSize) {
			var _this = this
			pageNum = pageNum || 1;
			pageSize = pageSize || 10;
			var data = {
				"esealCode": d_esealCode,
				"oid": d_oid,
				"enterpriseCode": enterpriseCode,
				"PKSC7": d_PKSC7,
				"importName": $("#keyword").val(),
				"operateStatus": $("#s_state").val(),
				"signType": $("#s_type").val(),
				"signTimeStart": $("#s_date_1 input").val(),
				"signTimeEnd": $("#s_date_2 input").val(),
			};
			service.commSignetLog(pageNum, pageSize, data).done(function(data) {
				var logsObj;
				if(data.code != 0) {
					logsObj = {}
					$(".contents").append("<div class='nolist boxshow'>数据请求失败！</div>").css("margin-bottom", "20px")
				} else {
					logsObj = data.data;
					_this.model.set("totalPages", data.data.totalPages);
					_this.model.get("tplhtml").data = logsObj;
					_this.$el.append(template.compile(logsTpl)(_this.model.get("tplhtml")));
					$(".contents>.logcon:not(:last)").remove();
					_this.pagination(data.data.pageNum, data.data.totalPages);
					if(logsObj.list == "" && logsObj.list.length == 0) {
						$(".listtext").append("<li><div class='file' style='cursor: default;'>无签章日志记录！</div></li>").css("margin-bottom", "20px")
						$(".pagelist").remove();
					}
					if(pageNum == 1) {
						$("li.PreviousPage").addClass("no");
					} else if(pageNum == data.data.totalPages) {
						$("li.NextPage").addClass("no");
					} else {
						$("li.PreviousPage,li.NextPage").removeClass("no");
					}
					_this.form_date();
				}
			});
		},
		// 点击上一页、下一页
		pagediv: function(val, totalPages) {
			if(val < 1) {
				val = 1;
				return;
			}
			if(val > totalPages) {
				val = totalPages;
				return;
			}
			if(val === this.current) {
				return;
			}
			var obj = {
				"esealCode": d_esealCode,
				"oid": d_oid,
				"enterpriseCode": enterpriseCode,
				"PKSC7": d_PKSC7,
				"importName": $("#keyword").val(),
				"operateStatus": $("#s_state").val(),
				"signType": $("#s_type").val(),
				"signTimeStart": $("#s_date_1 input").val(),
				"signTimeEnd": $("#s_date_2 input").val(),
            }
			this.logslist(obj, val)
		},
		//pagination
		pagination: function(pageNumber, totalPages) {
			$("#pageLimit li.index").remove();
			var firstShowPage, maxShowPage = 5
			if(pageNumber <= 3) {
				firstShowPage = 1
			} else {
				firstShowPage = pageNumber - 2;
			}
			var lastShowPage = maxShowPage + firstShowPage - 1;
			if(lastShowPage > totalPages) {
				lastShowPage = totalPages;
			}
			this.model.get("tplhtml").count = [];
			for(var i = firstShowPage; i <= lastShowPage; i++) {
				var pageIndex = '<li class="index"><a>' + i + '</a></li>';
				$(".appendPage").before(pageIndex)
			};
			if(!this.active) {
				this.active = $("#pageLimit .index").eq(0)
			} else {
				if(this.active.hasClass("NextPage")) {
					this.active = $(".NextPage");
				}
				if(isNaN(this.active.find('a').text()) && this.active.prev().text() != this.model.get("totalPages")) {
					this.active = $("#pageLimit .index").eq(0)
				}
				if(this.active.prev().text() == this.model.get("totalPages")) {
					this.active = this.active.prev()
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
			console.log(this.active.text(), this.model.get("totalPages"))
			this.pagediv(this.model.get("totalPages"))
		}

	});
	return main;
});