/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag;
var result;
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

		result = reqres.request("foo");
		if(result == 1) {
			$(".operate").hide();
			pictureFlag = [0, 0, 0]
		} else {
			pictureFlag = [0, 0, 0, 0, 0]
		}
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
						if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
    						$("#photo" + num).css("background", "url(" + data + ") no-repeat");
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
				complete: function() {
					setTimeout(function() {
						$(event.target).parent().removeClass("form");
						$(".formPub").remove();
					}, 100);
				},
			})
		}, 200)
	},
	goStep3: function() {
		for(var i = 0; i < pictureFlag.length; i++) {
			if(pictureFlag[i] == 0) {
				var dialog = bootbox.alert({
					className: "uploadPhoto",
					message: "请上传全部图片",
				})
				return;
			}
		};
		if(result == 1) {
			pictureFlag = "[" + pictureFlag[0] + "," + pictureFlag[1] + "," + pictureFlag[2] + "]";
		} else {
			pictureFlag = "[" + pictureFlag[0] + "," + pictureFlag[1] + "," + pictureFlag[2] + "," + pictureFlag[3] + "," + pictureFlag[4] + "]";
		}
		var data = {
			"bizType": 2,
			"enterpriseCode": "233434344344", //组织机构代码 或 统一社会信用代码（优先）
			"urls": pictureFlag,
			"esealCode": "2132323232",
		}
		service.attach(data).done(function(data) {
			if(data.code == 0) {
				window.open('admin.html#step3', '_self');
			} else {
				console.log(data.msg)
			}
		})
	}
});

module.exports = step2;