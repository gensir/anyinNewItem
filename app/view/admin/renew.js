define([
	"text!./tpl/renew.html",
	"text!../pub/tpl/footer.html",
	"text!./tpl/payment.html",
	"../../../app/lib/service",
	"../../lib/ukeys",
	"bootbox"
], function (tpl, primary, payment, service, ukeys, bootbox) {
	var billType = 1;
	var step4Data, that;
	var invoiceState;
	var serialNo; //开发票需要用的序号
	var payOrderStatuNum = 0;
	var orderNo;
	var template = require('art-template');
	var timeID;
	var main = Backbone.View.extend({
		el: '.contents',
		initialize: function () { },
		events: {
			'click .pay div': 'paystyle',
			'click .account': 'gopay',
			'click input[type="radio"]': 'taxType',
		},
		render: function (query) {
			that = this;
			var payments = $(payment);
			this.$el.html(tpl);
			$(".orderMessage").append(payments.find(".bill"));
			$(".step4").append(payments.find(".gopay"));
			this.$el.append(payments.find(".paymentStyle"));
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			localStorage.UesealCode = that.getUrlParam('esealcode');
			localStorage.Uoid = that.getUrlParam('oid');
			this.renewInfo();
		},
		paystyle: function (event) {
			$('.pay .payway').removeClass("active")
			var ele = event.target;
			$(ele).addClass("active")
			step4Data.payType = $(ele).attr("name");
		},
		taxType: function (event) {
			billType = event.target.value;
			$("#taxTips").text("");
			if (billType == 1) {
				$(".company").hide();
				$(".person").show();
			} else if (billType == 2) {
				$(".company").show();
				$(".person").hide();
			} else if (billType == 3) {
				$(".company").hide();
				$(".person").hide();
			}
		},
		gopay1: function () {
			bootbox.dialog({
				className: "errorTips",
				title: "<div class='title'>未实名提示</div>",
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
		getUrlParam: function (name) {
			var after = window.location.hash.split("?")[1];
			if (after) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = after.match(reg);
				if (r != null) {
					return decodeURIComponent(r[2]);
				} else {
					return null;
				}
			}
		},
		renewInfo: function () {
			var _this = this
			var esealCode = that.getUrlParam('esealcode');
			var oid = that.getUrlParam('oid');
			var newOrderNo = that.getUrlParam('orderNo');
			if (!Boolean(oid)) {
				bootbox.dialog({
					className: "errorTips",
					title: '<div class="title">电子印章续费提示</div>',
					message: "<div class='message'>" +
						"<div class='icon' style='height: 64px;'><span style='margin-top: 11px;'></span></div>" +
						"<div class='errorOrderTips'>" +
						"<div class='errorOrderTitle'>当前尚未检测到U-key，无法进行续期！</div>" +
						"<div class='errorOrderRed'>请使用U-key登录后再进行此操作。</div></div><div class='clear'></div></div>",
					buttons: {
						cancel: {
							label: "返回",
							className: "btn1"
						}
					}
				});
			}
			var data = {
				'esealCode': esealCode,
				'oid': oid
			};
			service.getRenewInfo(data).done(function (res) {
				var renewData;
				if (res.code != 0) {
					renewData = {}
					$(".mainTitle").append("(当前接口请求失败 | " + res.msg + ")");
				} else {
					renewData = res.data;
					var cont = "";
					for (var i = 0; i < res.data.length; i++) {
						cont += '<span class="time" name="' + i + '">' + res.data[i].productName + '</span>'
					}
					$("#validz").append(cont);
					$("#validz .time").eq(0).addClass("active");

					//365天<电子印章有效时长<=730天，只可进行2年续期，在续费页面只展示2年有效期 谭振修改于2018-01-09
					if (localStorage.rennw_year == 2) {
						$("#validz .time").eq(1).remove();
					}

					step4Data = {
						"payType": 2, //默认微信支付是2
						//"invoice":"",   
						'eseal': res.data[0]
					}

					step4Data.eseal.orderNo = newOrderNo;

					$("#sumPrice_pay").text(res.data[0].totalPrice + "元")
					$(".priceUnitNum").text(res.data[0].price);
					$(".date1").text(res.data[0].validStart.substr(0, 11) + "00:00:00");
					$(".date2").text(res.data[0].validEnd.substr(0, 11) + "00:00:00");

					$("#validz .time").click(function () {
						var i = $(this).attr("name");
						$("#validz .time").removeClass("active");
						$(this).addClass("active");
						$(".priceUnitNum").text(res.data[i].price);
						$(".date1").text(res.data[i].validStart.substr(0, 11) + "00:00:00");
						$(".date2").text(res.data[i].validEnd.substr(0, 11) + "00:00:00");
						$("#sumPrice_pay").text(res.data[i].totalPrice + "元")
						step4Data.eseal = res.data[i]
					});

				}
			});

		},
		weixinPay: function (codeUrl, orderNo, orderAmount) {
			var wxQrImgSrc = service.qrCode(codeUrl);
			bootbox.dialog({
				className: "payTips",
				closeButton: false,
				title: '<div class="title"><p>订单编号：' + orderNo + '</p></div>',
				message: '<div class="cont"><div class="wxpay01"></div><div class="money">应付金额：￥<span>' + orderAmount +
					'</span></div><div class="clearboth"></div><div class="wx_l"><img class="ewm" src=".' + wxQrImgSrc + '"><div class="wx_l_d"></div> </div> <div class="wx_r"></div><div class="clearboth"></div></div>',
				buttons: {
					cancel: {
						label: "返回订单",
						className: "btn1 closepayalert",
						callback: function (result) {
							that.stopCount();
							$(".account.fr").attr("disabled", false).css({'cursor':'default','background': '#03adff;'});
						}
					}
				}
			});
			setTimeout(function () { that.payOrderStatus() }, 3000);

		},
		paymentEnter: function (resPayType) {
			var paymentData = {
				"orderNo": orderNo,
				"payType": resPayType
			};
			service.payment(paymentData).done(function (res) {
				if (res.code == 0) { //支付宝或者银联请求成功
					var requestUrl = res.data.requestUrl;
					var payDate = res.data;
					delete payDate["requestUrl"];
					if (resPayType == 1) {
						that.payAlertPageGo(payDate, requestUrl);
					} else if (resPayType == 3) {
						that.payAlertPageYL(payDate, requestUrl);
					}
					return;
				} else {
					console.log("支付宝或者银联请求失败！| " + res.code);
				}
			});

		},
		payAlertPageGo: function (payDate, requestUrl) {
			var temp = "";
			for (var i in payDate) {
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
							that.stopCount();
							$(".account.fr").attr("disabled", false).css({'cursor':'default','background': '#03adff;'});
						}
					}
				}
			});
			$("#aliiframe").attr("src", ifrSRC);
			setTimeout(function () { that.payOrderStatus() }, 3000);
		},
		payAlertPageYL: function (payDate, requestUrl) {
			var payDatexg = "";
			for (var i in payDate) {
				var payDateURI = encodeURIComponent(payDate[i]);
				payDatexg += i + "=" + payDateURI + "&";
			}
			service.unYlyl(payDatexg).done(function (res) {
				that.createIframe(res);
			}).fail(function (res) {
				console.log(res);
			});
		},
		createIframe: function (content, addBody) {
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
			if (addBody) {
				loadjs = '<html><body clss="body_iframe">' + loadjs + '</body></html>';
			}
			ifr_doc.open();
			ifr_doc.write(loadjs);
			ifr_doc.close();
			setTimeout(function () { that.payOrderStatus() }, 3000); //支付弹框出现3秒后开始查询订单状态
		},

		payOrderStatus: function () {
			if (payOrderStatuNum < 300) { //小于300次，就发送订单状态轮询支付请求.3秒一次
				service.status(orderNo).done(function (res) {
					console.log("现在是第" + payOrderStatuNum + "次请求订单状态，当前返回的结果为 : " + res.data.orderStatus);
					if (res.code == 0) { //订单状态查询请求成功
						if (res.data.orderStatus == "SUCCESS" || res.data.orderStatus == "COMPLETED") {
							//订单支付完成后去开具发票
							if (serialNo) {
								that.takeOrderInvoice(serialNo);
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
							timeID = setTimeout(function () { that.payOrderStatus() }, 1000);
						}
						return;
					} else { //订单状态查询请求失败
						console.log(res.msg)
					}
				});
			} else { //大于300次，不发送订单状态轮询支付请求
				console.log("五分钟内未付款成功，订单重置!");
				bootbox.alert("五分钟内未付款成功，订单重置!")
				location.reload();
			}
		},
		//清除轮询是否支付
		stopCount: function () {
			clearTimeout(timeID);
		},
		//申请百望电子发票
		takeOrderInvoice: function (serialNo) {
			var subData = {
				"serialNo": serialNo
			};
			service.orderInvoice(subData).done(function (res) {
				if (res.code == 0) {
					console.log("开发票成功！" + res.msg);
				} else {
					bootbox.alert("由于数据原因，开具发票失败!" + res.msg)
					console.log("由于数据原因，开发票失败！" + res.msg);
					return false;
				}
			});
		},
		//发票是否触发状态
		invoiceStates: function (event) {
			if (billType == 1) {
				if ($("#invoice_user").val() == "") {
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
			} else if (billType == 2) {
				if ($("#invoice_company").val() == "" || $("#invoice_taxpayer").val().length != 15 && $("#invoice_taxpayer").val().length != 18 && $("#invoice_taxpayer").val().length != 20) {
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
			} else if (billType == 3) {
				invoiceState = true;
			}
			$(".taxBox input").keyup(function () {
				$("#taxTips").text("");
			})
		},
		gopay: function (event) {
			that.invoiceStates();
			that.stopCount();
			if (invoiceState == true) {
				that.submitStep4();
			} else {
				console.log("请正确填写开具发票的信息！");
			}
		},
		submitStep4: function () {
			console.log(step4Data.payType);
			$(".account.fr").attr("disabled", true).css({'cursor':'no-drop','background': '#999999;'});
			service.orderRenew(step4Data).done(function (res) {
				if (res.data.invoice) {
					serialNo = res.data.invoice.serialNo;
				}
				if (res.code == 0) {
					//console.log(res.data.codeUrl);   	 //返回微信的连接codeUrl
					var codeUrl = res.data.codeUrl;
					orderNo = res.data.order.orderNo;
					var orderAmount = res.data.order.orderAmount
					var resPayType = step4Data.payType;
					if (resPayType == 1) { //去处理支付宝的弹框
						that.paymentEnter(resPayType);
					} else if (resPayType == 2) { //去处理微信
						that.weixinPay(codeUrl, orderNo, orderAmount);
					} else if (resPayType == 3) { //去处理银联
						that.paymentEnter(resPayType);
					}
					return;
				} else {
					bootbox.alert(res.msg);
				}
			});
		}
	});
	return main;
});