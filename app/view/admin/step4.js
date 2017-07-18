import tpl from './tpl/step4.html'
import payment from './tpl/payment.html'
var billType;
var step4 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'click .pay div': 'paystyle',
		'click .account': 'gopay',
		'click input[type="radio"]': 'taxType'
	},
	render: function(query) {
		var payments = $($(payment()).prop("outerHTML"));
		this.$el.html(tpl);
		$(".orderMessage").append(payments.find(".bill"));
		$(".step4").append(payments.find(".gopay"));
		this.$el.append(payments.find(".paymentStyle"));
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
	paystyle: function(event) {
		$('.pay div').css({ 'border': '1px solid #dedede' })
		var ele = event.target;
		$(ele).css({ 'border': '1px solid #00acff' })
	},
	taxType:function(event){
		billType=event.target.value
		if(billType==1){
			$(".company").hide()
			$(".person").show()
		}else if(billType==2){
			$(".company").show()
			$(".person").hide()
		}else{
			$(".company").hide()
			$(".person").hide()
		}
	},
	gopay: function() {
		bootbox.dialog({
			className: "errorTips",
			title: "<div class='title'>新办电子印章提示</div>",
			message: "<div class='message'>" +
				"<div class='icon'><span></span></div>" +
				"<div class='errorOrderTips'>" +
				"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
				"<div class='errorOrderSeal'>" +
				"<span>电子行政章</span><span>电子行政章</span></div>" +
				"<div class='errorOrderRed'>新建订单将覆盖原有的订单,您需要重新填写资料</div></div><div class='clear'></div></div>",
			buttons: {
				cancel: {
					label: "返回",
					className: "btn1"
				},
				confirm1: {
					label: "继续该订单",
					className: "btn2",
					callback: function() {
						$(this).find(".message").html(123);
						console.log($(this).find(".message").html())
						if(i = 5) {
							return false;
						}

					}
				},
				confirm2: {
					label: "新建订单",
					className: "btn3",
					callback: function() {
						window.location.href = "admin.html#step1";
					}
				}
			}
		})
	},
});

module.exports = step4;