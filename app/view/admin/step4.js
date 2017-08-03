import tpl from './tpl/step4.html'
import payment from './tpl/payment.html'
var service = require('../../server/service').default;
var billType=1;
var step4Data;
var invoiceState;
//var orderNo = localStorage.orderNo || "OFFLINE08011174248425";

var orderNo="OFFLINE07252055727334";
//var orderNo="OFFLINE08011174248425";

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
/*              
                tempObj={
				    "code": 0,
				    "data": {
				        "actualAmount": null,
				        "discountAmount": null,
				        "discounts": [
				            {
				                "createTime": "2017-07-24 18:05:29",
				                "id": 1,
				                "isDelete": 0,
				                "privilegeAmount": 1,
				                "privilegeIndate": "2017-07-27 19:14:53",
				                "privilegeName": "deeee",
				                "privilegeScheme": 1,
				                "privilegeYears": 1,
				                "updateTime": null
				            }
				        ],
				        "esealProducts": [
				            {
				                "esealCode": "4403030002622",
				                "esealFullName": "深圳市新秀宾馆03",
				                "id": 100000557,
				                "orderNo": "OFFLINE07252055727334",
				                "payAmount": null,
				                "productAmountId": null,
				                "productPrivilegeId": null,
				                "validEnd": null,
				                "validStart": null
				            }
				        ],
				        "invoice": null,
				        "orderAmount": null,
				        "orderNo": "OFFLINE07252055727334",
				        "payType": null,
				        "products": [
				            {
				                "createTime": "2017-07-24 18:05:07",
				                "id": 1,
				                "isDelete": 0,
				                "privilegeScheme": 1,
				                "productAmount": 12,
				                "productFirm": 1,
				                "productIndate": "2017-07-28 18:05:07",
				                "productName": "ddeeee",
				                "productType": 1,
				                "renewYear": 2,
				                "updateTime": null
				            }
				        ]
				    },
				    "msg": "请求成功"
				}
*/                
                var cont = "";
                var sumPrice = "";
                if( tempObj.data.esealProducts || tempObj.data.esealProducts !=null ){                	
                }else{ 
					var dialog = bootbox.alert({
						className: "alert",
						message: "印章产品信息不存在，请核对数据！",
					})                                
                }
                for(var i = 0; i < tempObj.data.esealProducts.length; i++) {
                    cont += '<div class="order"><span class="serial">' + (i + 1) + '</span><span class="sealName">' + tempObj.data.esealProducts[i].esealFullName + '</span><span class="service">' + tempObj.data.products[0].productName + '</span> <span class="price">' + tempObj.data.products[0].productAmount  + '元</span></div>'
                    sumPrice += tempObj.data.products[0].productAmount;
                }  //现在就有一种产品 新办理的产品 ，所以就只选第一种价格和名称，全是两年， 全是一个金额，所以才会 tempObj.data.products[0].productName。                              
                $("#step4_orders").append(cont);
                $("#sumPrice , #sumPrice_pay").html(sumPrice + "元");
                step4Data = {
                    "discountAmount": 0,
                    "actualAmount": sumPrice,
                    "orderNo": orderNo,
                    "payType": 2,  //默认微信支付是2
                    //"invoice":""   
                    "esealProducts":tempObj.data.esealProducts,                        
                }
                step4Data.esealProducts[0].payAmount=parseInt(sumPrice);
                step4Data.esealProducts[0].productAmountId=tempObj.data.products[0].id;
                step4Data.esealProducts[0].productPrivilegeId="";
                step4Data.esealProducts[0].validStart=tempObj.data.products[0].createTime;
                step4Data.esealProducts[0].validEnd=tempObj.data.products[0].productIndate;
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
				
    		}else{
    			console.log(res.msg);
    		}
    	});
    },
    weixinPay:function(codeUrl){
    	var wxQrImgSrc=service.qrCode(codeUrl);
    	var allAmount=step4Data.actualAmount;  //orderNo
			bootbox.dialog({
				className: "payTips",
				title: '<div class="title"><p>订单编号：'+orderNo+'</p></div>',
				message: '<div class="cont"><div class="wxpay01"></div><div class="money">应付金额：￥<span>'+allAmount
								+'</span></div><div class="clearboth"></div><div class="wx_l"><img class="ewm" src=".'+wxQrImgSrc+'"><div class="wx_l_d"></div> </div> <div class="wx_r"></div><div class="clearboth"></div></div>'
				,
				buttons: {
					cancel: {
						label: "返回订单",
						className: "btn1"
					}
				}
			})    	
    },
    paymentEnter:function(resPayType){
    	var paymentData={
    		"orderNo":orderNo,
    		"payType":resPayType
    	};
    	service.payment(paymentData).done(res => {
    		if( res.code == 0){  //支付宝或者银联请求成功
    			
    		}else{
    			console.log("支付宝或者银联请求失败！| "+res.code);
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