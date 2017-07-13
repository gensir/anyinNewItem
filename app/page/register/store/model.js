var registerModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
		pinwdError: '',
	},	
	validate: function(attrs) {
		//验证规则
		if(attrs.clickEle == 'reguser') {
			$.verifyEach({"idcode":"#idcode","yzmcode":"#yzmcode"},function(){
				window.open('register.html#step1', '_self')
            })
		}
		if(attrs.clickEle == 'goStep3') {
			return $.verifyEach({"phone":".countPhone","valId":".legalID"},function(){
				return 123;
            })
		}
		if(attrs.clickEle == 'findPasswordCodeBtn'){
			return $.verifyEach({"phone":".countPhone"},function(){
				return 123;
            })
		}
	}
});
var registerVerify = new registerModel();
module.exports = registerVerify;