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
                    window.location.href = 'login.html?login=unbind'
                }
            }]
        });
    })
});