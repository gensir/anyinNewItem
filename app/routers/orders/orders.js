define(function (require, exports, module) {
    "use strict";

    // External dependencies.
    var service = require('../../../app/lib/service');
    var Backbone = require("backbone");

    // Defining the application router.
    module.exports = Backbone.Router.extend({
        routes: {
            "": "orders",
            "invoice?:query": "invoice",
            "invoice_ok": "invoice_ok"
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
        orders: function () {
            this.preRoute(false, 'orders').then(function () {
                require(['../../view/orders/orders', '../../model/orders/orders'], function (View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        },
        invoice: function () {
            this.preRoute(false, 'orders').then(function () {
                require(['../../view/orders/invoice', '../../model/orders/orders'], function (View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        },
        invoice_ok: function () {
            this.preRoute(false, 'orders').then(function () {
                require(['../../view/orders/invoice_ok', '../../model/orders/orders'], function (View, Model) {
                    var view = new View({ model: new Model() });
                    view.render();
                });
            });
        }
    });
});