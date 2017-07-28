import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag;
var flag = true;
var areaNumber,result,stepResult,companyName;
var that, company, sealShop,scan,eseals,isLegal;
var zone=440300;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1,#file2,#file3': 'changeImg',
		'click tr': 'choice',
		'click #goStep4': 'goStep4',
		'click .PreviousPage': 'PreviousPage',
		'click .NextPage': 'NextPage',
		'click nav li.index': 'currentPapge',
		"change #area":'option'
	},
	render: function(query) {
		this.$el.html(tpl);		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
		imgModalBig('.shadow2', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
		imgModalBig('.shadow3', { 'width': 500, 'src': '../../../../asset/img/bank.jpg' });
		imgModalBig('.shadow4', { 'width': 500, 'src': '../../../../asset/img/trade.jpg' });
		pictureFlag = [0, 0 ,0 ,0];
		flag = true;
		that = this;
		zone = 440300;
		result = isLegal;
//		//查询公司所在区域编码	
		this.getstep3("OFFLINE07252055727334");
		this.sealList();	
		
//		that.$el.html(tpl(that.model.get("tplhtml")))
	},
	changeImg: function(event) {
		var eve = event;
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
						if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
    						$("#photo" + num).css("background", "url(" + data + ") no-repeat").css("background-size","cover");
    						$(".reset" + num).show();
							$("#file" + num).height(24);
							imgModalBig('#photo' + num, { 'width': 500, 'src': pictureFlag[num] });
						}else{
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
				complete: function(eve) {
					setTimeout(function() {
						$(eve.target).parent().removeClass("form");
						var navigatorName = "Microsoft Internet Explorer"; 
						if(navigator.appName == navigatorName){
						    document.getElementsByClassName("formPub")[0].removeNode(true);
						}else{
						    $(".formPub").remove();
						}
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
		stepResult.shopAddress=$(ele).parent().find('.address').html();
		stepResult.shopName=$(ele).parent().find('.sealName').html();
		stepResult.shopNo=$(ele).parent().find('.display').html();
		stepResult.shopTel=$(ele).parent().find('.telPhone').html();
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
			that.model.get("tplhtml").zoneArea = tempObj;
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
    PreviousPage() {
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(e.currentTarget).prev();
        this.pagediv(this.model.get("totalPages"), this.model.get("totalPages"))
    },
	sealShop(areaNumber, pageNumber, pageSize) {
		//获取印章店 	
		$(".sealShopResult").hide();
		if($.trim(pageNumber)=="«"){
			pageNumber=1;
		}
		var pageNumber = pageNumber || 1;
		var pageSize = pageSize || 5
		service.getSealShop(areaNumber, pageNumber, pageSize).done(res => {
			var temp;
			if(res.count == 0) {
				temp = []
			} else {
				temp = res.data;
			}
			that.model.get("tplhtml").sealShop = temp;
			that.model.set("totalPages", Math.ceil(res.count / res.size))
			that.$el.html(tpl(that.model.get("tplhtml")))
			that.pagination(pageNumber, Math.ceil(res.count / res.size))
			if(res.data.length==0){
				$(".sealShopResult").show();
				$(".pagination").hide();
			}
			imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
			imgModalBig('.shadow2', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
			imgModalBig('.shadow3', { 'width': 500, 'src': '../../../../asset/img/bank.jpg' });
			imgModalBig('.shadow4', { 'width': 500, 'src': '../../../../asset/img/trade.jpg' });	
		});
		//如果是第一次进来
		if(stepResult.scanAttaches.length==0){
			(isLegal==0)?$(".legalScan").show():$(".legalScan").hide();
			for(var i=0;i<eseals.length;i++){
				if(eseals[i].esealCategory==4){
					$(".bankScan").show();
				};
				if(eseals[i].esealCategory==8){
					$(".tradeScan").show();
				};
			};
		}else{
			//如果未完成订单进来
			for(var i=0;i<scan.length;i++){
				if(scan[i].certificateType=="0046"){
					pictureFlag[0]=scan[i].filePath;
					$("#file0").css({"height":"24px"});
					$(".reset0").show();
					$("#ajaxForm0 .digitalUpload").css({"background":"url("+scan[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
					imgModalBig('#photo0', { 'width': 500, 'src': scan[i].filePath });
				}
				if(scan[i].certificateType=="0047"){
					pictureFlag[1]=scan[i].filePath;
					$(".legalScan").show();
					$("#file1").css({"height":"24px"})
					$(".reset1").show();
					$("#ajaxForm1 .digitalUpload").css({"background":"url("+scan[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
					imgModalBig('#photo1', { 'width': 500, 'src': scan[i].filePath });
				}
				if(scan[i].certificateType=="0048"){//银行开户证明 暂时48
					pictureFlag[2]=scan[i].filePath
					$(".bankScan").show();
					$("#file2").css({"height":"24px"})
					$(".reset2").show();
					$("#ajaxForm2 .digitalUpload").css({"background":"url("+scan[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
					imgModalBig('#photo2', { 'width': 500, 'src': scan[i].filePath });
				}
				if(scan[i].certificateType=="0049"){//对外贸易许可证 暂时49
					pictureFlag[3]=scan[i].filePath
					$(".tradeScan").show();
					$("#file3").css({"height":"24px"})
					$(".reset3").show();
					$("#ajaxForm3 .digitalUpload").css({"background":"url("+scan[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
					imgModalBig('#photo3', { 'width': 500, 'src': scan[i].filePath });
				}
			}
		}
	},
	option(){
		areaNumber=$("#area option:selected").val();
		that.model.get("tplhtml").areaNumber = areaNumber
		this.sealShop(areaNumber);
	},
	getstep3:function(data){
		service.getstep3(data).done(function(data){
			if(data.code==0){
				stepResult=data.data;
				scan=data.data.scanAttaches;
				eseals=data.data.eseals;
				islegal=data.data.isOperaterLegalPersion;
				var company={
				    "companyName":data.data.enterpriseName
				}
				service.getCompanyArea(company).done(function(data){
					if(data.code==0){
						areaNumber=data.data.areaNumber;
						that.model.get("tplhtml").areaNumber = areaNumber;
					}
				})
			}
		})
	},
	goStep4: function() {
		for(var i = 0; i < pictureFlag.length; i++) {
			if(pictureFlag[i] == 0) {
				var dialog = bootbox.alert({
					className: "uploadPhoto",
					message: "请上传全部图片",
				})
				return;
			}
		};
		if(flag) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请选择刻章店",
			})
			return;
		};
		service.poststep3(stepResult).done(function(data) {
			if(data.code == 0) {
				window.open('admin.html#step4', '_self');
			} else {
				console.log(data.msg)
			}
		})
	}
});

module.exports = step3;