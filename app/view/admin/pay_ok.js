define([
	"text!./tpl/pay_ok.html",
	"text!../pub/tpl/footer.html",
	"../../../app/lib/service",
	"bootbox"
], function(tpl, primary, service, bootbox) {
	var windowLocation = "orders.html";
	var template = require('art-template');
	var main = Backbone.View.extend({
		el: '.contents',
		initialize() {},
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
			this.jump();
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
					if(businessType == 1) {
						$(".text_tip").show();
						$(".lcocation_page").text("订单中心页面");
						windowLocation = "orders.html";
					} else if(businessType == 2) {
						$(".text_tip").hide();
						$(".lcocation_page").text("证书更新页面")
						windowLocation = "#update_key";
					}
				} else { //订单状态查询请求失败
					console.log(res.msg)
				}
			});
		}
	});
	return main;
});