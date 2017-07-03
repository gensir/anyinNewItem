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
		'click #goStep3': 'goStep3',
		'keyup .countCode': 'checkCode',
	},
	phoneCode: function() {
		this.model.set({ "clickEle": $(event.target).data('id') })
		this.model.isValid()
//		if((/^1[34578]\d{9}$/.test($(".countPhone").val()))) {
		if(!this.model.isValid()) {
			var countdown = 60;
			var ele = $(".findPasswordCodeBtn");

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
		}
	},
	goStep3: function(event) {
		this.model.set({ "clickEle": $(event.target).data('id') })
		this.model.isValid()
	},
	checkCode: function() {
		if($('.countCode').val().length==6){
			alert($('.countCode').val())
		}
	},
	render: function(query) {
		this.$el.html(tpl);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
});
module.exports = step2;