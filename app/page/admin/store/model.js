var orderModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
		"numInd": 0,
		pinwdError: '',
	},
	validate: function(attrs) {
		//验证规则
		//         if (attrs.clickEle == 'ukeyLogin') {
		//             // $.verify("#userName", "phone");
		//             $.verifyEach({"phone":"#userName","passwd":"#passwd"},function(){
		//                 alert("验证通过，执行请求！");
		//                 $.verify("passwd","#passwd","123");
		//             })
		//          
		//         };
		// if (attrs.clickEle == 'login') {
		//     $.verify("#pinwd", "passwd");
		// }
		if(attrs.clickEle == 'goStep2') {
			// $.verify("#userName", "phone");
			$.verifyEach({ "space": ".countCode", "valId": ".legalID" }, function() {
				window.open('order.html#step2','_self')
			})
		};
	}
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;