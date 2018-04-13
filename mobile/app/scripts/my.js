; $(function () {
    var mylist = {
        init: function () {
            $("#userimg").attr('src',wxuserinfo.headimgurl)
            $(".name").text(wxuserinfo.nickname)
            var that = this;
            // this.user_auth_check();
        },
        user_auth_check: function () {
        },
    }
    mylist.init();
    
    $("#unbind").on("click", function () {
        weui.confirm('解除绑定后，您的积分将会保留', {
            title: '确认解绑绑定',
            buttons: [{
                label: '取消',
                type: 'default',
            }, {
                label: '确定',
                type: 'primary',
                onClick: function(){
                    window.location.href='login.html?login=unbind'
                }
            }]
        });
    })
});