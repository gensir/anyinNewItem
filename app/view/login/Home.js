require('../../../asset/css/home.scss');
// var tpl=require('./tpl/index.html');
// import tpl from './tpl/index.html'
// import dialog from './tpl/dialog.html'
import moment from 'moment'
var tpl= require('./tpl/index.html')
var dialog= require('./tpl/dialog.html')
// var tpl= require('moment')
var Home = Backbone.View.extend({
    el: '.container',
    events:{
        'click .showModal':'showModal'
    },
    initialize(){
        // console.log("es6")
        this.initData();
    },
    initData(){
       // var time= moment(new Date).format('YYYY-MM-DD HH:MM:SS')
       //  this.$el.html(tpl({
       //      time:time
       //  }));
    },
    render: function() {
        // this.$el.html(tpl);
        var time= moment(new Date).format('YYYY-MM-DD HH:MM:SS')
        this.$el.html(tpl({
            time:time
        }));
        if($(".showModal").length>0){
            $(".showModal").html("mounted btns")
        }
    },
    showModal(){
        bootbox.dialog({
            message:dialog({text:"hello world"}),
            onEscape:true,
            className:"homeDialog" //指定一个class,可用$(".homeDialog").modal("hide")关闭
        })
    }
});
console.log((new Home()).events,123)
module.exports = Home;
