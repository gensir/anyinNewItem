import tpl from './tpl/step1.html';
var service = require('../../server/service').default;
var step1 = Backbone.View.extend({
    el: '.container',
    initialize() {
        this.render();
    },
    events: {
        'click #xieyi': 'rules',
        'click #reguser': 'reguser',
        'keyup #idcode': 'checkidCode',
        'keyup #yzmcode': 'checkyzmCode',
        'click #up_yzmcode': 'yzmcode',
    },

    rules: function () {
        if ($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },
    //检查信用代码是否注册
    checkidCode: function (data) {
        if ($('#idcode').val().length == 18) {
            var data = {
                "idcode": $('#idcode').val(),
            }
            service.checkidCode(data).done(function (data) {
                if (data.code == 0) {
                    $("#idcode-error").html(data.msg).css({ "color": "#08c34e" });
                } else if (data.code == 3) {
                    $("#idcode-error").html(data.msg);
                }
            })
        } else {
            $('#idcode-error').html('').css({ "color": "#f00" });
        }
    },
    //检查随机验证码
    checkyzmCode: function (data) {
        if ($('#yzmcode').val().length == 4) {
            var data = {
                "yzmcode": $('#yzmcode').val(),
            }
            service.checkyzmCode(data).done(function (data) {
                if (data.code == 0) {
                    $("#yzmcode-error").html(data.msg).css({ "color": "#08c34e" });
                } else {
                    $("#yzmcode-error").html(data.msg);
                }
            })
        } else {
            $('#yzmcode-error').html('').css({ "color": "#f00" });
        }
    },
    // 获取随机验证码；
    yzmcode() {
        var captchaProperties = {
            captchaHash: ''
        };
        service.yzmCode().done(function (data) {
            // $('#codeimg').html('<img class="codeimg" src="data:image/png;base64,' + result.data.data.image + '" />');
            // captchaProperties.captchaHash = result.data.data.captchaHash;
            $('#codeimg').html('<img class="codeimg" src="' + data.data.fileId + '" />');
        });
    },
    reguser: function (event) {
        this.model.set({ "clickEle": $(event.target).data('id') });
        this.model.isValid();
        if (!this.model.isValid()) {
            window.open('#step2', '_self')
        }
    },

    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;