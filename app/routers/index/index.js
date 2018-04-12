define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        routes: {
            "": "index",
        },
        frameView: null,
        preRoute: function (clearMain, pageTag) {
            var dtd = $.Deferred(), that = this;
            $(".datetimepicker").remove();
            if (clearMain) {
                $("#main").unbind().html('');
                dtd.resolve();
            } else {
                $("#main").unbind().html('');
                require(['../../view/pub/frame'], function (View) {
                    that.frameView = new View();
                    that.frameView.render('.nav_' + pageTag);
                    dtd.resolve();
                });
            }
            return dtd.promise();
        },
        index: function () {
            var debugLogin = false;
            this.preRoute(false, 'index').then(function () {
                require(['../../view/index/index', '../../model/index/index'], function (View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        }
    });
});