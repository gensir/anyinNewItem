import tpl from './tpl/step4.html'
import payment from './tpl/payment.html'
var service = require('../../server/service').default;
var billType;
var step4 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'click .pay div': 'paystyle',
		'click .account': 'gopay',
		'click input[type="radio"]': 'taxType',
		'click .licence':'mf9527'
	},
	render: function(query) {
		var payments = $($(payment()).prop("outerHTML"));
		this.$el.html(tpl);
		$(".orderMessage").append(payments.find(".bill"));
		$(".step4").append(payments.find(".gopay"));
		this.$el.append(payments.find(".paymentStyle"));
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		this.getOrderInfo();
	},
	getOrderInfo:function(){
		var orderNo="OFFLINE07252055727334";
		service.orderStep4(orderNo).done(res => {
			var tempObj;
			if(res.length == 0) {
				console.log("无法获取到电子印章订单信息！");
				tempObj = {}
			} else {
				tempObj = res;
				
			}					
		})
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
		alert("支付");
	},

	
	
});

module.exports = step4;