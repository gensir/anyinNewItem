var orderModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
		"numInd": 0,
		pinwdError: '',
	},
	validate: function(attrs) {
		if(attrs.clickEle == 'goStep2') {
			// $.verify("#userName", "phone");
			$.verifyEach({ "space": ".countCode", "valId": ".legalID" }, function() {
				window.open('admin.html#step2','_self')
			})
		};
	}
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;