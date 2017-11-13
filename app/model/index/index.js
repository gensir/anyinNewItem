define(["../../lib/validate"], function(validateItem) {
    return Backbone.Model.extend({
        defaults: {
            verify: validateItem,
            totalPages: "",
            tpl: {}
        },
        validate: function(attrs) {}
    });
});
