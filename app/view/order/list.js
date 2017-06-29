import tpl from './tpl/list.html'
var list = Backbone.View.extend({
    el: '.wrapper',
    initialize() {
        this.render();
        this.lossBox();
    },
    events: {
        'click .eseallist .list>.nav': 'toggleList',
        'click .eseallist .list>.nav .loss': 'loss' ,
        'click .eseallist .list>.nav .unfreeze': 'unfreeze' 
    },
    render: function (query) {
        this.$el.prepend(tpl);
    },
    lossBox(){
        $.extend({
            lossBox:function(callback,topic,msg){
                topic=topic||"<div class='title'>预挂失电子印章提示</div>",
                msg=msg|| "<div class='megLoss1'>您选择预挂失“电子印章样品专用章（01）”</br>该电子印章相关功能将暂停使用</div>"
                var lossAlert=bootbox.dialog({
                    backdrop:true,
            //closeButton: false,
            className: "realName",
            title:topic ,
            message:msg,
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
                    callback:callback
                }
            }
        })
            }
        })
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
        var numInd=this.model.get("numInd")
        $.lossBox( function (event) {
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
                    })
                    return false;
    },
    unfreeze(){
         var numInd=this.model.get("numInd");
        $.lossBox( function (event) {
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
        },"<div class='title'>解冻电子印章提示</div>",)
        return false;
    }
});

module.exports = list;