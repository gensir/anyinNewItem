import tpl from './tpl/renew.html'
import payment from './tpl/payment.html'
var service = require('../../server/service').default;
var billType=1;
var step4Data;
var invoiceState;
var serialNo;  //开发票需要用的序号
var payOrderStatuNum=0;
var orderNo;
//var esealcode=window.location.hash.split("?")[1].split(/[=&]/)[1];



var step4 = Backbone.View.extend({
	el: '.container',
	initialize() {
    },
	events: {
		'click .pay div': 'paystyle',
		'click .account': 'gopay'
	},
	render: function(query) {
        var payments = $($(payment()).prop("outerHTML"));
		this.$el.html(tpl);
        $(".orderMessage").append(payments.find(".bill"));
         $(".step4").append(payments.find(".gopay"));
         this.$el.append(payments.find(".paymentStyle"));
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		
		this.renewInfo();
	},
    paystyle: function(event) {
        $('.pay .payway').removeClass("active")
        var ele = event.target;
        $(ele).addClass("active")
        step4Data.payType = $(ele).attr("name");
    },
	gopay1: function() {
		bootbox.dialog({
			className: "errorTips",
			title: "<div class='title'>未实名提示</div>",
			message: "<div class='message'>"+
			"<div class='icon'><span></span></div>"+
			"<div class='errorOrderTips'>"+
			"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>"+
			"<div class='errorOrderSeal'>"+
			"<span>电子行政章</span><span>电子行政章</span></div>"+
			"<div class='errorOrderRed'>新建订单将覆盖原有的订单,您需要重新填写资料</div></div><div class='clear'></div></div>",
			buttons: {
                cancel: {
                    label: "返回",
                    className: "btn1"
                },
                confirm1: {
                    label: "继续该订单",
                    className: "btn2",
                    callback: function () {
                        $(this).find(".message").html(123);
                        console.log($(this).find(".message").html())
                        if (i = 5) {
                            return false;
                        }

                    }
                },
                confirm2: {
                    label: "新建订单",
                    className: "btn3",
                    callback: function () {
                        window.location.href = "order.html#step1";
                    }
                }
            }
		})
	},
	getUrlParam: function(name){
	    var after = window.location.hash.split("?")[1];
	    if(after)
	    {
	        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	        var r = after.match(reg);
	        if(r != null)
	        {
	            return  decodeURIComponent(r[2]);
	        }
	        else
	        {
	            return null;
	        }
	    }		
	},
	renewInfo:function(){
		var esealcode=this.getUrlParam('esealcode');
		var oid=this.getUrlParam('oid') || '14154545';
        var data = {
			'esealcode':esealcode,
			'oid':oid,
        };		
        service.getRenewInfo(esealcode, oid).done(res => {
            var renewData;
            if (res.code != 0) {
                renewData = {}
                $(".mainTitle").append("订单信息 (当前接口请求失败)");
            } else {
                renewData = res.data.list;
                _this.model.get("tpl").renewData = renewData;
                _this.$el.html(tpl(_this.model.get("tpl")));
            }
        });		
		
		

	},	
	gopay:function(){
		alert("去支付了")
		
	}
	

});

module.exports = step4;