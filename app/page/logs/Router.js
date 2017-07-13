var Router = Backbone.Router.extend({
    routes: {
        '': 'logs',
        'logs2': 'logs2',
        //'stat/': 'stat',
        //'stat/:query': 'substat',
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
    logs: function(query) {
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/logs/logs')
            me.startRout(View, {query:query});
        }, 'logs');
    },
     logs2: function(query) {
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/logs/logs2')
            me.startRout(View, {query:query});
        }, 'logs2');
    },

});

module.exports = Router;
