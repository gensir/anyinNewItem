var regStep, hash;
var Router = Backbone.Router.extend({
    routes: {
        '': 'step1',
        'stat/': 'stat',
        'stat/:query': 'substat',
        'step1': 'step1',
        'step2': 'step2',
        'step3': 'step3',
        'step4': 'step4',
    },
    initialize: function () {
        S.main = null;
    },
    viewUnmount: function () {
        this.undelegateEvents();
        this.$el.empty();
    },
    startRout: function (View, queryObj, sub) {
        console.log(location.hash)
        this.hashChange();
        if (location.hash) {
            var View = require('../../view/register/'+location.hash.substr(1))
        }
        S.main && S.main.viewUnmount && S.main.viewUnmount();
        var model = require('./store/model.js');
        S.main = new View({ model: model });
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
    home: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/home/Home')
            me.startRout(View, { query: query });
        }, 'Home');
    },
    stat: function (query) {
        //console.log(query)
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/stat/Stat')
            me.startRout(View, { query: query }, "substat");
        }, 'Stat');
    },
    substat: function (query) {
        var me = this;
        if (!S.main || !S.main.sub == "substat") {
            me.stat();
        }
        require.ensure([], function (require) {
            var View = require('../../view/stat/substat')
            me.starSubroute(View, {
                query: query
            });
        }, 'Stat');
    },

    step1: function (query) {
        var model = require('./store/model.js');
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/register/step1')
            me.startRout(View, { query: query });
            //new View({model:model});
        }, 'step1')
    },
    step2: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/register/step2')
            me.startRout(View, { query: query });
        }, 'step2')
    },
    step3: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/register/step3')
            me.startRout(View, { query: query });
        }, 'step3')
    },
    step4: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/register/step4')
            me.startRout(View, { query: query });
        }, 'step4')
    },
    hashChange: function () {
        //  	regStep=localStorage.regStep;
        //  	hash = window.location.hash;
        //  	if(hash!=regStep){
        //  		window.open("register.html#step1", '_self')
        //  	}
    }
});

module.exports = Router;
