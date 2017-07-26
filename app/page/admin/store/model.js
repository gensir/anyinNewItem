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
			return $.verifyEach({ "space": ".countCode", "valId": ".legalID" }, function() {
				return 123;
			})
		};
	}
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;