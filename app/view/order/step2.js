/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
import { imgModalBig } from '../../publicFun/public'
var picture = [0, 0, 0, 0, 0];
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0': 'changeImg0',
		'change #file1': 'changeImg1',
		'change #file2': 'changeImg2',
		'change #file3': 'changeImg3',
		'change #file4': 'changeImg4',
		'click #goStep3': 'goStep3',
	},
	render: function(query) {
		this.$el.html(tpl);
		imgModalBig('.businessLicense', { 'width': 500, 'src': '../../../../asset/img/lince.jpg' });
		imgModalBig('.frontPhoto', { 'width': 500, 'src': '../../../../asset/img/ID-front.png' });
		imgModalBig('.backPhoto', { 'width': 500, 'src': '../../../../asset/img/ID-back.png' });
	},
	changeImg0: function() {
		var num = 0;
		this.changeImg(num);
	},
	changeImg1: function() {
		var num = 1;
		this.changeImg(num);
	},
	changeImg2: function() {
		var num = 2;
		this.changeImg(num);
	},
	changeImg3: function() {
		var num = 3;
		this.changeImg(num);
	},
	changeImg4: function() {
		var num = 4;
		this.changeImg(num);
	},
	changeImg: function(num) {
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
		//		if(typeof FileReader == 'undefined') {
		//			//			_self.img[num] = file.value;
		//			//			$(_eve.target).select();
		//			//			$(_eve.target).blur()
		//			var path = document.selection.createRange().text;
		//			// preview.innerHTML = '<div class="img" style="width:127px;height: 87px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
		//			document.getElementById('photo' + num).style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")";
		//		} else {
		var reader = new FileReader();
		reader.readAsDataURL(file.files[0]);
		reader.onload = function(e) {
			var image = new Image();
			image.src = this.result;
			picture[num] = this.result;
			image.onload = function() {
				var height = image.height;
				var width = image.width;
				if((height / width) > (112 / 163)) {
					$("#photo" + num).css("background-size", "auto 112px");
				} else {
					$("#photo" + num).css("background-size", "163px auto");
				}
			};
			$("#file" + num).height(24);
			$(".reset" + num).show()
			$("#photo" + num).css("background", "url(" + this.result + ") no-repeat center center");
			imgModalBig('#photo' + num, { 'width': 500, 'src': picture[num] });
		}
		//		}
	},
	goStep3: function() {
		for(var i=0;i<picture.length;i++){
			if(picture[i] == 0) {
				var dialog = bootbox.alert({
					className: "uploadPhoto",
					message: "请上传全部图片",
				})
				return;
			}
		};
		window.open('order.html#step3', '_self');
	}

});

module.exports = step2;