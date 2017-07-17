/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html';
var service = require('../../server/service').default;
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {
		this.render();
	},
	events: {
		'click .findPasswordCodeBtn': 'phoneCode',
		'click #goStep3': 'goStep3',
		'keyup .countCode': 'checkCode',
		'keyup .passwd': 'passwd',
	},
	phoneCode: function() {
		this.model.set({ "clickEle": $(event.target).data('id') })
		this.model.isValid()
		//		if((/^1[34578]\d{9}$/.test($(".countPhone").val()))) {
		if(!this.model.isValid()) {
			service.getSMSVerifCode().done(function(data) {
				if(data.code == 0) {
					var countdown = 60;
					var ele = $(".findPasswordCodeBtn");

					function settime() {
						if(countdown == 0) {
							ele.removeAttr("disabled");
							ele.val("获取验证码");
							countdown = 60;
							clearTimeout(ele[0].settimes);
							return false;
						} else {
							ele.attr("disabled", true);
							ele.val("重新发送(" + countdown + ")");
							countdown--;
						}
						ele[0].settimes = setTimeout(function() {
							settime(ele)
						}, 1000)
					};
					settime();
					return false;
				} else {
					$(".phoneErrTip").html(data.msg).show();
				}
			})
		}
	},
	goStep3: function(event) {
		if($(".passwd").val().length==0){
			$(".pswErrTip").html("请输入您的密码").css("color","red").show();
		}
		if($(".passwd").val()!=$(".checkPasswd").val()){
			console.log($(".passwd").val(),$(".checkPasswd").val())
			$(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写");
			return;
		}
		this.model.set({ "clickEle": $(event.target).data('id') })
		this.model.isValid()
		if(!this.model.isValid()) {
			//提交账号信息给后台
			window.open('register.html#step3', '_self')
		}
	},
	checkCode: function() {
		if($('.countCode').val().length == 6) {
			service.checkSmsCode().done(function(data) {
				if(data.code == 0) {
					$(".codeErrTip").html(data.msg).css({ "color": "#08c34e" });
				} else {
					$(".codeErrTip").html(data.msg).css({ "color": "red" });
				}
			})
		} else {
			$('.codeErrTip').html('');
		}
	},
	render: function(query) {
		var result = reqres.request("IDCode");
		this.$el.html(tpl);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
	passwd: function() {
		$(".pswErrTip").hide();
		var $test1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*<>/?,.]+){6,18}$/; //  弱：纯数字，纯字母，纯特殊字符
		var $test2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/; //中：字母+数字，字母+特殊字符，数字+特殊字符
		var $test3 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/; //强：字母+数字+特殊字符
		if($test1.test($('.passwd').val())) { //满足弱
			$(".weak").show();
			if($test2.test($('.passwd').val())) { //满足中
				$(".pswMiddle").show();
				if($test3.test($('.passwd').val())) {
					$(".pswStrong").show();
				}
			} else {
				$(".pswStrong").hide();
				$(".pswMiddle").hide();
			}
		} else {
			$(".weak").hide();
			$(".pswMiddle").hide();
			$(".pswStrong").hide();		
		}
	}
});
module.exports = step2;