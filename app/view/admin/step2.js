/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
var pictureFlag ;
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
		
		var result = reqres.request("foo");
		if(result==1){
			$(".operate").hide();
			pictureFlag=[0,0,0]
		}else{
			pictureFlag=[0,0,0,0,0]
		}
	},
	changeImg: function(event) {	
		var fileVal = $(event.target).val();
		if(!fileVal) {
			return;
		}
		var num = $(event.target).data('id');
		fileUp(service,event,pictureFlag,num);
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
		var data = {
			"bizType": 2,
			"enterprise": "233434344344",  //组织机构代码 或 统一社会信用代码（优先）
			"urls": pictureFlag,
			"esealCode":"2132323232" ,
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