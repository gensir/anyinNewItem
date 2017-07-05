import tpl from './tpl/step1.html'
var sealstyle = [];
var step1 = Backbone.View.extend({
	el: '.container',
	initialize() {
		
		this.render();
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
		
	},
	goStep2: function(event) {
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
//		alert(1);
		var ele = event.target
		if($(ele).hasClass('choice')) {
			$(ele).removeClass('choice')
		} else {
			$(ele).addClass('choice');
		}
	}
});

module.exports = step1;