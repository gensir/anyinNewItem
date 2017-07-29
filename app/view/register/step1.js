import tpl from './tpl/step1.html';
var firmId;
var enterpriseCode;
var service = require('../../server/service').default;
var step1 = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    events: {
        'click #xieyi': 'rules',
        'click #reguser': 'reguser',
        'keyup #yzmcode': 'checkCaptcha',
        'click #up_yzmcode,.codeimg': 'captcha',
        'click #codetype': 'checkname',
        'change #Ename': 'checknameerror',
        //'blur #Ename': 'checkname'
    },
    //同意协议
    rules: function () {
        if ($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },

    // 更换图片验证码；
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
                    return JSON.stringify({ pageNum: 1, pageSize: 10, params: { name: query } })
                },
                preProcess: function (data) {
                    //showLoadingMask(false);
                    if (data.code === false) {
                        // Hide the list, there was some error
                        return false;
                    }
                    // We good!
                    return data.data;
                }
            }
        })
    },
    //企业名称查询编码
    checkname() {
        var name = $("#Ename").val()
        var data = { "params": { "name": name } }
        if (name.length > 0) {
            service.checkname(data).done(res => {
                if (res.code == 0 && res.data !== null) {
                    enterpriseCode = res.data.organizationCode;
                    firmId = res.data.id;
                    if (enterpriseCode == null) {
                        $("#Ename-error").html("企业信息异常，不可注册").css({ "color": "#f00" });
                    } else {
                        this.checkUserIsExist(enterpriseCode);
                    }
                } else {
                    $("#Ename-error").html("企业不存在，不可注册").css({ "color": "#f00" });
                }
                //console.log("firmId：" + firmId)
            })
        }
    },
    //校验公司能否注册
    checkUserIsExist(data) {
        var data = {
            "enterpriseCode": data
        }
        service.checkUserIsExist(data).done(res => {
            if (res.code == 0) {
                $("#Ename-error").html("该企业可注册").css({ "color": "#08c34e" });
                if ($('#yzmcode').val().length == 4) {
                    this.toreguser();
                }
            } else if (res.code == 2) {
                $("#Ename-error").html("当前企业已注册，<a href='login.html'>立即登录</a>").css({ "color": "#f00" });
            } else if (res.code == 3) {
                $("#Ename-error").html("当前企业已办理电子印章，使用UKEY<a href='login.html'>快速登录</a>").css({ "color": "#f00" });
            } else if (res.code == 4) {
                $("#Ename-error").html("很抱歉，该企业暂时不支持电子印章申请").css({ "color": "#f00" });
            }
            //console.log("企业校验完成")
        })
    },

    checknameerror(data) {
        $('#Ename-error').html('').css({ "color": "#f00" });
    },
    //校验图片验证码
    checkCaptcha(data) {
        if ($('#yzmcode').val().length == 4) {
            var data = {
                "captcha": $('#yzmcode').val()
            }
            service.checkCaptcha(data).done(res => {
                if (res.code == 0) {
                    $("#yzmcode-error").html("验证码正确").css({ "color": "#08c34e" });
                } else {
                    $("#yzmcode-error").html(res.msg).css({ "color": "#f00" });
                    this.captcha();
                }
            })
        } else {
            $('#yzmcode-error').html('').css({ "color": "#f00" });
        }
    },
    //提交注册验证
    toreguser(data) {
        var data = {
            "firmId": firmId,
        }
        service.toRegister(data).done(res => {
            if (res.code == 0) {
                localStorage.firmId = firmId;
                window.open('#step2', '_self')
            }
        })
    },
    //点击注册进入第二步
    reguser(data) {
        this.model.set({ "clickEle": $(event.target).data('id') });
        if (!this.model.isValid()) {
            this.checkname();
        }
    },

    render: function (query) {
        this.$el.html(tpl);
        this.typeahead();
        localStorage.clear();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;