import tpl from './tpl/logs2.html';
var service=require('../../server/service').default;
var logs2 = Backbone.View.extend({
    el: '.contents',
    initialize(){
    },
    //获取数据
    serverdata() {
        var _this=this;
        service.Operationlog(1,5).done(function(res) {
            var obj;
            if(res.code != 0){
                obj = {}
            }else {
                obj = res.data.list;
            }
            _this.$el.html(tpl({data:obj}));
        });
    },     
    render: function(query) {
        //this.$el.html(tpl);
        this.serverdata()
        
    },
});

module.exports = logs2;