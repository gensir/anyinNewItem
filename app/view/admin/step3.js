import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag;
var flag = true;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1': 'changeImg',
		'click tr': 'choice',
		'click #goStep4': 'goStep4',
	},
	render: function(query) {
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
		fileUp(service,event,pictureFlag,num);
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
		window.open('admin.html#step4', '_self');
	}
});

module.exports = step3;