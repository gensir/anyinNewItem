/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step2.html'
var step2 = Backbone.View.extend({
	el: '.container',
	initialize() {
		this.render();
	},
	events: {
		'click .findPasswordCodeBtn': 'phoneCode',
		'click #goStep3':'goStep3'
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
	goStep3:function(event){
		this.model.set({"clickEle":$(event.target).data('id')})
        this.model.isValid()
	},
	render: function(query) {
		this.$el.html(tpl);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
});
module.exports = step2;