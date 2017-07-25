import tpl from './tpl/step1.html';
var service = require('../../server/service').default;
var step1 = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click .hang input': 'codetype',
        'click #xieyi': 'rules',
        'click #reguser': 'reguser',
        //'keyup #idcode': 'checkidCode',
        'keyup #yzmcode': 'checkCode',
        'click #up_yzmcode,.codeimg': 'captcha',
    },

    rules: function () {
        if ($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },
    codetype() {
        var val = $('input:radio[name="idcode"]:checked').val();
        if (val == 1) {
            $("#codetype").text("营业执照号：");
            $("#idcode").attr({ placeholder: "请输入营业执照号", maxlength: "15" });
        } else if (val == 0) {
            $("#codetype").text("统一社会信用代码：");
            $("#idcode").attr({ placeholder: "请输入18位统一社会信用代码", maxlength: "18" });
        }
    },
    //检查信用代码是否注册
    // checkidCode: function (data) {
    //     if ($('#idcode').val().length == 18) {
    //         var data = {
    //             "idcode": $('#idcode').val(),
    //         }
    //         service.checkidCode(data).done(function (data) {
    //             if (data.code == 0) {
    //                 $("#idcode-error").html(data.msg).css({ "color": "#08c34e" });
    //             } else if (data.code == 3) {
    //                 $("#idcode-error").html(data.msg);
    //             }
    //         })
    //     } else {
    //         $('#idcode-error').html('').css({ "color": "#f00" });
    //     }
    // },
    //检查随机验证码
    // checkyzmCode: function (data) {
    //     if ($('#yzmcode').val().length == 4) {
    //         var data = {
    //             "yzmcode": $('#yzmcode').val(),
    //         }
    //         service.checkyzmCode(data).done(function (data) {
    //             if (data.code == 0) {
    //                 $("#yzmcode-error").html(data.msg).css({ "color": "#08c34e" });
    //             } else {
    //                 $("#yzmcode-error").html(data.msg);
    //             }
    //         })
    //     } else {
    //         $('#yzmcode-error').html('').css({ "color": "#f00" });
    //     }
    // },
    checkCode: function (data) {
        if ($('#yzmcode').val().length < 4) {
            var data = {
                "yzmcode": $('#yzmcode').val(),
            }
            $('#yzmcode-error').html('');
        }
    },
    // 获取图片验证码；
    captcha() {
        $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random());
    },

    reguser: function (event) {
        var enterpriseCode = $("#Ename").val();
        var captcha = $("#yzmcode").val();
        window.reqres.setHandler("enterpriseCode", function () {
            return enterpriseCode;
        });

        this.model.set({ "clickEle": $(event.target).data('id') });
        if (!this.model.isValid()) {
            var data = {
                "enterpriseCode": enterpriseCode,
                "captcha": captcha,
            }
            service.register(data).done(res => {
                if (res.code == 0) {
                    window.open('#step2', '_self')
                } else if (res.code == 1) {
                    $("#yzmcode-error").html(res.msg);
                    $("#yzmcode").focus();
                    this.captcha();
                };
            })
        }
    },

    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;