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
		'click .account': 'gopay',
        'click input[type="radio"]': 'taxType',		
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
    taxType: function(event) {
        billType = event.target.value;
        $("#taxTips").text("");
        if(billType == 1) {
            $(".company").hide();
            $(".person").show();
        } else if(billType == 2) {
            $(".company").show();
            $(".person").hide();
        } else if(billType == 3) {
            $(".company").hide();
            $(".person").hide();
        }
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
				
                step4Data = {
                    "payType": 2,  //默认微信支付是2
                    //"invoice":"",   
              		'eseal':res.data[0]
                }
				
				$("#sumPrice_pay").text(res.data[0].totalPrice + "元")
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
					$("#sumPrice_pay").text(res.data[i].totalPrice + "元")
					step4Data.eseal=res.data[i]
					
				});
				

            }
        });		
		

		
		

	},	
    invoiceStates: function(event) {
        if(billType == 1) {    
            if( $("#invoice_user").val() =="" ){
            	invoiceState=false;
            	$("#taxTips").text("请填写个人发票抬头！")
            }else{
            	var invoice1={
            		"orderNo":orderNo,
            		"invoiceType":0,
            		"invoiceHeader":$("#invoice_user").val(),             		        		
            	};
            	step4Data.invoice=invoice1;
            	invoiceState=true;
            }
        }else if(billType == 2){
             if($("#invoice_company").val() =="" || $("#invoice_taxpayer").val() ==""  ) {
             	invoiceState=false;
             	$("#taxTips").text("请填写企业发票抬头，并输入15、18或20位的纳税人识别号！")
            }else{
            	var invoice2={
            		"orderNo":orderNo,
            		"invoiceType":0,
            		"invoiceHeader":$("#invoice_company").val(),                		
	           		"buyerTaxerNo":$("#invoice_taxpayer").val(),            		
            	};
            	step4Data.invoice=invoice2;            	
            	invoiceState=true;
            }       		
        }else if(billType == 3){
        	invoiceState=true;
        }      
        $(".taxBox input").keyup(function(){
        	$("#taxTips").text("");
        })
    },
    gopay: function() {
        this.invoiceStates();
        if(invoiceState== true){
        	this.submitStep4();
        }else{
        	console.log("发票信息不全，不能提交订单！");
        }

    },
    submitStep4:function(){
    	console.log(step4Data);
    	service.orderRenew(step4Data).done(res => {
//  		if( res.data.invoice){
//  			serialNo=res.data.invoice.serialNo;
//  		}    		
    		//alert(serialNo);
    		if( res.code==0){
    			//console.log(res.data.codeUrl);   	 //返回微信的连接codeUrl
    			var codeUrl=res.data.codeUrl;
    			var resPayType=step4Data.payType;
    			if( resPayType ==1 ){   //去处理支付宝的弹框
					this.paymentEnter(resPayType);
    			}else if( resPayType ==2 ){  //去处理微信
    				this.weixinPay(codeUrl);	
    			}else if( resPayType ==3 ){ //去处理银联
    				this.paymentEnter(resPayType);
    			}
				return;
    		}else{
    			console.log(res.msg);
    		}
    	});
    },
	

});

module.exports = step4;