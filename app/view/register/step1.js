import tpl from './tpl/step1.html';
var firmId, enterpriseCode;
var flag = false;
var cname = false;
var service = require('../../server/service').default;
var step1 = Backbone.View.extend({
    el: '.container',
    initialize() {
    },
    render: function (query) {
        this.$el.html(tpl);
        this.Emptyinput();
        this.rules();
        this.typeahead();
        localStorage.clear();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    events: {
        'click #xieyi': 'rules',
        'click #reguser': 'reguser',
        'keyup #yzmcode': 'checkCaptcha',
        'click #up_yzmcode,.codeimg': 'CodeRefresh',
        'change #Ename': 'checknameerror',
        'blur #Ename': 'blurcheck'
    },
    //同意协议
    rules() {
        if ($('#xieyi').is(':checked')) {
            $('#reguser').attr("disabled", false);
        } else {
            $('#reguser').attr("disabled", true);
        }
    },
    //IE中重置表单内容
    Emptyinput() {
        window.onload = function () {
            document.reg.reset();
        }
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
    //输入框blur后自动查询校验
    blurcheck() {
        var _this = this, timer
        timer = setTimeout(function () {
            _this.checkname();
        }, 200);
    },
    //企业名称查询编码
    checkname() {
        var name = $.trim($("#Ename").val());
        var data = { "params": { "name": name } }
        if (name.length > 0) {
            service.checkname(data).done(res => {
                if (res.code == 0 && (res.data != "" || res.data.length != 0)) {
                    enterpriseCode = res.data[0].creditCode || res.data[0].organizationCode;
                    firmId = res.data[0].id;
                    if (enterpriseCode == null) {
                        cname = false;
                        $("#Ename-error").html("企业信息异常，不可注册").css({ "color": "#f00" });
                    } else {
                        cname = true;
                        this.checkUserIsExist(enterpriseCode);
                    }
                } else {
                    cname = false;
                    $("#Ename-error").html("企业不存在，不可注册").css({ "color": "#f00" });
                }
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
                cname = true;
                $("#Ename-error").html("该企业可注册").css({ "color": "#08c34e" });
            } else if (res.code == 1) {
                cname = false;
                $("#Ename-error").html("当前企业已注册，<a href='login.html'>立即登录</a>").css({ "color": "#f00" });
            } else if (res.code == 2) {
                cname = false;
                $("#Ename-error").html("当前企业已办理电子印章，使用UKEY<a href='login.html'>快速登录</a>").css({ "color": "#f00" });
            } else if (res.code == 3) {
                cname = false;
                $("#Ename-error").html("很抱歉，该企业暂时不支持电子印章申请").css({ "color": "#f00" });
            }
        })
    },
    //重置企业名称错误提示
    checknameerror() {
        $('#Ename-error').html('').css({ "color": "#f00" });
    },
    //更换验证码
    CodeRefresh() {
        $('#yzmcode-error').html('').css({ "color": "#f00" });
        $('#yzmcode').val("");
        $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random())
    },
    //校验图片验证码
    checkCaptcha(data) {
        if ($('#yzmcode').val().length >= 4) {
            var data = {
                "captcha": $('#yzmcode').val()
            }
            service.checkCaptcha(data).done(res => {
                if (res.code == 0) {
                    flag = true;
                    $("#yzmcode-error").html("验证码正确").css({ "color": "#08c34e" });
                } else {
                    flag = false;
                    $("#yzmcode-error").html(res.msg).css({ "color": "#f00" });
                    $(".codeimg").attr('src', '/mp/captcha.jpg?' + Math.random());
                }
            })
        } else {
            $('#yzmcode-error').html('').css({ "color": "#f00" });
        }
    },
    //点击注册进入第二步
    toreguser(data) {
        var data = {
            "firmId": firmId
        }
        service.toRegister(data).done(res => {
            if (res.code == 0) {
                localStorage.firmId = firmId;
                localStorage.regStep = "#step2";
                window.open('#step2', '_self')
            }
        })
    },
    //提交注册验证
    reguser(event) {
        if ($.trim($("#Ename").val()) == "") {
            $("#Ename-error").html("请输入企业名称").css({ "color": "#f00" });
            cname = false;
        }
        if ($("#yzmcode").val().length < 4) {
            $("#yzmcode-error").html("请输入4位验证码").css({ "color": "#f00" });
            flag = false;
        }
        if (cname && flag) {
            this.toreguser();
        }        
        // this.model.set({ "clickEle": $(event.target).data('id') });
        // if (!this.model.isValid()) {
        // }
    }
});

module.exports = step1;