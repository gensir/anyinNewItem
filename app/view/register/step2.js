/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html';
var service = require('../../server/service').default;
var IDNo;
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {
//		this.render();
	},
	events: {
		'click .findPasswordCodeBtn': 'phoneCode',
		'click #goStep3': 'goStep3',
		'keyup .countCode': 'checkCode',
		'keyup .passwd': 'passwd',
	},
	render: function(query) {
		IDNo="111111111111111111"
//		var result = reqres.request("IDCode");
		result="data": {
	        "address": "宝安区松岗街道罗田第三工业区象山大道15号一楼西面",
	        "businessLicenseNumber": "",
	        "legalName": "张三疯",
	        "name": "深圳菱正环保设备有限公司",
	        "uniformSocialCreditCode": "914403005538853123",
	    }
		this.$el.html(tpl);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
	phoneCode: function() {
		this.model.set({ "clickEle": $(event.target).data('id') })
		this.model.isValid()
		//		if((/^1[34578]\d{9}$/.test($(".countPhone").val()))) {
		if(!this.model.isValid()) {
			var phone=$(".countPhone").val();
			service.getSMSVerifCode(phone).done(function(data) {
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
//		console.log(IDNo)
//		this.model.set({ "clickEle": $(event.target).data('id') })
//		this.model.isValid()
//		if($(".passwd").val().length==0){
//			$(".pswErrTip").html("请输入您的密码").css("color","red").show();
//		}
//		if($(".passwd").val()!=$(".checkPasswd").val()){
//			console.log($(".passwd").val(),$(".checkPasswd").val())
//			$(".checkPasswdErrTip").html("您两次输入的密码不一致，请重新填写");
//			return;
//		}
//		if($(".legalID").val()!=IDNo){
//			$(".legalIDErrTip").html("法人身份证号不正").css({ "color": "red" });
//			return;
//		}
//		if(!this.model.isValid()) {
//			var mobile=$(".countPhone").val();
//			var passwd=$(".passwd").val();
//			service.registerUser(mobile,passwd).done(res=>{
//				if(res.code==0){
//					window.open('register.html#step3', '_self')
//				}
//			})
//		}
window.open('register.html#step3', '_self')
	},
	checkCode: function() {
		if($('.countCode').val().length == 6) {
			var code=$(".countCode").val();
			service.checkSmsCode(code).done(function(data) {
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
	passwd: function() {
		$(".pswErrTip").hide();
		var $test1 = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+){8,20}$/; //  弱：纯数字，纯字母，纯特殊字符
		var $test2 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)[a-zA-Z\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$/; //中：字母+数字，字母+特殊字符，数字+特殊字符
		var $test3 = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)(?![\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$)[a-zA-Z\d!@#$%^&*<>/?,.\{\}，。\[\]\'\"\"]+$/; //强：字母+数字+特殊字符
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