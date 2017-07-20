/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step3.html'
import { imgModalBig } from '../../publicFun/public'
import { fileUp } from '../../publicFun/public'
var service = require('../../server/service').default;
//var picture = [];
var pictureFlag = [0, 0, 0];
var enterpriseCode;
var step3 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'change #file0,#file1,#file2': 'changeImg',
		'click #goStep4': 'goStep4'
	},
	render: function(query) {
		this.$el.html(tpl);
		enterpriseCode = reqres.request("IDCode");
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
		fileUp(service,event,pictureFlag,num);
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
		var data = {
			"bizType": 4,
			"enterprise": enterpriseCode,  //组织机构代码 或 统一社会信用代码（优先）
			"urls": pictureFlag
		}
		service.attach(data).done(function(data) {
			if(data.code == 0) {
				window.open('register.html#step4', '_self');
			} else {
				console.log(data.msg)
			}
		})
	}
});

module.exports = step3;