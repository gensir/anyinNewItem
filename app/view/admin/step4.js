define([
	"text!./tpl/step4.html",
	"text!./tpl/payment.html",
	"../../lib/ukeys",
	"../../../app/lib/service",
    "../../lib/public",
	"bootbox"
], function(adminstep4,payment,ukeys, service, public, bootbox) {
	var billType=1;
	var step4Data,_this;
	var invoiceState,validStart,validEnd,esealCode;
	var serialNo;  //开发票需要用的序号
	var payOrderStatuNum=0;
	var orderNo = localStorage.orderNo || "APPLY11071125189290";
	var template = require('art-template');
	var timeID;
	var main = Backbone.View.extend({
		el: '.contents',
		initialize:function() {},
		events: {
			'click .pay div': 'paystyle',
			'click .account': 'gopay',
			'click input[type="radio"]': 'taxType',
			'click .licence': 'mf9527',
			'click #goStep3': 'gostep3'
		},
		render: function(query) {
			if(localStorage.stepNum != "#step4") {
				return;
			}
			_this=this;
			var payments = $(payment);
			this.$el.html(adminstep4);
			$(".orderMessage").append(payments.find(".bill"));
			$(".step4").append(payments.find(".gopay"));
			this.$el.append(payments.find(".paymentStyle"));
//			document.body.scrollTop = document.documentElement.scrollTop = 0;
			this.getOrderInfo();
            public.placeholder();
		},
		//保留小数点后两位
		toDecimal: function(x) {       var f = parseFloat(x);       if(isNaN(f)) {         return 0;       }       f = Math.round(x * 100) / 100;       return f;     },
		getOrderInfo: function() {
			service.orderStep4(orderNo).done(function(res) {
				var tempObj;
				if(res.code != 0) {
					console.log("step4无法获取到电子印章订单信息！" + res.msg);
					tempObj = {}
				} else {
					tempObj = res;
					var cont = "";
					var sumPrice = 0;
					if(tempObj.data.esealProducts || tempObj.data.esealProducts != null) {} else {
						var dialog = bootbox.alert({
							className: "alert",
							message: "印章产品信息不存在，请核对数据！",
						})
					}
					$(".product").html(tempObj.data.esealProducts.length+1);
					for(var i = 0; i < tempObj.data.esealProducts.length; i++) {
                        if(i==0){
                            cont += '<tr><td class="serial">'+(i + 1) +'</td><td class="sealName">'+ tempObj.data.esealProducts[i].esealFullName +'</td><td class="service">'+ tempObj.data.esealProducts[i].productName +'</td><td class="price pricecolor">¥'+ tempObj.data.esealProducts[i].payAmount +'元</td><td rowspan="4" class="twoyear">2年</td></tr>';
                        }else{
                            cont += '<tr><td class="serial">'+(i + 1) +'</td><td class="sealName">'+ tempObj.data.esealProducts[i].esealFullName +'</td><td class="service">'+ tempObj.data.esealProducts[i].productName +'</td><td class="price pricecolor">¥'+ tempObj.data.esealProducts[i].payAmount +'元</td></tr>';
                        }
						if(i==tempObj.data.esealProducts.length-1){
							cont+='<tr><td class="serial">'+(i + 2) +'</td><td class="sealName">赠送两年保修</td><td class="service"> </td><td class="price pricecolor">¥0元</td></tr>'
						}
					}                                   
					sumPrice = tempObj.data.actualAmount;
					var paysumPrice = sumPrice;
					$("#step4_orders tbody ").append(cont);
					$("#sumPrice , #sumPrice_pay").html(sumPrice + "元");
					step4Data = {
						"discountAmount": 0,
						"actualAmount": paysumPrice,
						"orderNo": orderNo,
						"payType": 2, //默认微信支付是2
						//"invoice":""   
						"esealProducts": tempObj.data.esealProducts,
					}
					step4Data.esealProducts[0].payAmount = parseInt(sumPrice);
					for(var i = 0; i < tempObj.data.esealProducts.length; i++) {
					    step4Data.esealProducts[i].productAmountId = tempObj.data.esealProducts[i].productAmountId;
                        step4Data.esealProducts[i].validStart = tempObj.data.esealProducts[i].validStart;
                        step4Data.esealProducts[i].validEnd = tempObj.data.esealProducts[i].validEnd;
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
		submitStep4: function() {
			console.log(step4Data.payType);
			$(".account.fr").attr("disabled", true).css({'cursor':'no-drop','background': '#999999;'});
			service.submitStep4(step4Data).done(function(res) {
				if(res.data.invoice) {
					serialNo = res.data.invoice.serialNo;
				}
				if(res.code == 0) {
					//console.log(res.data.codeUrl);   	 //返回微信的连接codeUrl
					var codeUrl = res.data.codeUrl;
					var resPayType = step4Data.payType;
					if(resPayType == 1) { //去处理支付宝的弹框
						_this.paymentEnter(resPayType);
					} else if(resPayType == 2) { //去处理微信
						_this.weixinPay(codeUrl);
					} else if(resPayType == 3) { //去处理银联
						_this.paymentEnter(resPayType);
					}
					return;
				} else {
					console.log(res.msg);
				}
			});
		},
		weixinPay: function(codeUrl) {
			var wxQrImgSrc = service.qrCode(codeUrl);
			var allAmount = step4Data.actualAmount; //orderNo
			bootbox.dialog({
				className: "payTips",
				closeButton: false,
				title: '<div class="title"><p>订单编号：' + orderNo + '</p></div>',
				message: '<div class="cont"><div class="wxpay01"></div><div class="money">应付金额：￥<span>' + allAmount +
					'</span></div><div class="clearboth"></div><div class="wx_l"><img class="ewm" src=".' + wxQrImgSrc + '"><div class="wx_l_d"></div> </div> <div class="wx_r"></div><div class="clearboth"></div></div>',
				buttons: {
					cancel: {
						label: "返回订单",
						className: "btn1 closepayalert",
						callback: function (result) {
							_this.stopCount();
							$(".account.fr").attr("disabled", false).css({'cursor':'default','background': '#03adff;'});
						}
					}
				}
			});
			setTimeout(function() { _this.payOrderStatus() }, 3000);

		},
		paymentEnter: function(resPayType) {
			var paymentData = {
				"orderNo": orderNo,
				"payType": resPayType
			};
			service.payment(paymentData).done(function(res) {
				if(res.code == 0) { //支付宝或者银联请求成功
					var requestUrl = res.data.requestUrl;
					var payDate = res.data;
					delete payDate["requestUrl"];
					if(resPayType == 1) {
						_this.aliPayAlert(payDate, requestUrl);  //去支付宝弹框
					} else if(resPayType == 3) {
						_this.unionPayAlert(payDate, requestUrl);   //去银联弹框
					}
					return;
				} else {
					console.log("支付宝或者银联请求失败！| " + res.code);
				}
			});

		},
		aliPayAlert: function(payDate, requestUrl) {
			var temp = "";
			for(var i in payDate) {
				temp += i + "=" + payDate[i] + "&";
			}
			var ifrSRC = requestUrl + "?" + temp;
			bootbox.dialog({
				className: "alipayAlert",
				closeButton: false,
				message: '<iframe src="" width="1100" height="700" id="aliiframe"></iframe> ',
				buttons: {
					cancel: {
						label: "返回订单",
						className: "btn1 closepayalert",
						callback: function (result) {
							_this.stopCount();
							$(".account.fr").attr("disabled", false).css({'cursor':'default','background': '#03adff;'});
						}
					}
				}
			});
			$("#aliiframe").attr("src", ifrSRC);
			setTimeout(function() { _this.payOrderStatus() }, 3000);
		},
		unionPayAlert: function(payDate, requestUrl) {
			var payDatexg = "";
			for(var i in payDate) {
				var payDateURI = encodeURIComponent(payDate[i]);
				payDatexg += i + "=" + payDateURI + "&";
			}
			//var payDatexg="txnType=01&frontUrl=http%3A%2F%2F183.62.140.54%2Fyzpm_dev%2FMenuController%2Fapp.yzpm.signet.SignetRenewHistoryPanel&channelType=07&currencyCode=156&merId=898110273110130&txnSubType=01&txnAmt=1&version=5.0.0&signMethod=01&backUrl=http%3A%2F%2F183.62.140.54%2Feseal%2Forder%2FunionpayNotify&certId=69933950484&encoding=UTF-8&bizType=000201&signature=cPngSNV5q4jykBye77t5NX7LIu%2BXUxHBaqBx6nhbbdYrWiz%2FQA947PYaTfZZFPifqwWwnQcjfSX4IT7WoYLK93WgYrCHEBiJToeEjtxDLdjUUYwpgtzVabwt5oUj%2F7N%2Bjjobo4IZm%2F34OaYNXpGDhbeBAU49K14WNSKsEdsB6gho3s6xisHtGRurg6U%2FhXs1sfNPoAsmXpp%2FADL%2B79cxEpCmAdcjC7fNHezYLsq3k0ZLpD%2FYoPWm0WCig2W1lKIukSqLiAjJc5YejX6etWV%2B1kqKP92mb93cAi0xarg0NyBuISLVlT7Xy8LmuqOad3wrqnD9XHe2QmX3BzRTnZsFTg%3D%3D&orderId=OFFLINE08071088058690&txnTime=20170809113200&accessType=0"
			service.unYlyl(payDatexg).done(function(res) {
				_this.createIframe(res);
			}).fail(function(res) {
				console.log(res);
			});
		},
		createIframe:function(content, addBody) {
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
			if(addBody) {
				loadjs = '<html><body clss="body_iframe">' + loadjs + '</body></html>';
			}
			ifr_doc.open();
			ifr_doc.write(loadjs);
			ifr_doc.close();
			setTimeout(function() { _this.payOrderStatus() }, 3000); //支付弹框出现3秒后开始查询订单状态
		},

		payOrderStatus: function() {
			if(payOrderStatuNum < 300) { //小于300次，就发送订单状态轮询支付请求.3秒一次
				service.status(orderNo).done(function(res) {
					console.log("现在是第" + payOrderStatuNum + "次请求订单状态，当前返回的结果为 : " + res.data.orderStatus);
					if(res.code == 0) { //订单状态查询请求成功
						if(res.data.orderStatus == "SUCCESS" || res.data.orderStatus == "COMPLETED") {

							if(serialNo) {
								_this.takeOrderInvoice(serialNo);
							} else {
								console.log("订单支付成功，但是该订单客户不需要开发票！")
							}
							console.log("支付成功了！");
							$(".closepayalert").trigger("click");
							$(".bootbox-close-button").trigger("click");
							$(".modal-backdrop").hide();
							bootbox.hideAll();
							localStorage.removeItem("stepNum");
							localStorage.removeItem("orderNo");							
							setTimeout( function(){ window.open('admin.html#pay_ok?num=' + orderNo, '_self') }, 600 );   //为防止意外,延迟半秒跳转页面

						} else {
							payOrderStatuNum++;
							timeID = setTimeout(function() { _this.payOrderStatus() }, 1000);
						}
						return;
					} else { //订单状态查询请求失败
						console.log(res.msg)
					}
				});
			} else { //大于300次，不发送订单状态轮询支付请求
				console.log("五分钟内未付款成功，订单重置!");
				location.reload();
				alert("五分钟内未付款成功，订单支付重置!");
			}
		},
		//清除轮询是否支付
		stopCount: function () {
			clearTimeout(timeID);
		},
		takeOrderInvoice: function(serialNo) {
			var subData = {
				"serialNo": serialNo
			};
			service.orderInvoice(subData).done(function(res) {
				if(res.code == 0) {
					console.log("开发票成功！" + res.msg);
					console.log(res.data);
				} else {
                    bootbox.alert("由于数据原因，开具发票失败!" + res.msg)
					console.log("由于数据原因，开发票失败！" + res.msg);
				}
			});
		},
		invoiceStates: function(event) {
			if(billType == 1) {
				if($("#invoice_user").val() == "") {
					invoiceState = false;
					$("#taxTips").text("请填写个人发票抬头！")
				} else {
					var invoice1 = {
						"orderNo": orderNo,
						"invoiceType": 0,
						"invoiceHeader": $("#invoice_user").val(),
					};
					step4Data.invoice = invoice1;
					invoiceState = true;
				}
			} else if(billType == 2) {
				if($("#invoice_company").val() == "" || $("#invoice_taxpayer").val().length != 15 && $("#invoice_taxpayer").val().length != 18 && $("#invoice_taxpayer").val().length != 20) {
					invoiceState = false;
					$("#taxTips").text("请填写企业发票抬头，并输入15、18或20位的纳税人识别号！")
				} else {
					var invoice2 = {
						"orderNo": orderNo,
						"invoiceType": 0,
						"invoiceHeader": $("#invoice_company").val(),
						"buyerTaxerNo": $("#invoice_taxpayer").val(),
					};
					step4Data.invoice = invoice2;
					invoiceState = true;
				}
			} else if(billType == 3) {
				invoiceState = true;
			}
			$(".taxBox input").keyup(function() {
				$("#taxTips").text("");
			})
		},
		gopay: function() {
			//console.log(step4Data.actualAmount);
			_this.invoiceStates();
			_this.stopCount();
			if(invoiceState == true) {
				_this.submitStep4();
			} else {
				console.log("发票信息不全，不能提交订单！");
			}
		},
		gostep3: function() {
			localStorage.stepNum = "#step3"
		}
	});
	return main;
});