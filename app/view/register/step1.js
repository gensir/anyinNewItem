/**
 * Created by Administrator on 2017/6/20 0020.
 */
import tpl from './tpl/step1.html'

var People=Backbone.Model.extend({
    idcode:null,//信用代码
    yzmcode:null//验证码
    });

var Peoples=Backbone.Collection.extend({
    initialize:function(models,options){
        this.bind("add",options.view.addOnePerson);
    }
});

var step1 = Backbone.View.extend({
    el: '.container',

    initialize:function(){

        this.peoples=new Peoples(null,{view:this})
    },

    events:{
        "click #xieyi":"regsava",
        "click #reguser":"reguser",
    },
    
    regsava:function(){
        if($('#xieyi').is(':checked')) {
            $('#reguser').prop("disabled", false);
        } else {
            $('#reguser').prop("disabled", true);
        }
    },

    reguser:function(){
        var idcode= $("#idcode").val();
        var yzmcode= $("#yzmcode").val();

        if(idcode.length < 15) {
            $('#idcode-error').html('请输入18位社会信用代码').show();
            $("#idcode").focus();
            return false;
        };
        if(yzmcode.length < 4) {
            $('#yzmcode-error').html('请输入4位验证码').show();
            $("#yzmcode").focus();
            return false;
        }

        var person=new People({idcode:idcode,yzmcode:yzmcode});
        this.peoples.add(person); 
        
    },

    addOnePerson:function(model){
        console.log ( model.get('idcode') + model.get('yzmcode') )
        
    },

    render: function (query) {
        this.$el.html(tpl);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
});

module.exports = step1;