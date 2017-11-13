define([
    "../../lib/service",
    "../../lib/validate"
],function(service, validateItem) {    
    return Backbone.Model.extend({
        defaults: {
            "verify": validateItem,
            "numInd": 0,
            "pinwdError": '',
        },
        initialize: function () {
		
        },


    });
});