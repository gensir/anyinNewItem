import tpl from './tpl/logs2.html';
var service=require('../../server/service').default;
var logs2 = Backbone.View.extend({
    el: '.contents',
    initialize(){
    },
    render: function(query) {
        this.$el.html(tpl);
        service.Operationlog(1,10).done(res=>{
			var obj;
			if(res.code != 0){
                obj = {}
			}else {
                obj = res.data.list;
			}
			this.$el.html(tpl({data:obj}));
		})
    },
});

module.exports = logs2;