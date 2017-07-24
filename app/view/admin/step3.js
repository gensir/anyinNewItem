import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag;
var flag = true;
var areaNumber;
var that, company, sealShop, zone;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1': 'changeImg',
		'click tr': 'choice',
		'click #goStep4': 'goStep4',
		'click .PreviousPage': 'PreviousPage',
		'click .NextPage': 'NextPage',
		'click nav li.index': 'currentPapge'
	},
	render: function(query) {
		that = this;
		areaNumber = 440305;
		zone = 440300;
		//查询公司所在区域编码
		this.sealList();
		this.$el.html(tpl);
		pictureFlag = [0, 0];
		flag = true;
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		imgModalBig('.digitalExample', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
		imgModalBig('.exampleScan', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
	},
	changeImg: function(event) {
		var fileVal = $(event.target).val();
		if(!fileVal) {
			return;
		}
		var num = $(event.target).data('id');
		var preview = document.getElementById('photo' + num);
		var file = document.getElementById("file" + num);
		var regImage, imageType;
		if(!file.files) {
			var ret = file.value.split('\\');
			var imageName = ret[ret.length - 1];
			imageType = imageName.split('.');
			imageType = imageType[imageType.length - 1];
			regImage = /(png|jpe?g|gif|svg)(\?.*)?$/;
		} else {
			imageType = file.files[0].type;
			regImage = /image\/\w+/;
			if(file.files[0].size > 2 * 1024 * 1024) {
				bootbox.dialog({
					className: "realName",
					title: "<div class='title'></div>",
					message: "<div class='message'>图片大小不要超过2M</div>",
				})
				return false;
			}
		}
		if(!regImage.test(imageType)) {
			bootbox.dialog({
				className: "realName",
				title: "<div class='title'></div>",
				message: "<div class='message'>请上传图片格式的文件</div>",
			})
			return false;
		}
		var randomPercent = Math.floor(Math.random() * 19 + 80);
		var percentVal = 0;
		if(pictureFlag[num] != 0) {
			var data = pictureFlag[num];
			service.deletePhoto(data).done(function(data) {
				if(data.code == 0) {
					console.log(data.msg);
					pictureFlag[num] = 0;
				} else {
					console.log(data.msg);
				}
			});
		}
		setTimeout(function() {
			$("#ajaxForm" + num).ajaxSubmit({
				url: '/mp/file',
				type: "post",
				dataType: "json",
				ContentType: "multipart/form-data",
				beforeSend: function() {
					$(".formPub").remove();
					$(event.target).parent().addClass("form");
					var div = $("<div/>");
					div.attr('class', 'formPub');
					div.appendTo($(event.target).parent());
					var progress = $("<div/>");
					progress.attr('class', 'progress');
					progress.appendTo($(".formPub"))
				},
				uploadProgress: function(event, position, total, percentComplete) {
					if(percentComplete < randomPercent) {
						percentVal = percentComplete;
					} else {
						percentVal = randomPercent;
					}
					$(".progress").css({ "width": percentComplete + '%' });
				},
				success: function(data) {
					var data = JSON.parse(data);
					if(data.code == 0) {
						var data = data.data.fullUrl;
						pictureFlag[num] = data;
						$("#photo" + num).css("background", "url(" + data + ") no-repeat center");
						var reader = new FileReader();
						reader.readAsDataURL(file.files[0]);
						reader.onload = function(e) {
							var image = new Image();
							image.src = this.result;
							image.onload = function() {
								var height = image.height;
								var width = image.width;
								if((height / width) > (112 / 163)) {
									$("#photo" + num).css("background-size", "auto 112px");
								} else {
									$("#photo" + num).css("background-size", "163px auto");
								}
							};
							$(".reset" + num).show();
							$("#file" + num).height(24);
							imgModalBig('#photo' + num, { 'width': 500, 'src': pictureFlag[num] });
						}
					} else {
						var dialog = bootbox.alert({
							className: "uploadPhoto",
							message: data.msg,
						})
						return;
					}
				},
				error: function(data) {
					var dialog = bootbox.alert({
						className: "uploadPhoto",
						message: (data.msg || "网络异常，请稍后再试"),
					})
					return;
				},
				complete: function() {
					setTimeout(function() {
						$(event.target).parent().removeClass("form");
						$(".formPub").remove();
					}, 100);
				},
			})
		}, 200)
	},
	choice: function(event) {
		flag = false;
		var ele = event.target;
		var ind = $(ele).parent("tr").index();
		$('.step3 tr').css({ 'background': '#fff' })
		$('.step3 .right').removeClass('currentRight');
		$(ele).parent().css({ 'background': '#00acff' })
		$(ele).parent().find('.right').addClass('currentRight');
		$(".curr-choice").html($(ele).parent().find('.sealName').html());
	},
	goStep4: function() {
		if(pictureFlag[0] == 0) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请上传《数字证书及电子印章申请表及用户责任书》扫描件",
			})
			return;
		};
		if(pictureFlag[1] == 0) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请上传《法人授权书》扫描件",
			})
			return;
		};
		if(flag) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请选择刻章店",
			})
			return;
		};
		var data = {
			"bizType": 2,
			"enterpriseCode": "233434344344", //组织机构代码 或 统一社会信用代码（优先）
			"urls": "[" + pictureFlag[0] + "," + pictureFlag[1] + "]"
		}
		service.attach(data).done(function(data) {
			if(data.code == 0) {

			} else {
				console.log(data.msg)
			}
		})
		window.open('admin.html#step4', '_self');
	},
	sealList: function(pageNumber, pageSize) {
		//查询行政区
		service.queryCodeArea(zone).done(res => {
			var tempObj;
			if(res.length == 0) {
				tempObj = {}
			} else {
				tempObj = res;
			}
			console.log(res);
			that.model.get("tplhtml").zoneArea = tempObj
			that.sealShop(areaNumber, pageNumber, pageSize);
		})
	},
	// 点击上一页、下一页
	pagediv(val, totalPages) {
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
		this.sealShop(areaNumber, val, )
	},
	//pagination
	pagination: function(pageNumber, totalPages) {
		console.log(pageNumber);
		$("#pageLimit li.index").remove();
		var maxShowPage = 5
		var firstShowPage = pageNumber - 2;
		if(firstShowPage <= 0) {
			firstShowPage = 1;
		}
		var lastShowPage = maxShowPage + firstShowPage - 1;
		if(lastShowPage > totalPages) {
			lastShowPage = totalPages;
		}
		if(lastShowPage - firstShowPage + 1 < maxShowPage) {
			firstShowPage = lastShowPage - maxShowPage + 1;
			firstShowPage = Math.max(firstShowPage, 1);
		}
		this.model.get("tplhtml").count = [];
		for(var i = firstShowPage; i <= lastShowPage; i++) {
			var pageIndex = '<li class="index"><a>' + i + '</a></li>';
			$(".appendPage").before(pageIndex)
		};
		if(!this.active) {
			this.active = $("#pageLimit .index").eq(0)
		} else {
			if(isNaN(this.active.find('a').text())) { //上下页   true
				alert("aaa")
				this.active = $("#pageLimit .index").eq(pageNumber)
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
		var pageNum = this.active.find("a").text() - 1
		this.pagediv(pageNum, this.model.get("totalPages"))
	},
	NextPage(e) {
		//      this.active = $(e.currentTarget);
		//      var pageNum = this.active.find("a").text()
		var pageNum = $(".active").find("a").text() - 0 + 1
		//      alert(next)
		this.pagediv(pageNum, this.model.get("totalPages"))
	},
	sealShop(areaNumber, pageNumber, pageSize) {
		//获取印章店 	
		var pageNumber = pageNumber || 1;
		var pageSize = pageSize || 1
		service.getSealShop(areaNumber, pageNumber, pageSize).done(res => {
			var temp;
			if(res.count == 0) {
				temp = {}
			} else {
				temp = res.data;
			}
			that.model.get("tplhtml").sealShop = temp;
			that.model.set("totalPages", (res.count / res.size))
			that.$el.html(tpl(that.model.get("tplhtml")))
			that.pagination(pageNumber, (res.count / res.size))
		});
	}
});

module.exports = step3;