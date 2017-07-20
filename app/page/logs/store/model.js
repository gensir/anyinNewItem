var orderModel = Backbone.Model.extend({
	defaults: {
		'verify': require('../../../publicFun/validate'),
        "numInd": 0,
        ukeyName:[],
        pinwdError: '',
        totalPages: '',
        tplhtml: {},
	},
	validate: function(attrs) {
        // if(attrs.clickEle=="lossCheck"){
        //     if(attrs.verify.istrue.yzmcode($(".checkSmsCode"))){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // }

	}
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;