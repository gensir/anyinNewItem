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
        this.$el.append(tpl);
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
        var numInd=1;
                bootbox.dialog({
                    numInd:0,
            closeButton: false,
            className: "realName",
            title: "<div class='title'>预挂失电子印章提示</div>",
            message: "<div class='message'>您选择预挂失“电子印章样品专用章（01）”</br>该电子印章相关功能将暂停使用</div>",
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

                    callback: function (result) {
                        numInd=numInd++
                        $(this).find(".message").html(123);
                        if(numInd ==1){
                            
                        }else if(numInd==2){

                        }else{
                            return false;
                        }
                            
                        

                    }
                }
            }
        })
        return false;
    }
});

module.exports = step1;