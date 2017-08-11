import tpl from './tpl/step4.html'
import payment from './tpl/payment.html'
var service = require('../../server/service').default;
var billType=1;
var step4Data;
var invoiceState;
var serialNo;  //开发票需要用的序号
var payOrderStatuNum=0;
var orderNo = localStorage.orderNo || "OFFLINE08071088058690";

//var orderNo="OFFLINE07252055727334";
//var orderNo="OFFLINE08011174248425";

var step4 = Backbone.View.extend({
    el: '.container',
    initialize() {},
    events: {
        'click .pay div': 'paystyle',
        'click .account': 'gopay',
        'click input[type="radio"]': 'taxType',
        'click .licence': 'mf9527',
        'click #goStep3':'gostep3'
    },
    render: function(query) {
    	if(localStorage.stepNum!="#step4"){
			return;
		}
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
                if( tempObj.data.esealProducts || tempObj.data.esealProducts !=null ){                	
                }else{ 
					var dialog = bootbox.alert({
						className: "alert",
						message: "印章产品信息不存在，请核对数据！",
					})                                
                }
                for(var i = 0; i < tempObj.data.esealProducts.length; i++) {
                    cont += '<div class="order"><span class="serial">' + (i + 1) + '</span><span class="sealName">' + tempObj.data.esealProducts[i].esealFullName + '</span><span class="service">' + tempObj.data.products[0].productName + '</span> <span class="price">' + tempObj.data.products[0].productAmount  + '元</span></div>'
                    sumPrice +=Number(tempObj.data.products[0].productAmount);
                    sumPrice=Number(sumPrice)
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
    	console.log(step4Data);
    	service.submitStep4(step4Data).done(res => {
    		if( res.data.invoice){
    			serialNo=res.data.invoice.serialNo;
    		}    		
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
			}) ;
		var that=this;	
		setTimeout(function(){ that.payOrderStatus() } ,3000);

    },
    paymentEnter:function(resPayType){
    	var paymentData={
    		"orderNo":orderNo,
    		"payType":resPayType
    	};
    	service.payment(paymentData).done(res => {
    		if( res.code == 0){  //支付宝或者银联请求成功
    			var requestUrl=res.data.requestUrl;
    			var payDate=res.data;
				delete payDate["requestUrl"]; 
				if(resPayType ==1 ){
					this.payAlertPageGo( payDate,requestUrl);		
				}else if( resPayType ==3 ){
					this.payAlertPageYL( payDate,requestUrl);		
				}
    			return;
    		}else{
    			console.log("支付宝或者银联请求失败！| "+res.code);
    		}
    	});
    	
    },
    payAlertPageGo:function( payDate,requestUrl ){	
		var temp = ""; 
		for(var i in payDate){ 
			temp += i+"="+payDate[i]  +"&"; 
		} 
		var ifrSRC=requestUrl+"?"+temp;		
					bootbox.dialog({
						className: "alipayAlert",
						message: '<iframe src="" width="1100" height="700" id="aliiframe"></iframe> ',
						buttons: {							
						}
					})	;			
		$("#aliiframe").attr("src", ifrSRC );
		var that=this;	
		setTimeout(function(){ that.payOrderStatus() } ,3000);
    },
    payAlertPageYL:function( payDate,requestUrl ){    
//  	var payDatexg="txnType="+payDate.txnType+"&frontUrl="+payDate.frontUrl+"&channelType="+payDate.channelType+
//  								"&currencyCode="+payDate.currencyCode+
//  								"&merId="+payDate.merId+"&txnSubType="+payDate.txnSubType+"&txnAmt="+payDate.txnAmt+"&version="+payDate.version+"&signMethod="+payDate.signMethod+
//  								"&backUrl="+payDate.backUrl+"&certId="+payDate.certId+"&encoding="+payDate.encoding+"&bizType="+payDate.bizType+"&signature="+payDate.signature+"&orderId="+payDate.orderId+
//  								"&accessType="+payDate.accessType+"&txnTime="+payDate.txnTime


		var payDatexg="";
				for(var i in payDate){
					var payDateURI=encodeURIComponent( payDate[i] );
					payDatexg += i+"="+payDateURI+"&"; 
				}
//var payDatexg="txnType=01&frontUrl=http%3A%2F%2F183.62.140.54%2Fyzpm_dev%2FMenuController%2Fapp.yzpm.signet.SignetRenewHistoryPanel&channelType=07&currencyCode=156&merId=898110273110130&txnSubType=01&txnAmt=1&version=5.0.0&signMethod=01&backUrl=http%3A%2F%2F183.62.140.54%2Feseal%2Forder%2FunionpayNotify&certId=69933950484&encoding=UTF-8&bizType=000201&signature=cPngSNV5q4jykBye77t5NX7LIu%2BXUxHBaqBx6nhbbdYrWiz%2FQA947PYaTfZZFPifqwWwnQcjfSX4IT7WoYLK93WgYrCHEBiJToeEjtxDLdjUUYwpgtzVabwt5oUj%2F7N%2Bjjobo4IZm%2F34OaYNXpGDhbeBAU49K14WNSKsEdsB6gho3s6xisHtGRurg6U%2FhXs1sfNPoAsmXpp%2FADL%2B79cxEpCmAdcjC7fNHezYLsq3k0ZLpD%2FYoPWm0WCig2W1lKIukSqLiAjJc5YejX6etWV%2B1kqKP92mb93cAi0xarg0NyBuISLVlT7Xy8LmuqOad3wrqnD9XHe2QmX3BzRTnZsFTg%3D%3D&orderId=OFFLINE08071088058690&txnTime=20170809113200&accessType=0"
    	service.unYlyl(payDatexg).done(res => {   		
			this.createIframe(res);	
    	}).fail(res=>{
    		console.log(res);
    	});    	
  	},   
    createIframe(content, addBody) {
        $(".payment-modal-content").empty();
        $("#payment").modal("show");
        var iframe = document.createElement('iframe');
        var ifr = document.getElementsByClassName('payment-modal-content')[0].appendChild(iframe);
        var ifr_doc = ifr.contentWindow.document;
        ifr.frameborder = '1px';
        ifr.height = '100%';
        ifr.width = '100%';
        ifr.style.display = 'inline';
        var loadjs = content;
        if(addBody){
            loadjs = '<html><body clss="body_iframe">' + loadjs + '</body></html>';
        }
        ifr_doc.open();
        ifr_doc.write(loadjs);
        ifr_doc.close();
        var that=this;	
		setTimeout(function(){ that.payOrderStatus() } ,3000);		  //弹框后开始查询订单状态
    },    

    payOrderStatus:function(){	
    	if( payOrderStatuNum<300){  //小于300次，就发送订单状态轮询支付请求.3秒一次
	     	service.status(orderNo).done(res => {  
	     		console.log ( "现在是第" + payOrderStatuNum+ "次请求订单状态，当前返回的结果为 : " +res.data.orderStatus );
	    		if(res.code == 0 ){  //订单状态查询请求成功
	    			if( res.data.orderStatus =="SUCCESS"  ||  res.data.orderStatus =="COMPLETED"  ){
	    				
	    				//此处待测试！
						if(serialNo){
	    					this.takeOrderInvoice(serialNo);
	    				}else{
	    					console.log("订单支付成功，但是该订单客户不需要开发票！")	    					
	    				}							 
	    				console.log("支付成功了！");	    				
	    				localStorage.removeItem("stepNum");
	    				localStorage.removeItem("orderNo");
						window.open('pay_ok.html', '_self');
	    				
	    			}else{
	    				payOrderStatuNum++;
						var that=this;	
						setTimeout(function(){ that.payOrderStatus() } ,3000);
					 
	    			}
	    			return;
	    		}else{   //订单状态查询请求失败
	    			console.log( res.msg )
	    		}    			
	    	});   			
    	}else{   //大于300次，不发送订单状态轮询支付请求
    		console.log("十五分钟内未付款成功，订单重置!");
    	}
    },
    takeOrderInvoice:function(serialNo){
    	var subData={
    		"serialNo":serialNo 
    	};
    	service.orderInvoice(subData).done(res => {  
    		if( res.code==0){
    			console.log("开发票成功！"+res.msg );
    			console.log(res.data);
    			
    		}else{
    			console.log("由于数据原因，开发票失败！"+res.msg );
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
        //console.log(step4Data.actualAmount);
        this.invoiceStates();
        if(invoiceState== true){
        	this.submitStep4();
        }else{
        	console.log("发票信息不全，不能提交订单！");
        }

    },
    gostep3:function(){
    	localStorage.stepNum="#step3"
    }

});

module.exports = step4;