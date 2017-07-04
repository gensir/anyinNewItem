var Router = Backbone.Router.extend({
    routes: {
        '': 'list',
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
    list: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/orders/list')
            me.startRout(View, { query: query });
        }, 'list');
    },
});

module.exports = Router;
