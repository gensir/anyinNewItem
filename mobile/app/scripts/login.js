; $(function () {
    var login_type = 0;
    var mobile = /^1[34578]\d{9}$/;
    var login = {
        init: function () {
            if (GetQueryString("login") !== null) {
                $("#login_form").text("解除绑定");
                login_type = 1;
            } else {
                this.login_ok();
                $("#login_form").text("绑定账户");
                login_type = 0;
            }
        },
        login_ok: function () {
            var user = $.cookie('loginuser') && (JSON.parse($.cookie('loginuser')) || { "sysUserEntity": "", "wechatUser": "" });
            var toke = $.cookie('sealnetSession');
            if (toke === undefined || (user && user.sysUserEntity == "" && user.wechatUser == "")) {
                $("#login").show();
                $("#login_ok_show").hide();
            } else {
                $("#login").hide();
                $("#login_ok_show").show();
                var i = 3;
                var intervalid = setInterval(fun, 1000);
                function fun() {
                    if (i == 0) {
                        if (document.referrer == "" || /index.html/.test(document.referrer) || document.referrer.indexOf("open.weixin.qq.com") != -1 || document.referrer.indexOf(window.location.hostname) == -1 || document.referrer.indexOf(location.pathname) != -1) {//来源为空或不是同一域名或是首页
                            window.location.href = "my.html"
                        } else {
                            window.location.href = document.referrer;
                        }
                        clearInterval(intervalid);
                    }
                    document.getElementById("mes").innerHTML = i;
                    i--;
                }
            }
        },
        get_code: function () {
            var phone = $("#username").val();
            var countdown = 60;
            var ele = $(".weui-vcode-btn");
            function settime() {
                if (countdown == 0) {
                    ele.removeAttr("disabled");
                    ele.text("获取验证码");
                    countdown = 60;
                    clearTimeout(ele[0].settimes);
                    return false;
                } else {
                    ele.attr("disabled", true);
                    ele.text("重新发送(" + countdown + ")");
                    countdown--;
                }
                ele[0].settimes = setTimeout(function () {
                    settime(ele)
                }, 1000)
            };
            settime();
            login.sendvercode(phone);
        },
        sendvercode: function (phone) {
            var data = {
                "mobilePhoneNo": phone
            }
            ajaxreq.SMSVerifCode(data).done(res => {
                if (res.code == 0) {
                    weui.toast('发送成功', {
                        duration: 1500,
                        callback: function () { console.log('验证码发送成功') }
                    });
                } else {
                    weui.alert("验证码发送失败", { title: '提示' });
                }
            })
        },
        checkSms: function () {
            var data = {
                "mobilePhoneNo": $("#username").val(),
                "smsCode": $("#codeid").val()
            }
            ajaxreq.checkSmsCode(data).done(res => {
                if (res.code == 0) {
                    $(".errortip").text('');
                    this.login_form();
                } else {
                    $(".errortip").text(res.msg);
                }
            })
        },
        login_form: function () {
            var data = {
                "mobile": $("#username").val(),
                "password": $("#password").val(),
                "smsCode": $("#codeid").val(),
                "wechatUser": {
                    "openid": wxuserinfo.openid,
                    "nickname": wxuserinfo.nickname
                }
            }
            if (login_type == 0) {
                this.binduser(data)
            } else {
                this.unbinguser(data)
            }
        },
        binduser: function (data) {
            ajaxreq.bindAccount(data).done(res => {
                var that = this;
                if (res.code == 0) {
                    $.cookie('sealnetSession', JSON.stringify(res.data), { path: "/" });
                    weui.toast('登录成功', { duration: 1500, });
                    setTimeout(function () {
                        that.login_ok();
                    }, 1500)
                } else {
                    $.removeCookie('sealnetSession', { path: "/" });
                    $(".errortip").text(res.msg);
                }
            })
        },
        unbinguser: function (data) {
            ajaxreq.unbingAccount(data).done(res => {
                if (res.code == 0) {
                    $.removeCookie('sealnetSession', { path: "/" });
                    weui.toast('解绑成功', { duration: 1500, });
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 1500)
                } else {
                    $(".errortip").text(res.msg);
                }
            })
        }
    }
    login.init();
    $("#username,#password,#codeid").keyup(function () {
        $(".errortip").text('');
    });
    $("#username").change(function () {
        var username = $("#username").val();
        if (username.length < 11) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else if (!mobile.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text('');
        }
    });
    $("#password").change(function () {
        var password = $("#password").val();
        if (password.length < 6) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位及以上密码");
        } else {
            $("#login .weui-cell").eq(1).removeClass("weui-cell_warn");
            $(".errortip").text('');
        }
    });
    $("#codeid").change(function () {
        var codeid = $("#codeid").val();
        if (codeid.length != 6) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            $("#login .weui-cell").eq(2).removeClass("weui-cell_warn");
            $(".errortip").text('');
        }
    });
    $(".weui-vcode-btn").on("click", function () {
        var phone = $("#username").val()
        if (!mobile.test(phone)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("你输入的账户名有误");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text('');
            login.get_code();
        }
    });
    $("#login_form").on("click", function () {
        var username = $("#username").val()
        var password = $("#password").val()
        var codeid = $("#codeid").val()
        if (!mobile.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else if (password.length < 6) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位及以上密码");
        } else if (codeid.length < 6) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            login.checkSms();
        }
    });
});