; $(function () {
    var login_type = 0;
    var mobile = /^1[34578]\d{9}$/;
    var email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    var login = {
        init: function () {
            if (GetQueryString("login") !== null) {
                $("#login_form").text("解除绑定");
                document.title = "账户解绑";
                login_type = 1;
            } else {
                $("#login_form").text("绑定账户");
                document.title = "账户绑定";
                login_type = 0;
            }
            this.login_success();
        },
        login_success: function () {
            if (login_type == 1 || $.cookie('loginuser') === undefined) {
                $("#login").show();
                $("#login_ok").hide();
            } else {
                if ($.cookie('loignnum') != 1) {
                    window.location.href = "my.html"
                    return false;
                } 
                $("#login").hide();
                $("#login_ok").show();
                var i = 2;
                var intervalid = setInterval(fun, 1000);
                function fun() {
                    if (i == 0) {
                        if (document.referrer == "" || /index.html/.test(document.referrer) || document.referrer == location.origin + "/" || document.referrer.indexOf("open.weixin.qq.com") != -1 || document.referrer.indexOf(window.location.hostname) == -1 || document.referrer.indexOf(location.pathname) != -1) {
                            //来源为空或是首页或不是同一域名
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
                    ele.text(countdown + "秒后重发");
                    countdown--;
                }
                ele[0].settimes = setTimeout(function () {
                    settime(ele)
                }, 1000)
            };
            settime();
            login.sendvercode();
        },
        sendvercode: function () {
            var data = {
                "mobilePhoneNo": $("#username").val()
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
                    $(".errortip").html('验证码正确').css('color', '#ff0');
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
                    var power = res.data.sysUserEntity
                    if (power.isLocked == true && power.locked == true) {
                        $.removeCookie('loginuser', { path: "/" });
                        weui.alert("您的账号已被锁定！", function () {
                        }, { title: '提示' });
                    } else if (power.status == 0) {
                        $.removeCookie('loginuser', { path: "/" });
                        weui.alert("您的认证仍在审核中！", function () {
                        }, { title: '提示' });
                    } else if (power.status == 2) {
                        $.removeCookie('loginuser', { path: "/" });
                        weui.alert("您的认证未通过！", function () {
                        }, { title: '提示' });
                    } else if (power.status == 3) {
                        $.removeCookie('loginuser', { path: "/" });
                        weui.alert("您未进行实名认证！", function () {
                        }, { title: '提示' });
                    } else {
                        $.cookie('loginuser', JSON.stringify(res.data), { path: "/" });
                        $.cookie('loignnum', 1, { path: "/" });
                        weui.toast('绑定成功', { duration: 1500, });
                        setTimeout(function () {
                            that.login_success();
                        }, 1000)
                    }
                } else {
                    $.removeCookie('loginuser', { path: "/" });
                    $(".errortip").text(res.msg);
                }
            })
        },
        unbinguser: function (data) {
            ajaxreq.unbingAccount(data).done(res => {
                if (res.code == 0) {
                    $.removeCookie('loginuser', { path: "/" });
                    weui.toast('解绑成功', { duration: 1000, });
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 1000)
                } else {
                    $(".errortip").text(res.msg);
                }
            });
        }
    }
    login.init();
    $("#username").keyup(function () {
        var username = $("#username").val();
        if (!mobile.test(username) && !email.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入正确的账户名");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text('');
        }
    });
    $("#password").keyup(function () {
        var password = $("#password").val();
        if (password.length < 8) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入8~20位密码");
        } else {
            $("#login .weui-cell").eq(1).removeClass("weui-cell_warn");
            $(".errortip").text('');
        }
    });
    $("#codeid").keyup(function () {
        var codeid = $("#codeid").val();
        var username = $("#username").val();
        if (codeid.length <= 5) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            $("#login .weui-cell").eq(2).removeClass("weui-cell_warn");
            $(".errortip").text('');
            // if (mobile.test(username) || email.test(username)) {
            //     login.checkSms();
            // }
        }
    });
    $(".weui-vcode-btn").on("click", function () {
        var username = $("#username").val();if (username.length < 1) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入企业账户");
        } else if (!mobile.test(username) && !email.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入正确的账户名");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text('');
            login.get_code();
        }
    });
    $("#login_form").on("click", function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var codeid = $("#codeid").val();
        if (username.length < 1) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入企业账户");
        } else if (!mobile.test(username) && !email.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入正确的账户名");
        } else if (password.length < 1) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入平台密码");
        } else if (password.length < 8) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入8~20位密码");
        } else if (codeid.length < 6) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            login.login_form();
        }
    });
});