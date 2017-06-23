var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        'stat/': 'stat',
        'stat/:query': 'substat',
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
            var View = require('../view/home/Home')
            me.startRout(View, {query:query});
        }, 'Home');
    },
    stat: function(query) {
        console.log(query)
        var me = this;
        require.ensure([], function(require) {
            var View = require('../view/stat/Stat')
            me.startRout(View, {query:query},"substat");
        }, 'Stat');
    },
    substat: function(query) {
        var me = this;
        if(!S.main||!S.main.sub=="substat"){
            me.stat();
        }
        require.ensure([], function(require) {
            var View = require('../view/stat/substat')
            me.starSubroute(View, {
                query:query
            });
        }, 'Stat');
    }
});

module.exports = Router;
