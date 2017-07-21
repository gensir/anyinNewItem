var Router = Backbone.Router.extend({
    routes: {
        '': 'logs',
        'operateLog': 'operateLog',
    },
    initialize: function() {
        S.main = null;
    },
    viewUnmount:function(){
        this.undelegateEvents();
        this.$el.empty();
    },
    startRout: function (View, queryObj, sub,model) {
        S.main && S.main.viewUnmount && S.main.viewUnmount();
        var model = require('./store/model.js');
        S.main = new View({model:model});
        S.main.viewUnmount = this.viewUnmount;
        S.main.sub = null
        if (sub) {
            S.main.sub = sub;
        }
        S.main.render(typeof queryObj == 'undefined' ? '' : queryObj);
    },
    starSubroute: function (View, queryObj) {
        S.main.sub && S.main.sub.viewUnmount && S.main.sub.viewUnmount();
        S.main.sub = new View();
        S.main.sub.viewUnmount = this.viewUnmount;
        S.main.sub.render(typeof queryObj == 'undefined' ? '' : queryObj);
    },
    logs: function(query) {
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/logs/logs')
            var model = require('./store/model')
            me.startRout(View, {query:query});
        }, 'logs');
    },
     operateLog: function(query) {
        var me = this;
        require.ensure([], function(require) {
            var View = require('../../view/logs/logs2')
            var model = require('./store/model')
            me.startRout(View, {query:query});
        }, 'operateLog');
    },

});

module.exports = Router;
