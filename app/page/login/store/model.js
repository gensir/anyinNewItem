var loginModel = Backbone.Model.extend({
    defaults: {
        'verify': require('../../../publicFun/validate'),
        "wang": "t",
        pinwdError: '',

    },
    validate: function (attrs) {
        //验证规则
        if (attrs.clickEle == 'ukeyLogin') {
            $.verify("#userName", "phone");
            $.verify("#passwd", "passwd");
        };
        if (attrs.clickEle == 'login') {
            $.verify("#pinwd", "passwd");
        }
    }
});
var loginVerify = new loginModel();
// loginVerify.on("invalid", function (model, error) {
//     alert(model.get("name") + ":" + error);
// });
module.exports = loginVerify;