import tpl from './tpl/step1.html'
var sealstyle = [];
var step1 = Backbone.View.extend({
	el: '.container',
	initialize() {

//		this.render();
	},
	events: {
		'click #goStep2': 'goStep2',
		'click .sealStyle span': 'choice'
	},
	render: function(query) {
		$(".contents").empty();
		this.$el.html(tpl);
		sealstyle = [];
		document.body.scrollTop = document.documentElement.scrollTop = 0;
//		bootbox.dialog({
//			className: "errorTips",
//			title: "<div class='title'>新办电子印章提示</div>",
//			message: "<div class='message'>" +
//				"<div class='icon'><span></span></div>" +
//				"<div class='errorOrderTips'>" +
//				"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
//				"<div class='errorOrderSeal'>" +
//				"<span>电子行政章</span><span>电子行政章</span></div>" +
//				"<div class='errorOrderRed'>新建订单将覆盖原有的订单,您需要重新填写资料</div></div><div class='clear'></div></div>",
//			buttons: {
//				cancel: {
//					label: "返回",
//					className: "btn1"
//				},
//				confirm1: {
//					label: "继续该订单",
//					className: "btn2",
//					callback: function() {
//						$(this).find(".message").html(123);
//						console.log($(this).find(".message").html())
//						if(i = 5) {
//							return false;
//						}
//
//					}
//				},
//				confirm2: {
//					label: "新建订单",
//					className: "btn3",
//					callback: function() {
//						window.location.href = "admin.html#step1";
//					}
//				}
//			}
//		})
	},
	goStep2: function(event) {
		var hh = $('input:radio:checked').val();
		
		window.reqres.setHandler("foo", function() {
			return hh;
		});
		if($('.sealStyle span').hasClass('choice')) {
			this.model.set({ "clickEle": $(event.target).data('id') })
			this.model.isValid()
		} else {
			var dialog = bootbox.alert({
				className: "alert",
				message: "请选择要办理的电子印章类型",
			})
		}
	},
	choice: function(event) {
		sealstyle.push($(event.target).data('id'));
		var ele = event.target
		if($(ele).hasClass('choice')) {
			$(ele).removeClass('choice')
		} else {
			$(ele).addClass('choice');
		}
	}
});

module.exports = step1;