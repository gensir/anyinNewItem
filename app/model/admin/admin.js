define(["../../lib/validate"], function(validateItem) {
    return Backbone.Model.extend({
        defaults: {
            verify: validateItem,
            numInd: 0,
            ukeyName: [],
            pinwdError: "",
            tplhtml: {},
            totalPages: ""
        },
        validate: function(attrs) {
            if (attrs.clickEle == "lossCheck") {
                if (attrs.verify.istrue.yzmcode($(".checkSmsCode"))) {
                    return true;
                } else {
                    return false;
                }
            }
            if (attrs.clickEle == "goStep2") {
                // $.verify("#userName", "phone");
                var result = $.verifyEach(
                    { space: ".countCode", valId: ".legalID" },
                    function() {}
                );
                return result;
            }
        }
    });
});
