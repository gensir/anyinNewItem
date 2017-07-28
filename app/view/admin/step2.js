/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag=[];
var isLegal,stepResult,length;
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1,#file2,#file3,#file4': 'changeImg',
		'click #goStep3': 'goStep3',
	},
	render: function(query) {
		this.$el.html(tpl);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/lince.jpg' });
		imgModalBig('.shadow2,.shadow4', { 'width': 500, 'src': '../../../../asset/img/ID-front.png' });
		imgModalBig('.shadow3,.shadow5', { 'width': 500, 'src': '../../../../asset/img/ID-back.png' });	
		var orderNo = localStorage.orderNo;
		service.getstep2(orderNo).done(function(data){
			if(data.code == 0) {
				stepResult=data.data;
				var attaches=data.data.attaches;
				length=attaches.length;
				if(attaches.length==0){
					if(stepResult.isOperaterLegalPersion==0){
						$(".operate").show();
						pictureFlag = [0, 0, 0, 0, 0]
					}else{
						$(".operate").hide();
						pictureFlag = [0, 0, 0]
					}
				}else{
					for(var i=0;i<attaches.length;i++){
						if(attaches.length==3){
							$(".operate").hide();
							pictureFlag = [0, 0, 0]
						}else{
							pictureFlag = [0, 0, 0, 0, 0]
						}
						if(attaches[i].certificateType=="0002"){
							$("#file0").css({"height":"24px"});
							$(".reset0").show();
							pictureFlag[0]=attaches[i].filePath;
							$("#ajaxForm0 .licence").css({"background":"url("+attaches[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
							imgModalBig('#photo0', { 'width': 500, 'src': attaches[i].filePath });
						}else if(attaches[i].certificateType=="0032"){
							$("#file1").css({"height":"24px"});
							$(".reset1").show();
							pictureFlag[1]=attaches[i].filePath;
							$("#ajaxForm1 .licence").css({"background":"url("+attaches[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
							imgModalBig('#photo1', { 'width': 500, 'src': data.data.attaches[1].filePath });
						}else if(attaches[i].certificateType=="0044"){
							$("#file2").css({"height":"24px"});
							$(".reset2").show();
							pictureFlag[2]=attaches[i].filePath;
							$("#ajaxForm2 .licence").css({"background":"url("+attaches[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
							imgModalBig('#photo2', { 'width': 500, 'src': attaches[i].filePath });
						}else if(attaches[i].certificateType=="0033"){
							$("#file3").css({"height":"24px"});
							$(".reset3").show();
							$(".operate").hide();
							pictureFlag[3]=attaches[i].filePath;
							$("#ajaxForm4 .licence").css({"background":"url("+attaches[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
							imgModalBig('#photo4', { 'width': 500, 'src': attaches[i].filePath });
						}else if(attaches[i].certificateType=="0045"){
							$("#file4").css({"height":"24px"});
							$(".reset4").show();
							pictureFlag[4]=attaches[i].filePath;
							$("#ajaxForm5 .licence").css({"background":"url("+attaches[i].filePath+") no-repeat"}).css({"background-size":"163px 112px"})
							imgModalBig('#photo5', { 'width': 500, 'src': attaches[i].filePath });
						}
					}
				}
			} else {
				bootbox.alert(data.msg);
			}
		})
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
					var obj ={
		                "filePath": "",
		                "certificateType": "",
		                "orderNo": "",
		                "isOrderAttach": 1
		            }
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
						};
						if(num==0){
							for(var j=0;j<length;j++){
								if(stepResult.attaches[j].certificateType=="0002"){
									stepResult.attaches[j].filePath=data;
								}
							}
							if(length<3){
								obj.filePath=data;
								obj.certificateType='0002';
								obj.orderNo=stepResult.orderNo;
								obj.isOrderAttach=1;
								stepResult.attaches[0]=obj;
							}
						};
						if(num==1){
							for(var j=0;j<length;j++){
								if(stepResult.attaches[j].certificateType=="0032"){
									stepResult.attaches[j].filePath=data;
								}
							}
							if(length<3){
								obj.filePath=data;
								obj.certificateType='0032';
								obj.orderNo=stepResult.orderNo;
								obj.isOrderAttach=1;
								stepResult.attaches[1]=obj;
							}
						};
						if(num==2){
							for(var j=0;j<length;j++){
								if(stepResult.attaches[j].certificateType=="0044"){
									stepResult.attaches[j].filePath=data;
								}
							}
							if(length<3){
								obj.filePath=data;
								obj.certificateType='0044';
								obj.orderNo=stepResult.orderNo;
								obj.isOrderAttach=1;
								stepResult.attaches[2]=obj;
							}
						};
						if(num==3&&length>3){
							for(var j=0;j<length;j++){
								if(stepResult.attaches[j].certificateType=="0033"){
									stepResult.attaches[j].filePath=data;
								}
							}
						}else if(num==3){
							var obj={
								"orderNo":stepResult.orderNo,
								"filePath":data,
								"certificateType":"0033",
								"isOrderAttach":"1"
							}
							stepResult.attaches[3]=obj;
						};
						if(num==4&&length>3){
							for(var j=0;j<length;j++){
								if(stepResult.attaches[j].certificateType=="0045"){
									stepResult.attaches[j].filePath=data;
								}
							}
						}else if(num==4){
							var obj={
								"orderNo":stepResult.orderNo,
								"filePath":data,
								"certificateType":"0045",
								"isOrderAttach":"1"
							}
							stepResult.attaches[4]=obj;
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
	goStep3: function() {
		console.log(pictureFlag)
		for(var i = 0; i < pictureFlag.length; i++) {
			if(pictureFlag[i] == 0) {
				var dialog = bootbox.alert({
					className: "uploadPhoto",
					message: "请上传全部图片",
				})
				return;
			}
		};
		
		service.poststep2(stepResult).done(function(data) {
			if(data.code == 0) {
				window.open('admin.html#step3', '_self');
			} else {
				console.log(data.msg)
			}
		})
	}
});

module.exports = step2;