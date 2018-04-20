define([
    "text!./tpl/step5.html",
    "text!../pub/tpl/footer.html",
    "../../../app/lib/service",
    "bootbox"
], function (tpl, primary, service, bootbox) {
    var Backbone = require('backbone');
    var template = require('art-template');
    var main = Backbone.View.extend({
        el: '#main',
        initialize: function () {

        },
        render: function (param) {
            this.RedeemCode();
            this.$el.append(template.compile(primary, {})());
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        events: {

        },
        RedeemCode: function () {
            var url = window.location.hash.split("?")[1]
            if (Boolean(url)) {
                var datas = window.atob(url)
                var code = this.getUrlParam('code', datas);
            }
            if (Boolean(code)) {
                var obj = code
            }
            this.$el.html(template.compile(tpl)({ data: obj }));
        },
        getUrlParam: function (name, after) {
            // var after = window.location.hash.split("?")[1];
            if (after) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = after.match(reg);
                if (r != null) {
                    return decodeURIComponent(r[2]);
                } else {
                    return null;
                }
            }
        },
    });
    return main;
});
