/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0': 'changeImg0',
		'change #file1': 'changeImg1',
		'change #file2': 'changeImg2',
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
	changeImg: function(num) {
		var preview = document.getElementById('photo' + num);
		var file = document.getElementById("file" + num);
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
			image.onload = function() {
				var height = image.height;
				var width = image.width;
				console.log(height, width)
				if((height/width) > (112/163)) {
					$("#photo" + num).css("background-size", "auto 112px");
				}else{
					$("#photo" + num).css("background-size", "163px auto");
				}
			};
			
			$("#file0").height(24);
			$("#ajaxForm0 a").show()
			$("#photo" + num).css("background", "url(" + this.result + ") no-repeat center center");
		}
		//		}
	}
});

module.exports = step3;