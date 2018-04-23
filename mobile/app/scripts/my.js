; $(function () {
    var mylist = {
        init: function () {
            $("#userimg").attr('src', wxuserinfo.headimgurl)
            $(".name").text(wxuserinfo.nickname)
            this.userinfo();
        },
        userinfo: function () {
            var user = $.cookie('loginuser') && JSON.parse($.cookie('loginuser'));
            if (user) {
                $("#users").text(user.sysUserEntity.mobile);
                $("#companyname").text(user.sysUserEntity.username);
                $("#integral").text((user.totalAmount ? user.totalAmount : '0') + '分');
            }
        },
        unbind: function () {
            var user = $.cookie('loginuser') && JSON.parse($.cookie('loginuser'));
            var data = {
                "mobile": user.sysUserEntity.mobile,
                "wechatUser": {
                    "openid": wxuserinfo.openid,
                }
            }
            ajaxreq.unbingAccount(data).done(res => {
                if (res.code == 0) {
                    $.removeCookie('loginuser', { path: "/" });
                    weui.toast('解绑成功', { duration: 1000, });
                    setTimeout(function () {
                        window.location.href = 'login.html';
                    }, 1000)
                } else {
                    weui.toast(res.msg, {
                        duration: 1500,
                        className: 'custom-none-icon',
                    });
                }
            });
        }
    }
    mylist.init();
    $("#unbind").on("click", function () {
        weui.confirm('解除绑定后，您的积分将会保留', {
            title: '确认解除绑定',
            buttons: [{
                label: '取消',
                type: 'default',
            }, {
                label: '确定',
                type: 'primary',
                onClick: function () {
                    mylist.unbind(); //直接解绑，不验证信息
                    // window.location.href = 'login.html?login=unbind'
                }
            }]
        });
    })
});