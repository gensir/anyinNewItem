define([
    "../lib/service",
    "../lib/validate"
],function(service, validateItem) {    
    return Backbone.Model.extend({
        defaults: {
            "verify": validateItem,
            "numInd": 0,
            "pinwdError": '',
        },
        initialize: function () {
			

        },
        validate: function (attrs) {
            if (attrs.clickEle == 'goStep2') {
                // $.verify("#userName", "phone");
                $.verifyEach({ "space": ".countCode", "valId": ".legalID" }, function () {
                    window.open('admin.html#step2', '_self')
                })
            };
        },

        safeCompanyList: function (objval) {//pageNumber, pageSize
            var _this=this;
            var obj = {
                shopId: 1,
                auditStatus: "",
                applyType: "",
                sTime: "",
                eTime: "",
                pageNum:1,
                pageSize:10,
                sTime: "",
                shopId: 1
            }
            if(objval){
                $.extend(obj,objval)
            }
            return service.safeCompanyList(obj);
        },
        fuzzy:function(val){
            return service.safeCompanyList(val);
        }
    });
});