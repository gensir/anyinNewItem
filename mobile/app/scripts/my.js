; $(function () {
    var wxuserinfo;
    if (window.document.location.hostname == "localhost") {
        wxuserinfo = {
            "openid":"12345678901234567891",
            "nickname":"张三没有名字",
            "sex":1,
            "language":"zh_CN",
            "city":"Shenzhen",
            "province":"Guangdong",
            "country":"China",
            "headimgurl":"http://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
            "privilege":[]
        }
    } else {
        wxuserinfo = JSON.parse($.cookie('wxuserinfo'));
    }
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