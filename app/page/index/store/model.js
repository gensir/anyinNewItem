var orderModel = Backbone.Model.extend({
	defaults: {
        'verify': require('../../../publicFun/validate'),
        totalPages:'',
        tpl:{}
	},
	validate: function(attrs) {
        // if(attrs.clickEle=="lossCheck"){
        //     if(attrs.verify.istrue.yzmcode($(".checkSmsCode"))){
        //         return true;
        //     }else{
        //         return false;
        //     }
        // };
	}
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;