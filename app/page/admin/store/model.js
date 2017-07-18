var orderModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
        "numInd": 0,
        ukeyName:[],
        pinwdError: '',
        tplhtml:{},
        totalPages:''
	},
	validate: function(attrs) {
        if(attrs.clickEle=="lossCheck"){
            if(attrs.verify.istrue.yzmcode($(".checkSmsCode"))){
                return true;
            }else{
                return false;
            }
        }
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