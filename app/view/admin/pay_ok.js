define([
	"text!./tpl/pay_ok.html",
	"text!../pub/tpl/footer.html",
	"../../../app/lib/service",
	"../../lib/ukeys",
	"bootbox"
], function(tpl, primary, service,ukeys,bootbox) {
	var windowLocation = "orders.html";
	var isODC;
	var template = require('art-template');
	var main = Backbone.View.extend({
		el: '.contents',
		initialize: function () {
			//nothing
		},
		jump: function() {
			var time = setInterval(showTime, 1000);
			var second = 6;

			function showTime() {
				if(second == 0) {
					window.location = windowLocation;
					clearInterval(time);
				}
				$("#mes").html(second);
				second--;
			}
		},

		render: function(query) {
			this.$el.html(tpl);
			var that=this;
			this.jump();

//			var oid = ukeys.GetOid(selectedUkey);
//			var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
//			var enterpriseName = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username;
//			var certData={
//				"validStart":localStorage.validStart,
//				"validEnd":localStorage.validEnd,
//				"esealCode":localStorage.esealCode,
//				"oid":oid,
//				"enterpriseCode":enterpriseCode,
//				"enterpriseName":enterpriseName,
//				"issuer":"GDCA",                             //数字证书颁发者
//				"certificateFirms":1,                        //证书厂商
//				"certificateType":2,                         //证书类型 
//				"certificateAssigned":ukeys.CertType,                     //数字证书归属者
//				"signCertificate":"33433343343fdf3r33",      //签名证书或路径
//				"encryptCertificate":"zxcsadwqerewdvdvdfe"   //加密证书文件或者路径
//				"signCertificateSn":ukeys.getCertSignSN,    //签名证书序列号
//				"encryptCertificateSn": ukeys.getCertEncSN  //加密证书序列号
//			}
//			service.writeCert(certData).done(function(res){
//				if(res.code==0){
//					that.jump();
//				}else{
//					var dialog = bootbox.alert({
//						className: "alert",
//						message: "印章产品信息不存在，请核对数据！",
//					})
//				}
//			})



			document.body.scrollTop = document.documentElement.scrollTop = 0;
			this.getData();

		},
		getUrlParam: function(name) {
			var after = window.location.hash.split("?")[1];
			if(after) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = after.match(reg);
				if(r != null) {
					return decodeURIComponent(r[2]);
				} else {
					return null;
				}
			}
		},
		getData: function() {
			var orderNo = this.getUrlParam('num');
			service.status(orderNo).done( function(res) {
				if(res.code == 0) { //订单状态查询请求成功
					var businessType = res.data.businessType;
					var shopAddress = res.data.shopAddress || "";
					var totalFee = res.data.totalFee;
					$(".totalFee").text(totalFee);
					$(".shop_address").text(shopAddress);
					//申请的时候只有ODC的时候才会需要回写
					isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
					//businessType==1是新办，businessType==2是续期
					if(businessType == 1) {
						if(isODC){
							$(".text_tip").hide();
							$(".lcocation_page").text("证书更新页面")
							windowLocation = "#update_key?orderNo="+orderNo;
						}else{
							$(".text_tip").show();
							$(".lcocation_page").text("订单中心页面");
							windowLocation = "orders.html";
						}
					} else if(businessType == 2) {
						if(localStorage.keyType ==1){  //1为ODC
							$(".text_tip").show();
							$(".lcocation_page").text("订单中心页面");
							windowLocation = "orders.html";
						}else{
							if(localStorage.certificateFirm==1||localStorage.certificateFirm==2){  //1为GDCA  2为NETCA
								$(".text_tip").hide();
								$(".lcocation_page").text("证书更新页面")
								windowLocation = "#update_key?oid="+localStorage.oid+"&orderNo="+orderNo;
							}else{
								$(".text_tip").show();
								$(".lcocation_page").text("订单中心页面");
								windowLocation = "orders.html";
							}
						}
					}
				} else { //订单状态查询请求失败
					console.log(res.msg)
				}
			});
		}
	});
	return main;
});