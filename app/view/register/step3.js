/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
var service = require('../../server/service').default;
//var picture = [];
var pictureFlag = [0, 0, 0];
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1,#file2': 'changeImg',
		'click #goStep4': 'goStep4'
	},
	render: function(query) {
		this.$el.html(tpl);
		pictureFlag = [0, 0, 0];
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		imgModalBig('.shadow1', { 'width': 500, 'src': '../../../../asset/img/lince.jpg' });
		imgModalBig('.shadow2', { 'width': 500, 'src': '../../../../asset/img/ID-front.png' });
		imgModalBig('.shadow3', { 'width': 500, 'src': '../../../../asset/img/ID-back.png' });
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
			service.deletePhoto().done(function(data) {
				if(data.code == 0) {
					console.log(data.msg);
				} else {
					console.log(data.msg);
				}
			});
		}
		$("#ajaxForm" + num).ajaxSubmit({
			url: '/api/mp/file',
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
				$(".progress").css({ "width": percentVal + '%' });
			},
			success: function(data) {
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
		window.open('register.html#step4', '_self');
	}

});

module.exports = step3;