define([
    "../../lib/validate"
],function(validateItem) {    
    return Backbone.Model.extend({
        defaults: {
            "verify": validateItem,
            pinwdError: ''
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
                var result=$.verify("ukeytip", "#seleBook");
                var result=$.verify("pinwd", "#pinwd");
                return result;
            }
        }
    });
});