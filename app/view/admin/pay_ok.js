import tpl from './tpl/pay_ok.html'
var service = require('../../server/service').default;

var orderNo = localStorage.orderNo;
var windowLocation="orders.html";
var pay_ok = Backbone.View.extend({
    el: '.container',
    initialize() {
		this.render();
    },
    
    jump: function () {
        var time = setInterval(showTime, 1000);
        var second = 6;
        function showTime() {
            if (second == 0) {
                window.location = windowLocation;
                clearInterval(time);
            }
            $("#mes").html(second);
            second--;
        }
    },

    render: function (query) {
        this.$el.html(tpl);
        this.jump();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.getData(orderNo);

        
        
    },
    getData:function(orderNo){
    	service.status(orderNo).done(res => {  
	    		if(res.code == 0 ){  //订单状态查询请求成功
					var businessType=res.data.businessType;
					var shopAddress=res.data.shopAddress||"";
					var totalFee=res.data.totalFee;
					$(".totalFee").text(totalFee);
					$(".shop_address").text(shopAddress);
					if( businessType== 1){
						$(".text_tip").show();
						$(".lcocation_page").text("订单中心页面");						
						windowLocation="orders.html";
					}else if( businessType== 2){
						$(".text_tip").hide();
						$(".lcocation_page").text("证书更新页面")
						windowLocation="#update_key";
					}
				
					

	    		}else{   //订单状态查询请求失败
	    			console.log( res.msg )
	    		}    			
	    	});   			
    }
    
});

module.exports = pay_ok;