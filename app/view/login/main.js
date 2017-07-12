var tpl = require('./tpl/main.html');
var service = require('../../server/service').default;
var main = Backbone.View.extend({
    el: "body",
    initialize() {
        this.availableUkey = false;
        this.ukey();
        this.render();
    },
    events: {
        'click #phoneLogin': 'phoneLogin',
        'click #ukeyLogin': 'ukeyLogin',
        'click .goregister': 'goregister',
        'change #seleBook': 'seleBook'
    },
    seleBook() {
        //$("#seleBook option").eq(0).attr("disabled","disabled")
    },
    render(obj) {
        var _this = this;
        this.$el.prepend(tpl({
            list: _this.ukeyName
        }));
        this.toggleTab();
    },
    ukey() {
        var data=JSON.stringify({
            a:1
        })
        service.userlogin(data).done(function (data) {
            console.log(data);
            console.log("测试代理成功sss");
        })
        // 这里就是注册表中CLSID文件夹根目录的文件夹名称
        window.ukey = null;
        var _this = this;
        try {
            window.ukey = new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
            //alert(util);
        } catch (e) {
            _this.availableUkey = true;
            //alert("****" + e.message);
        }
        if (!window.ukey) {
            return false;
        }
        var nCount = window.ukey.GetCertCount();

        this.ukeyName = [];
        for (var i = 0; i < nCount; i++) {
            window.ukey.SetCertIndex(i);//获取第几个ukey
            this.ukeyName.push(window.ukey.GetCertInfo(0));
            // alert("第" + (i + 1) + "个证书信息如下：\n" +
            //     //"获取签名证书：\n"+ ukey.GetCertData(0) +
            //     //"获取加密证书：\n"+ ukey.GetCertData(1) +
            //     "获取证书名称：" + window.ukey.GetCertInfo(0) + "\n" +
            //     "获取证书OID： " + window.ukey.GetCertInfo(1) + "\n" +
            //     "获取证书类型:" + (window.ukey.GetCertInfo(2) == "0" ? "创业KEY" : "ODC-KEY") + "\n" +
            //     "获取印章编码：" + window.ukey.GetCertInfo(3)
            // );

        }
    },
    toggleTab() {
        $(".head div.but").on("click", "span", function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(".mainbody ul li").eq($(this).index()).addClass("active").siblings().removeClass("active");
        })
    },
    goregister() {
        window.open('register.html#step1', '_self')
    },
    ukeyLogin(event) {
        if (this.availableUkey) {
            bootbox.alert({
                size: "small",
                title: "提示",
                message: "请在IE浏览器下使用ukey",
                callback: function () { /* your callback code */ }
            })
            return;
        }
        this.model.set({ "clickEle": $(event.target).data('id') })
        var isValid = this.model.isValid();
        if (isValid) {
            return;
        }
        // 验证KEY密码
        var checkResult = null;
        var getPwd = $("#pinwd").val();
        if (getPwd) {
            window.ukey.SetCertIndex($("#seleBook option:selected").index() - 1);
            checkResult = window.ukey.SetCertPin(getPwd);
        }
        // alert(checkResult);
        if (checkResult) {
            bootbox.alert("PIN码正确,发送登录请求！");
        } else {
            bootbox.alert("请检测证书或PIN码是否正确！");
        }
    },
    phoneLogin(event) {
        // this.model.set({ 'pinwdError': this.$el.find("#pinwd").val(), validate: true });
        this.model.set({ "clickEle": $(event.target).data('id') })
        var isValid = this.model.isValid();
        // bootbox.dialog({
        //     closeButton: false,
        //     className: "realName",
        //     title: "<div class='title'>未实名提示</div>",
        //     message: "<div class='message'>您尚未创建企业账号</br>以下将引导您创建企业账号，并与当前UKEY绑定</div>",
        //     buttons: {
        //         cancel: {
        //             label: "返回",
        //             className: "btn1"
        //         },
        //         confirm: {
        //             label: "继续",
        //             className: "btn2",

        //             callback: function () {
        //                 $(this).find(".message").html(123);
        //                 console.log($(this).find(".message").html())
        //                 if (i = 5) {
        //                     return false;
        //                 }

        //             }
        //         }
        //     }
        // })
    }
})
module.exports = main;