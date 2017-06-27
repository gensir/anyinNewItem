var main = Backbone.View.extend({
    el: ".wrapper",
    initialize() {
        this.toggleTab();
    },
    events: {
        'click #login': 'hint'
    },
    toggleTab() {
        $(".head div.but").on("click", "span", function () {
            $(this).addClass("active").siblings().removeClass("active");
            $(".mainbody ul li").eq($(this).index()).addClass("active").siblings().removeClass("active");
        })
    },
    hint() {
        bootbox.dialog({
            className: "realName",
            title: "<div class='title'>未实名提示</div>",
            message: "<div class='message'>您尚未创建企业账号</br>以下将引导您创建企业账号，并与当前UKEY绑定</div>",
            buttons: {
                cancel: {
                    label: "返回",
                    className:"btn1"
                },
                confirm: {
                    label: "继续",
                    className:"btn2"
                }
            }
        })
    }
})
new main();