import tpl from './tpl/list.html'
var step1 = Backbone.View.extend({
    el: '.wrapper',
    initialize() {
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .eseallist .list>.nav .loss': 'loss' 
    },
    render: function (query) {
        this.$el.prepend(tpl);
    },
    toggleList(event) {
        var _this=event.currentTarget
        var ind = $(_this).parent(".list").index();
        $(".eseallist .list .toggle").slideUp();
        var toggle = $(_this).parent(".list").find(".toggle");
        if (toggle.is(":hidden")) {
            toggle.slideDown();
        } else {
            toggle.slideUp();
        }
    },
    loss(){
        // bootbox.setLocale("zh_CN");  
        // bootbox.alert("ok")
        // bootbox.addLocale({
        //      OK : '确定',
        // })
        // bootbox.alert("123")
        var numInd=0;
                var lossAlert=bootbox.dialog({
                    backdrop:true,
            //closeButton: false,
            className: "realName",
            title: "<div class='title'>预挂失电子印章提示</div>",
            message: "<div class='megLoss1'>您选择预挂失“电子印章样品专用章（01）”</br>该电子印章相关功能将暂停使用</div>",
            buttons: {
                cancel: {
                    label: "返回",
                    className: "btn1",
                    callback:function(result){
                        console.log(result,"cancel")
                        result.cancelable=false;
                    }
                },
                confirm: {
                    label: "继续",
                    className: "btn2",
                    callback: function (event) {
                        numInd++;                       
                        if(numInd ==1){
                            var msg2='<div class="megLoss2"><div class="input-group">'+
                            '<input type="text" class="form-control" placeholder="请输入验证码" aria-describedby="basic-addon1">'+
                            '<span class="input-group-addon" id="basic-addon1">重新发送</span></div>'+
                            '<p>验证码已通过短信发送到登录帐号上，5分钟内有效</p>'
                            '</div>'
                            //var html='<div><input id="userName" type="text" placeholder="请输入验证码"><label>重新发送</label></div>'+
                            
                            $(this).find(".bootbox-body").html(msg2);
                        }else if(numInd==2){
                            var msg3="<div class='megLoss3'>已成功预挂失“电子印章样品专用章（01）”，请在7个工作日内携带法人身份证、营业执照（副本）前往门店完成挂失操作。</div>"
                            $(this).find(".modal-footer .btn2").hide();
                            $(this).find(".bootbox-body").html(msg3);
                        }else{
                            this.modal('hide');
                        }
                        return false;
                    }
                }
            }
        })
        
        lossAlert.init(function(){
    // Do something with the dialog...
});
        return false;
    }
});

module.exports = step1;