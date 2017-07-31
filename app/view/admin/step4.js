import tpl from './tpl/step4.html'
import payment from './tpl/payment.html'
var service = require('../../server/service').default;
var billType=1;
var step4Data;
var invoiceState;
var orderNo = "OFFLINE07252055727334";
var step4 = Backbone.View.extend({
    el: '.container',
    initialize() {},
    events: {
        'click .pay div': 'paystyle',
        'click .account': 'gopay',
        'click input[type="radio"]': 'taxType',
        'click .licence': 'mf9527'
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
    getOrderInfo: function() {
        service.orderStep4(orderNo).done(res => {
            var tempObj;
            if(res.length == 0) {
                console.log("step4无法获取到电子印章订单信息！");
                tempObj = {}
            } else {
                tempObj = res;
                var cont = "";
                var sumPrice = "";
                //				console.log(tempObj.data.esealProducts[0].esealFullName);
                //				console.log(tempObj.data.products[0].productName);
                //				console.log(tempObj.data.products[0].productAmount);
                for(var i = 0; i < tempObj.data.esealProducts.length; i++) {
                    cont += '<div class="order"><span class="serial">' + (i + 1) + '</span><span class="sealName">' + tempObj.data.esealProducts[i].esealFullName + '</span><span class="service">' + tempObj.data.products[0].productName + '</span> <span class="price">' + tempObj.data.products[0].productAmount * tempObj.data.products[0].renewYear + '元</span></div>'
                    sumPrice += tempObj.data.products[0].productAmount * tempObj.data.products[0].renewYear;
                }  //现在就有一种产品 新办理的产品 ，所以就只选第一种价格和名称，全是两年， 全是一个金额，所以才会 tempObj.data.products[0].productName。                              
                $("#step4_orders").append(cont);
                $("#sumPrice , #sumPrice_pay").html(sumPrice + "元");
                step4Data = {
                    "discountAmount": 0,
                    "actualAmount": sumPrice,
                    "orderNo": orderNo,
                    "payType": 2,  //默认微信支付是2
                    //"invoice":""   
                    "esealProducts":tempObj.data.esealProducts  
                }
            }
        })
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
    submitStep4:function(){
    	service.submitStep4(step4Data).done(res => {
    		if( res.code==0){
    			console.log(res.msg);
    		}else{
    			console.log(res.msg);
    		}
    		
    		
    		
    		//获取数据
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
        //console.log(step4Data.actualAmount);
        this.invoiceStates();
        if(invoiceState== true){
        	this.submitStep4();
        }else{
        	console.log("发票信息不全，不能提交订单！");
        }

    },

});

module.exports = step4;