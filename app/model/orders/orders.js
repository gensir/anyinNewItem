define(["../../lib/validate"], function(validateItem) {
    return Backbone.Model.extend({
        defaults: {
            verify: validateItem,
            tplhtml:{},
            totalPages:''
        },
        validate: function(attrs) {}
    });
});
