var loginModel = Backbone.Model.extend({
    defaults: {
        'verify': require('../../../publicFun/validate'),
        "wang": "t",
        pinwdError: '',
    },
    validate: function (attrs) {
        //验证规则
        if (attrs.clickEle == 'phoneLogin') {
            // $.verify("#userName", "phone");
            var result=$.verifyEach({"phone":"#userName","passwd":"#passwd"},function(){
            })
            return result;
        };
        if (attrs.clickEle == 'ukeyLogin') {
            var result=$.verify("passwd", "#pinwd");
            return result;
        }
    }
});
var loginVerify = new loginModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = loginVerify;