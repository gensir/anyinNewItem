import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
var picture = [0, 0];
var flag = true;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0': 'changeImg0',
		'change #file1': 'changeImg1',
		'click tr': 'choice',
		'click #goStep4': 'goStep4',
	},
	render: function(query) {
		this.$el.html(tpl);
		picture = [0, 0];
		flag = true;
		imgModalBig('.digitalExample', { 'width': 500, 'src': '../../../../asset/img/apply.jpg' });
		imgModalBig('.exampleScan', { 'width': 500, 'src': '../../../../asset/img/proxy.jpg' });
	},
	changeImg0: function() {
		var num = 0;
		this.changeImg(num);
	},
	changeImg1: function() {
		var num = 1;
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
	choice: function(event) {
		flag=false;
		var ele = event.target;
		$('.step3 tr').css({ 'background': '#fff' })
		$('.step3 .right').removeClass('currentRight');
		$(ele).parent().css({ 'background': '#00acff' })
		$(ele).parent().find('.right').addClass('currentRight');
		$(".curr-choice").html($(ele).parent().find('.sealName').html());
	},
	goStep4: function() {
		if(picture[0] == 0) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请上传《数字证书及电子印章申请表及用户责任书》扫描件",
			})
			return;
		};
		if(picture[1] == 0) {
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请上传《法人授权书》扫描件",
			})
			return;
		};
		console.log(flag);
		if(flag){
			var dialog = bootbox.alert({
				className: "uploadPhoto",
				message: "请选择刻章店",
			})
			return;
		};
		window.open('order.html#step4','_self');
	}
});

module.exports = step3;