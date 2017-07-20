var orderModel = Backbone.Model.extend({
	defaults: {
        tplhtml:{},
        totalPages:''
	},
});
var orderVerify = new orderModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = orderVerify;