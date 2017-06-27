/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	render: function(query) {
		this.$el.html(tpl);
		imgModalBig('.businessLicense', { 'width': 500, 'src': '../../../../asset/img/lince.jpg' });
		imgModalBig('.frontPhoto', { 'width': 500, 'src': '../../../../asset/img/ID-up.jpg' });
		imgModalBig('.backPhoto', { 'width': 500, 'src': '../../../../asset/img/ID-down.jpg' });
	},
	changeImg: function() {
		alert(1)
		var num = 0;
		var preview = document.getElementById('photo' + num);
		var file = document.getElementById("file" + num);
		if(typeof FileReader == 'undefined') {
			//			_self.img[num] = file.value;
			//			$(_eve.target).select();
			//			$(_eve.target).blur()
			var path = document.selection.createRange().text;
			// preview.innerHTML = '<div class="img" style="width:127px;height: 87px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>';
			document.getElementById('photo' + num).style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")";
		} else {
			var reader = new FileReader();
			reader.readAsDataURL(file.files[0]);
			reader.onload = function(e) {
				preview.src = e.target.result;
			}
		}
	}
});

module.exports = step3;