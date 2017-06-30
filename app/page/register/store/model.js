var registerModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
		pinwdError: '',
	},	
	validate: function(attrs) {
		//验证规则
		if(attrs.clickEle == 'goStep3') {
			$.verifyEach({"phone":".countPhone","valId":".legalID"},function(){
				window.open('register.html#step3', '_self')
            })
		}
	}
});
var registerVerify = new registerModel();
module.exports = registerVerify;