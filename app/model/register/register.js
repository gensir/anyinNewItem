define(["../../lib/validate"], function(validateItem) {
    return Backbone.Model.extend({
        defaults: {
            verify: validateItem,
            pinwdError: "",
            firmId: "",
            enterpriseCode: ""
        },
        validate: function(attrs) {
            //验证规则
            // if (attrs.clickEle == 'reguser') {
            //     return $.verifyEach({ "idcode": "#idcode", "yzmcode": "#yzmcode" }, function () {
            //         //return true;
            //     })
            // }
            if (attrs.clickEle == "reguser") {
                return $.verifyEach({ Ename: "#Ename" }, function() {
                    return 123;
                });
            }
            if (attrs.clickEle == "goStep3") {
                return $.verifyEach(
                    { phone: ".countPhone", valId: ".legalID" },
                    function() {
                        return 123;
                    }
                );
            }
            if (attrs.clickEle == "findPasswordCodeBtn") {
                return $.verifyEach({ phone: ".countPhone" }, function() {
                    return 123;
                });
            }
        }
    });
});
