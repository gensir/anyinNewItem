define(["../../lib/validate"], function(validateItem) {
    return Backbone.Model.extend({
        defaults: {
            verify: validateItem,
            numInd: 0,
            ukeyName: [],
            pinwdError: "",
            totalPages: "",
            tplhtml: {}
        },
        validate: function(attrs) {}
    });
});
