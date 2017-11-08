import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag;
var flag = true;
var areaNumber,stepResult,companyName,enterpriseCode;
var that, company, sealShop,scan,eseals,parage,tempArr=[];
var islegal,picflag=[0,0,0,0];
var zone=440300;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1,#file2,#file3': 'changeImg',
		'click .table-striped tbody tr': 'choice',
		'click #goStep4': 'goStep4',
		'click .PreviousPage:not(".no")': 'PreviousPage',
		'click .NextPage:not(".no")': 'NextPage',
		'click nav li.index': 'currentPapge',
		"change #area":'option',
		'click #goStep2':'gostep2'
	},
	render: function(query) {
		if(localStorage.stepNum!="#step3"){
			return;
		}
		enterpriseCode=$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
		this.$el.html(tpl);		
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
		imgModalBig('.shadow2', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
		imgModalBig('.shadow3', { 'width': 500, 'src': '../../../../asset/img/bank.jpg' });
		imgModalBig('.shadow4', { 'width': 500, 'src': '../../../../asset/img/trade.jpg' });
		pictureFlag = [1,0,0,0];
		flag = true;
		that = this;
		zone = 440300;
		var orderNo=localStorage.orderNo||"APPLY09071184272345";
		if(!orderNo){
			return;
		}
		this.getstep3(orderNo);	
		
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
		var deleteData;
		var isdelete=false;
		if(pictureFlag[num] != 0&&pictureFlag[num] != 1) {
			isdelete=true;
			deleteData = pictureFlag[num];
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
					
					var entercode = enterpriseCode;
					var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).loginType;
			        //2为ODC
			        //如果是ODC登录
			        if(isODC==2){			
			        	firmId = localStorage.indexFirmid;
			        }else{
			        	this.firmId = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId
			        }
					var obj ={
		                "filePath": "",
		                "certificateType": "",
		                "orderNo": localStorage.orderNo,
		                "isOrderAttach": 1,
		                "bizType":"",
		                "enterpriseCode":entercode,
		                "bizType":2,
		                "firmId":firmId
		            }
					if(data.code == 0) {
						var data = data.data.fullUrl;
						pictureFlag[num] = data;
						if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
    						var userAgent = navigator.userAgent;
                            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");  
                            reIE.test(userAgent);  
                            var fIEVersion = parseFloat(RegExp["$1"]);  
                            if(fIEVersion <= 9)  { 
                                $("#photo" + num).css("background", "url(" + data + ") no-repeat").css({"filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+data+", sizingMethod='scale')",
        "-ms-filter":" progid:DXImageTransform.Microsoft.AlphaImageLoader(src="+data+", sizingMethod='scale')"});
                            }else if(fIEVersion >=10){
                                $("#photo" + num).css("background", "url(" + data + ") no-repeat").css("background-size","163px 112px");
                            } 
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
						if(scan.length==0){
							if(num==0){
								obj.certificateName="申请书扫描件";
								obj.filePath=data;
								obj.certificateType="0046";
								picflag[0]=data;
								parage=obj;
								tempArr.push(obj);
							}
							if(num==1){
								obj.certificateName="法人授权书扫描件";
								obj.filePath=data;
								obj.certificateType="0047";
								picflag[1]=data;
								parage=obj;
								tempArr.push(obj);
							}
							if(num==2){
								obj.certificateName="银行开户证明扫描件";
								obj.filePath=data;
								obj.certificateType="0048";
								picflag[2]=data;
								parage=obj;
								tempArr.push(obj);
							}
							if(num==3){
								obj.certificateName="对外贸易许可证扫描件";
								obj.filePath=data;
								obj.certificateType="0049";
								picflag[3]=data;
								parage=obj;
								tempArr.push(obj);
							}
						}else{
							if(num==0){
								for(var i=0;i<scan.length;i++){
									if(scan[i].certificateType=="0046"){
										scan[i].filePath=data;
										parage=scan[i];
										picflag[0]=data;
									}
								}
							}
							if(num==1){
								for(var i=0;i<scan.length;i++){
									if(scan[i].certificateType=="0047"){
										scan[i].filePath=data;
										obj.filePath=data;
										parage=scan[i];
										picflag[1]=data;
									}
								}
							}
							if(num==2){
								for(var i=0;i<scan.length;i++){
									if(scan[i].certificateType=="0048"){
										scan[i].filePath=data;
										obj.filePath=data;
										parage=scan[i];
										picflag[2]=data;
									}
								}
							}
							if(num==3){
								for(var i=0;i<scan.length;i++){
									if(scan[i].certificateType=="0049"){
										scan[i].filePath=data;
										obj.filePath=data;
										parage=scan[i];
										picflag[3]=data;
									}
								}
							}		
						}
						if(isdelete){
							service.deletePhoto(deleteData).done(function(data) {
								if(data.code == 0) {
									pictureFlag[num] = 1;
								} else {
									bootbox.alert(data.msg);
								}
							});
						}
						service.orderAttach(parage).done(function(data){
							if(data.code==0){
								pictureFlag[num] = 0;
							} else {
								bootbox.alert(data.msg);
							}
						})
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
                            $(".formPub").remove();        
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
			if(res.data.length == 0) {
				tempObj = {}
			} else {
				tempObj = res.data;
				var str='';
				for(var i=0;i<res.data.length;i++){
					if(tempObj[i].areaCode==areaNumber){
						str+='<option selected value='+tempObj[i].areaCode+'>'+tempObj[i].name+'</option>'
					}else{
						str+='<option value='+tempObj[i].areaCode+'>'+tempObj[i].name+'</option>'
					}
					
				}
				
			}	
			$("#area").append(str);
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
	pagination: function (pageNumber, totalPages) {
        $("#pageLimit li.index").remove();
        var maxShowPage = 5
        var firstShowPage = pageNumber - 2;
        if (firstShowPage <= 0) {
            firstShowPage = 1;
        }
        var lastShowPage = maxShowPage + firstShowPage - 1;
        if (lastShowPage > totalPages) {
            lastShowPage = totalPages;
        }
        if (lastShowPage - firstShowPage + 1 < maxShowPage) {
            firstShowPage = lastShowPage - maxShowPage + 1;
            firstShowPage = Math.max(firstShowPage, 1);
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
        this.pagediv(pageNum, this.model.get("totalPages"))
    },
    PreviousPage(e) {
        this.active = "";
        this.pagediv(1, this.model.get("totalPages"))
    },
    NextPage(e) {
        this.active = $(".NextPage");
        this.pagediv(this.model.get("totalPages"))
    },
	sealShop(areaNumber, pageNumber, pageSize) {
		//获取印章店 	
		$(".sealShopResult").hide();
		var areaN=areaNumber
		var pageNumber = pageNumber || 1;
		var pageSize = pageSize || 5
		service.getSealShop(areaN, pageNumber, pageSize).done(res => {
			if(res.code==0){
				var temp;
				var res=res.data;
				if(res.count == 0) {
					temp = []
				} else {
					temp = res.data;
				}
				var str='';
//				that.model.get("tplhtml").sealShop = temp;
				that.model.set("totalPages", Math.ceil(res.count / res.size))
//				that.$el.html(tpl(that.model.get("tplhtml")))
				that.pagination(pageNumber, Math.ceil(res.count / res.size))
				if(res.data.length==0){
					$(".sealShopResult").show();
					$(".pagination").hide();
				}else{
					$(".sealshopcontent").remove();
					for(var i=0;i<res.data.length;i++){
						str+='<tr class="sealshopcontent"><td class="right"></td>'+
						'<td class="sealName">'+temp[i].name+'</td>'+
						'<td class="address">'+temp[i].address+'</td>'+
						'<td class="telPhone">'+temp[i].phone+'</td>'+
						'<td class="display" style="display: none;">'+temp[i].psShopid+'</td>'+
					'</tr>'
					}
				}
				$(".result table").append(str);
				imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
				imgModalBig('.shadow2', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
				imgModalBig('.shadow3', { 'width': 500, 'src': '../../../../asset/img/bank.jpg' });
				imgModalBig('.shadow4', { 'width': 500, 'src': '../../../../asset/img/trade.jpg' });
				if (pageNumber == 1) {
	                $("li.PreviousPage").addClass("no");
	            } else if (pageNumber == Math.ceil(res.count / res.size)) {
	                $("li.NextPage").addClass("no");
	            } else {
	                $("li.PreviousPage,li.NextPage").removeClass("no");
	            }
//	            for(var i=0;i<=picflag.length-1;i++){
//	            	if(picflag[i]!=0){
//		            	this.clickPage(i);
//		            }
//	            }  
            }
		});	
	},
	option(){
		this.active='';
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
				islegal=data.data.isOperatorLegalPerson;
				var firmId=data.data.firmId;
				//如果是第一次进来
				if(scan.length==0){
					if(islegal==0){
						pictureFlag[1]=1;
						$(".legalScan").show()
					}else{
						$(".legalScan").hide();
					}			
					for(var i=0;i<eseals.length;i++){
						if(eseals[i].esealCategory==4){
							pictureFlag[2]=1;
							$(".bankScan").show();
						};
						if(eseals[i].esealCategory==6){
							pictureFlag[3]=1;
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
				
				var dtd = $.Deferred();
				function test(){
					if(firmId){
						dtd.resolve();
					}else{
						var company={ 
							"params": {"name":data.data.enterpriseName} 
						}
						service.getAreaByCom(company).done(function(data){
							if(data.code==0){
								firmId=data.data[0].id;
								dtd.resolve();
							}else{
								bootbox.alert(data.msg);
								dtd.reject();
							}
						})
					}
					return dtd.promise();
				}
				$.when(test()).then(function(){					
					service.getAreaByFirmId(firmId).done(function(data){
						if(data.code==0){
							areaNumber=data.data.areaNum;
							that.model.get("tplhtml").areaNum = areaNumber;
							that.sealList();
						}else{
							bootbox.alert(data.msg);
						}
					})
					
				})				
			}else{
				bootbox.alert(data.msg)
			}
		})
	},
	goStep4: function() {
		for(var i = 0; i < pictureFlag.length; i++) {
			if(pictureFlag[i] == 1) {
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
		if(scan.length==0){
			stepResult.scanAttaches=tempArr;
		}else{
			stepResult.scanAttaches=scan;
		}
		service.poststep3(stepResult).done(function(data) {
			if(data.code == 0) {
				localStorage.sealShop=stepResult.shopName;
				localStorage.stepNum="#step4";
				window.open('admin.html#step4', '_self');
			} else {
				bootbox.alert(data.msg)
			}
		})
	},
	gostep2:function(){
		localStorage.stepNum="#step2"
	}
});

module.exports = step3;
