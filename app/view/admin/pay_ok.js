import tpl from './tpl/pay_ok.html'

var orderNo = localStorage.orderNo;
var pay_ok = Backbone.View.extend({
    el: '.container',
    initialize() {
		this.render();
    },
    
    jump: function () {
    	alert(shopName);
        var time = setInterval(showTime, 1000);
        var second = 50;
        function showTime() {
            if (second == 0) {
                window.location = "#update_key";
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
    },
});

module.exports = pay_ok;