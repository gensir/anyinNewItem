var tpl = require('./tpl/main.html');
var service = require('../../server/service').default;
import ukeys from '../../publicFun/ukeys';
var main = Backbone.View.extend({
    el: "body",
    initialize() {
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
            list: ukeys.ukeyName()
        }));
        this.toggleTab();
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
        this.model.set({ "clickEle": $(event.target).data('id') })
        var isValid = this.model.isValid();
        if (isValid) {
            return;
        }
        var selectedUkey=$("#seleBook option:selected").index() - 1
        var checkResult = ukeys.PIN($("#pinwd").val(), selectedUkey)
        if (checkResult) {
            var data = {
                "loginType": 2,
                "esealCode": ukeys.esealCode($("#pinwd").val(), selectedUkey),
                "codeError": 0,
                "entryptCert": ukeys.dCertificate(selectedUkey),
                "signature": ukeys.dSignature(selectedUkey,ukeys.esealCode($("#pinwd").val(),selectedUkey)),
                "randomNum": ukeys.randomNum(ukeys.esealCode($("#pinwd").val(),selectedUkey))
            }
            //console.log(JSON.stringify(data))
            alert(123)
            service.userlogin(data).done(function (data) {
                if (data.code == 0) {
                    $.verify("passwd", "#passwd");
                } else if (data.code == 4) {
                    $.verify("passwd", "#passwd", "后台返回error");
                }
                //window.open("index.html", "_self")
            })
        } else {
            bootbox.alert("请检测证书或PIN码是否正确！");
        }

    },
    phoneLogin(event) {
        // this.model.set({ 'pinwdError': this.$el.find("#pinwd").val(), validate: true });
        this.model.set({ "clickEle": $(event.target).data('id') })
        var isValid = this.model.isValid();
        if (isValid) {
            return;
        }
        var data = {
            "mobile": $("#userName").val()||"13527761888",
            "password": $("#passwd").val()||"123456",
            "captcha": "jskx",
            "loginType": 1
        }
        service.userlogin(data).done(function (data) {
            if (data.code == 0) {
                debugger;
                //window.open("index.html", "_self");
            } else if (data.code == "001") {
                $.verify("phone","#userName", "用户未注册");
            }
            else if (data.code == "500") {
                $.verify("phone","#userName", "账号不存在");
            }
        })
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