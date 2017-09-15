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
		var esealCode=this.getUrlParam('esealcode');
        var oid=this.getUrlParam('oid');
        if(oid=="" ){
			bootbox.dialog({
				className: "errorTips",
				title: '<div class="title">电子印章续费提示</div>',
			message: "<div class='message'>"+
			"<div class='icon' style='height: 64px;'><span style='margin-top: 11px;'></span></div>"+
			"<div class='errorOrderTips'>"+
			"<div class='errorOrderTitle'>当前尚未监测到U-key，无法进行续期！</div>"+
			"<div class='errorOrderRed'>请使用U-key登录后再进行此操作。</div></div><div class='clear'></div></div>",
				buttons: {
					cancel: {
						label: "返回",
						className: "btn1"
					}
				}
			}) ;        	
        }

//		var esealCode='4403048020393';	
//		var oid='999@5007ZZ1OTE0NDAzMDBNQTVFTkpFWTNR';
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
              		'eseal': res.data[0]
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
    weixinPay:function(codeUrl , orderNo , orderAmount ){
    	var wxQrImgSrc=service.qrCode(codeUrl);
    	
			bootbox.dialog({
				className: "payTips",
				title: '<div class="title"><p>订单编号：'+orderNo+'</p></div>',
				message: '<div class="cont"><div class="wxpay01"></div><div class="money">应付金额：￥<span>'+orderAmount
								+'</span></div><div class="clearboth"></div><div class="wx_l"><img class="ewm" src=".'+wxQrImgSrc+'"><div class="wx_l_d"></div> </div> <div class="wx_r"></div><div class="clearboth"></div></div>'
				,
				buttons: {
					cancel: {
						label: "返回订单",
						className: "btn1 closepayalert"
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
		setTimeout(function(){ that.payOrderStatus() } ,3000);		  //支付弹框出现3秒后开始查询订单状态
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
	    				$(".closepayalert").trigger("click"); 
	    				$(".bootbox-close-button").trigger("click");
						window.open('admin.html#pay_ok', '_self');
	    				
	    			}else{
	    				payOrderStatuNum++;
						var that=this;	
						setTimeout(function(){ that.payOrderStatus() } ,1000);
					 
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
             if($("#invoice_company").val()=="" || $("#invoice_taxpayer").val().length !=15 && $("#invoice_taxpayer").val().length !=18 && $("#invoice_taxpayer").val().length !=20 ) {
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
    			orderNo=res.data.order.orderNo;
    			var orderAmount=res.data.order.orderAmount
    			
    			var resPayType=step4Data.payType;
    			if( resPayType ==1 ){   //去处理支付宝的弹框
					this.paymentEnter(resPayType);
    			}else if( resPayType ==2 ){  //去处理微信
    				this.weixinPay(codeUrl , orderNo , orderAmount );	
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