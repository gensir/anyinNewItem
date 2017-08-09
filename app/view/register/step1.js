import tpl from './tpl/step1.html';
var firmId,enterpriseCode
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
    //重置验证码输入
    CodeRefresh() {
        $('#yzmcode-error').html('').css({ "color": "#f00" });
        $('#yzmcode').val("");
        this.captcha();
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
    //输入框blur后自动查询校验
    blurcheck() {
        var _this = this, timer
        timer = setTimeout(function () {
            _this.checkname();
        }, 100);
    },
    //企业名称查询编码
    checkname() {
        var name = $("#Ename").val()
        var data = { "params": { "name": name } }
        if (name.length > 0) {
            service.checkname(data).done(res => {
                if (res.code == 0 && res.data != "" || res.data.length != 0) {
                    enterpriseCode = res.data[0].creditCode || res.data[0].organizationCode;
                    firmId = res.data[0].id;
                    if (enterpriseCode == null) {
                        $("#Ename-error").html("企业信息异常，不可注册").css({ "color": "#f00" });
                        this.CodeRefresh();
                    } else {
                        this.checkUserIsExist(enterpriseCode);
                    }
                } else {
                    $("#Ename-error").html("企业不存在，不可注册").css({ "color": "#f00" });
                    this.CodeRefresh();
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
            } else if (res.code == 1) {
                $("#Ename-error").html("当前企业已注册，<a href='login.html'>立即登录</a>").css({ "color": "#f00" });
                this.CodeRefresh();
            } else if (res.code == 2) {
                $("#Ename-error").html("当前企业已办理电子印章，使用UKEY<a href='login.html'>快速登录</a>").css({ "color": "#f00" });
                this.CodeRefresh();
            } else if (res.code == 3) {
                $("#Ename-error").html("很抱歉，该企业暂时不支持电子印章申请").css({ "color": "#f00" });
                this.CodeRefresh();
            }
            //console.log("企业校验完成")
        })
    },
    //重置企业名称错误提示
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
    //点击注册进入第二步
    reguser(event) {
        this.model.set({ "clickEle": $(event.target).data('id') });
        if (!this.model.isValid()) {
            this.checkname();
        }
    },
});

module.exports = step1;