define(function(require, exports, module) {
    "use strict";

    // External dependencies.
    var Backbone = require("backbone");

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        routes: {
            "": "logs",
            "operateLog": "operateLog",
        },
        frameView: null,
        preRoute: function(clearMain, pageTag) {
            var dtd = $.Deferred(),
                that = this;
            $(".datetimepicker").remove();
            if (clearMain) {
                $("#main").unbind().html('');
                dtd.resolve();
            } else {
                $("#main .contents").eq(0).unbind().html('');
                require(['../../view/pub/frame'], function(View) {
                    that.frameView = new View();
                    that.frameView.render('.nav_' + pageTag);
                    dtd.resolve();
                });
            }
            return dtd.promise();
        },
        logs: function() {
            this.preRoute(false, 'logs').then(function() {
                require(['../../view/logs/logs', '../../model/logs/logs'], function(View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        },
        operateLog: function() {
            this.preRoute(false, 'logs').then(function() {
                require(['../../view/logs/logs2', '../../model/logs/logs'], function(View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        }
    });
});