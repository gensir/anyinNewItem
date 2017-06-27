require('../../../asset/css/home.scss');
// var tpl=require('./tpl/index.html');
// import tpl from './tpl/index.html'
// import dialog from './tpl/dialog.html'
import moment from 'moment'
var tpl = require('./tpl/index.html')
var dialog = require('./tpl/dialog.html')
// var tpl= require('moment')
var Home = Backbone.View.extend({
    el: '.container',
    events: {
        'click .showModal': 'showModal'
    },
    initialize() {
        // console.log("es6")
        this.initData();
    },
    initData() {
        // var time= moment(new Date).format('YYYY-MM-DD HH:MM:SS')
        //  this.$el.html(tpl({
        //      time:time
        //  }));
    },
    render: function () {
        // this.$el.html(tpl);
        var time = moment(new Date).format('YYYY-MM-DD HH:MM:SS')
        this.$el.html(tpl({
            time: time
        }));
        if ($(".showModal").length > 0) {
            $(".showModal").html("mounted btn")
        }
    },

    showModal() {
        // bootbox.dialog({
        //     message: dialog({ text: "hello world" }),
        //     onEscape: true,
        //     className: "homeDialog" //指定一个class,可用$(".homeDialog").modal("hide")关闭
        // })



        bootbox.confirm({
            message: "This is a confirm with custom button text and color! Do you like it?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
            }
        });
    }
});

module.exports = Home;
