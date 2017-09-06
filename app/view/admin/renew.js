var service = require('../../server/service').default;
import tpl from './tpl/renew.html'
import payment from './tpl/payment.html'
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
		var _this = this
//		var esealCode=this.getUrlParam('esealcode');
//     var oid=this.getUrlParam('oid')
	
		var esealCode='4403048020393';	
		var oid='999@5007ZZ1OTE0NDAzMDBNQTVFTkpFWTNR';
        var data = {
			'esealCode':esealCode,
			'oid':oid
        };		
        service.getRenewInfo(data).done(res => {        	
            var renewData;
            if (res.code != 0) {
                renewData = {}
                $(".mainTitle").append("(当前接口请求失败 | "+res.msg +")");
            } else {           	
                renewData = res.data;
                var cont="";
				for( var i=0; i<res.data.length;i++){
					cont+='<span class="time" name="'+i+'">'+res.data[i].productName+'</span>'					
				}
				$("#validz").append(cont);
				$("#validz .time").eq(0).addClass("active");
				
				$(".priceUnitNum").text(res.data[0].price);
				$(".date1").text(res.data[0].validStart);
				$(".date2").text(res.data[0].validEnd);				
				
				$("#validz .time" ).click(function(){
					var i=$(this).attr("name");
					$("#validz .time" ).removeClass("active");
					$(this).addClass("active");					
					$(".priceUnitNum").text(res.data[i].price);
					$(".date1").text(res.data[i].validStart);
					$(".date2").text(res.data[i].validEnd);	
				});
				

            }
        });		
		

		
		

	},	
	gopay:function(){
		alert("去支付了")
		
	}
	

});

module.exports = step4;