/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'click .findPasswordCodeBtn': 'phoneCode'
	},
	phoneCode: function() {
		var countdown = 60;
		var ele=$(".findPasswordCodeBtn");
		function settime() {
			if(countdown == 0) {
				ele.removeAttr("disabled");
				ele.val("获取验证码");
				countdown = 60;
				clearTimeout(ele[0].settimes);
				return false;
			} else {
				ele.attr("disabled", true);
				ele.val("重新发送(" + countdown + ")");
				countdown--;
			}
			ele[0].settimes = setTimeout(function() {
				settime(ele)
			}, 1000)
		};
		settime();
		return false;
	},
	render: function(query) {
		this.$el.html(tpl);
	},
});
module.exports = step2;