; $(function () {
    var pwxcode, swxcode;
    if (window.document.location.hostname == "localhost") {
        var pwxcode = "12345678901234567891";
        var swxcode = "12345678901234567892";
    } else {
        var pwxcode = $.cookie('openid');
        var swxcode = $.cookie('openid');
    }
    // login_auto(pwxcode);
    function login_auto(pwxcode) {
        var data = {
            "wxcode": pwxcode
        }
        ajaxreq.user_auth_callback(data).done(function (data) {
            if (data.code == 0) {
                localStorage.loginName = data.data.username;
                $.cookie('sealnetSession', data.data.token, { path: "/" });
                localStorage.loginnum = 0;
            } else if (data.code == 1) {
                localStorage.loginnum = 1;
                $.removeCookie('sealnetSession');
                return false;
            } else {
                localStorage.loginnum = 1;
                $.removeCookie('sealnetSession');
                window.location.href = "./wxthird.html";
                return false;
            }
            setTimeout(login_ok(), 100);
        })
    };
    function login_ok() {
        var token = $.cookie('sealnetSession');
        var loginnum = localStorage.loginnum;
        if ((token === undefined) || (loginnum === undefined) || (loginnum != 0)) {
            $("#tab").show();
            $("#login_ok_show").hide();
        } else {
            $("#tab").hide();
            $("#login_ok_show").show();
            var i = 3;
            var intervalid = setInterval(fun, 1000);
            function fun() {
                if (i == 0) {
                    if (document.referrer == "" || /unbind.html/.test(document.referrer) || document.referrer.indexOf("open.weixin.qq.com")!=-1 || document.referrer.indexOf(window.location.hostname) == -1 || document.referrer.indexOf(location.pathname) != -1) {//来源为空或不是同一域名或是首页
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
    };

    $("#logout").on("click", function () {
        $.removeCookie('sealnetSession');
        $.removeCookie('expires');
        $.removeCookie('userid');
        localStorage.removeItem('loginName');
        localStorage.removeItem('loginTime');
        localStorage.removeItem('wxcode');
        location.reload();
    });
    $("#username").change(function () {
        var mobile = /^1[34578]\d{9}$/;
        var username = $("#username").val()
        if (!mobile.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text("");
        }
    });
    $("#passwd").change(function () {
        var passwd = $("#passwd").val()
        if (passwd.length < 6) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位以上的密码");
        } else {
            $("#login .weui-cell").eq(1).removeClass("weui-cell_warn");
            $(".errortip").text("");
        }
    });
    $("#codeid").change(function () {
        var codeid = $("#codeid").val()
        if (codeid.length != 6) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            $("#login .weui-cell").eq(2).removeClass("weui-cell_warn");
            $(".errortip").text("");
        }
    });
    $(".weui-vcode-btn").on("click", function () {
        var mobile = /^1[34578]\d{9}$/;
        var phone = $("#username").val()
        if (!mobile.test(phone)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else {
            $("#login .weui-cell").eq(0).removeClass("weui-cell_warn");
            $(".errortip").text("");
            get_code();
        }
    });
    $("#pwd_login").on("click", function () {
        var mobile = /^1[34578]\d{9}$/;
        var username = $("#username").val()
        var passwd = $("#passwd").val()
        var codeid = $("#codeid").val()
        if (!mobile.test(username)) {
            $("#login .weui-cell").eq(0).addClass("weui-cell_warn");
            $(".errortip").text("请输入你的注册账户名");
        } else if (passwd.length < 6) {
            $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位以上的密码");
        } else if (codeid.length < 6 ) {
            $("#login .weui-cell").eq(2).addClass("weui-cell_warn");
            $(".errortip").text("请输入6位验证码");
        } else {
            pwd_login_member(username, passwd, pwxcode);
        }
    });
    function get_code() {
        var phone = $("#phone").val();
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
        sendvercode(phone);
    };
    function sendvercode(phone) {
        var data = {
            "telephone": phone
        }
        ajaxreq.sendvercode(data).done(res => {
            if (res.code == 0) {
                weui.toast('发送成功', {
                    duration: 1500,
                    callback: function () { console.log('验证码发送成功') }
                });
            } else {
                weui.alert("验证码发送失败", { title: '提示' });
            }
        })
    };
    function pwd_login_member(username, passwd, pwxcode) {
        var data = {
            "username": username,
            "pwd": $.md5(passwd),
            "wxcode": pwxcode
        }
        ajaxreq.pwd_login_member(data).done(res => {
            if (res.code == 0) {
                weui.toast('登录成功', {
                    duration: 1500,
                    callback: function () {
                        localStorage.loginName = username;
                        //localStorage.wxcode = pwxcode;
                        // var min = 7;
                        // var exp = new Date();
                        // exp.setTime(exp.getTime() + min * 24 * 60 * 60 * 1000);
                        $.cookie('sealnetSession', res.data.token, { path: "/" });
                        $.cookie('userid', res.data.userid, { path: "/" });
                        //$.cookie('expires', exp, { path: "/" });
                        var nowDate = new Date();
                        var end_ms = parseInt(nowDate.getTime()) + parseInt(7 * 24 * 60 * 60 * 1000); //获取的过期时间7天（从登录开始计算）；
                        localStorage.loginTime = end_ms;
                        if (document.referrer == "" || /unbind.html/.test(document.referrer) || document.referrer.indexOf(window.location.hostname) == -1 || document.referrer.indexOf(location.pathname) != -1) {
                            window.open('my.html', '_self');
                            return false;
                        } else {
                            location.href = document.referrer;
                        }
                    }
                });
            } else if (res.code == 2) {
                $("#login .weui-cell").eq(1).addClass("weui-cell_warn");
                weui.alert("密码输入错误", { title: '提示' });
            } else if (res.code == 3) {
                weui.dialog({
                    title: '账户提示',
                    content: '手机号未注册，现在去注册？',
                    className: 'custom-classname',
                    buttons: [{
                        label: '取消',
                        type: 'default',
                        onClick: function () { }
                    }, {
                        label: '确定',
                        type: 'primary',
                        onClick: function () {
                            window.open('register.html', '_self');
                        }
                    }]
                });
            } else {
                weui.alert(res.msg, { title: '提示' });
            }
        })
    };
    

});