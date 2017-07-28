import tpl from './tpl/step1.html';
var firmId;
var enterpriseCode;
var service = require('../../server/service').default;
var step1 = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        // 'click .hang input': 'codetype',
        'click #xieyi': 'rules',
        'click #reguser': 'reguser',
        //'keyup #idcode': 'checkidCode',
        'keyup #yzmcode': 'checkCaptcha',
        'click #up_yzmcode,.codeimg': 'captcha',
        'click #codetype': 'checkname',
        'click #test22': 'checkUserIsExist',
        //'change #Ename': 'checknameerror',
        'blur #Ename': 'checkname'
    },
    //同意协议
    rules: function () {
        if ($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },
    // codetype() {
    //     var val = $('input:radio[name="idcode"]:checked').val();
    //     if (val == 1) {
    //         $("#codetype").text("营业执照号：");
    //         $("#idcode").attr({ placeholder: "请输入营业执照号", maxlength: "15" });
    //     } else if (val == 0) {
    //         $("#codetype").text("统一社会信用代码：");
    //         $("#idcode").attr({ placeholder: "请输入18位统一社会信用代码", maxlength: "18" });
    //     }
    // },
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
    
    // 获取图片验证码；
    captcha() {
        $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random());
    },
    //企业名称模糊搜索
    typeahead() {
        $('#Ename').typeahead({
            ajax: {
                url: "/mp/check_organization/web/solr/company/list",
                timeout: 500,
                displayField: "name",
                triggerLength: 1,
                method: "post",
                loadingClass: "loading-circle",
                preDispatch: function (query) {
                    return JSON.stringify({ pageNum: 1, pageSize: 8, params: { name: query } })
                },
                preProcess: function (data) {
                    //showLoadingMask(false);
                    if (data.code === false) {
                        // Hide the list, there was some error
                        return false;
                    }
                    // We good!
                    return data.data;
                },
            },
        });
    },
    checkname() {
        var name = $("#Ename").val()
        var data = { "params": { "name": name } }
        if (name.length > 0) {
            service.checkname(data).done(res => {
                if (res.code == 0) {
                    enterpriseCode = res.data.organizationCode
                    firmId = res.data.id
                    if (!enterpriseCode) {
                        $("#Ename-error").html("该企业不可注册");
                    } else {
                        this.checkUserIsExist(enterpriseCode);
                    }
                }
            });
        }
    },
    //验证公司能否注册
    checkUserIsExist(data) {
        var data = {
            "enterpriseCode": data,
        }
        console.log(data);
        service.checkUserIsExist(data).done(res => {
            if (res.code == 0) {
                $("#Ename-error").html("该企业可注册").css({ "color": "#08c34e" });
            } else if (res.code == 2) {
                $("#Ename-error").html("当前企业已注册，<a href='login.html'>立即登录</a>");
            } else if (res.code == 3) {
                $("#Ename-error").html("当前企业已办理电子印章，使用UKEY<a href='login.html'>快速登录</a>");
            } else if (res.code == 4) {
                $("#Ename-error").html("很抱歉，该企业暂时不支持电子印章申请");
            }
        })
    },
    checknameerror: function (data) {
        $('#Ename-error').html('');
    },
    //检查图片验证码
    checkCaptcha: function (data) {
        if ($('#yzmcode').val().length == 4) {
            var data = {
                "captcha": $('#yzmcode').val(),
            }
            service.checkCaptcha(data).done(res => {
                if (res.code == 0) {
                    $("#yzmcode-error").html("验证码正确").css({ "color": "#08c34e" });
                } else {
                    $("#yzmcode-error").html(res.msg);
                    this.captcha();
                }
            })
        } else {
            $('#yzmcode-error').html('').css({ "color": "#f00" });
        }
    },
    //点击注册
    reguser(data) {
        localStorage.firmId = firmId;
        this.model.set({ "clickEle": $(event.target).data('id') });
        if (!this.model.isValid()) {
            var data = {
                "firmId": firmId,
            }
            service.toRegister(data).done(res => {
                if (res.code == 0) {
                    localStorage.firmId = firmId;
                    window.open('#step2', '_self')
                }
            })
        }
    },

    render: function (query) {
        this.$el.html(tpl);
        this.typeahead();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;