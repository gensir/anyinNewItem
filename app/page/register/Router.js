var Router = Backbone.Router.extend({
    routes: {
        '': 'step1',
        'stat/': 'stat',
        'stat/:query': 'substat',
        'step1':'step1',
        'step2':'step2',
        'step3':'step3',
        'step4':'step4',
    },
    initialize: function() {
        S.main = null;
    },
    viewUnmount:function(){
        this.undelegateEvents();
        this.$el.empty();
    },
    startRout: function(View, queryObj, sub) {
        S.main && S.main.viewUnmount && S.main.viewUnmount();
        S.main = new View();
        S.main.viewUnmount=this.viewUnmount;
        S.main.sub=null
        if(sub){
            S.main.sub=sub;
        }
        S.main.render(typeof queryObj == 'undefined' ? '' : queryObj);
    },
    starSubroute:function(View,queryObj){
        S.main.sub && S.main.sub.viewUnmount && S.main.sub.viewUnmount();
        S.main.sub = new View();
        S.main.sub.viewUnmount = this.viewUnmount;
        S.main.sub.render(typeof queryObj == 'undefined' ? '' : queryObj);
    },
    home: function(query) {
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/home/Home')
            me.startRout(View, {query:query});
        }, 'Home');
    },
    stat: function(query) {
        //console.log(query)
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/stat/Stat')
            me.startRout(View, {query:query},"substat");
        }, 'Stat');
    },
    substat: function(query) {
        var me = this;
        if(!S.main||!S.main.sub=="substat"){
            me.stat();
        }
        require.ensure([], function(require) {
            var View = require('../../view/stat/substat')
            me.starSubroute(View, {
                query:query
            });
        }, 'Stat');
    },
    
    step1:function(query){
        var model = require('./store/model.js');
        var me=this;
        require.ensure([],function(require){
            var View=require('../../view/register/step1')
            new View({model:model});
        },'step1')
    },
    step2:function(query){
      	var model = require('./store/model.js');
        var me=this;
        require.ensure([],function(require){
            var View=require('../../view/register/step2')
            new View({model:model});
        },'step2')
    },
    step3:function(query){
        var me=this;
        require.ensure([],function(require){
            var View=require('../../view/register/step3')
            me.startRout(View,{query:query});
        },'step3')
    },
    step4:function(query){
        var me=this;
        require.ensure([],function(require){
            var View=require('../../view/register/step4')
            me.startRout(View,{query:query});
        },'step4')
    },
});

module.exports = Router;
