var service = require('../../server/service').default;
var stepNum;
var Router = Backbone.Router.extend({
    routes: {
        '': 'list',
        'home': 'home',
        'stat/': 'stat',
        'stat/:query': 'substat',
        'step1': 'step1',
        'step2': 'step2',
        'step3': 'step3',
        'step4': 'step4',
        'pay_ok': 'pay_ok',
        'update_key': 'update_key',
        'renew': 'renew'
    },
    initialize: function () {
        S.main = null;
    },
    viewUnmount: function () {
        this.undelegateEvents();
        this.$el.empty();
    },
    startRout: function (View, queryObj, sub,model) {
    	this.hashChange();
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
    home: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/home/Home')
            me.startRout(View, { query: query });
        }, 'Home');
    },
    renew: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/renew')
            //new View({ model: model })
            me.startRout(View, { query: query });
        }, 'renew');
    },
    list: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/list')
            var model = require('./store/model')
            //new View({ model: model })
            me.startRout(View, { query: query });
        }, 'list');
    },
    stat: function (query) {
        console.log(query)
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
	isview:false,
    step1: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/step1')
            me.startRout(View, { query: query });
        }, 'step1')
    },
    step2: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/step2')
            me.startRout(View, { query: query });
        }, 'step2')
    },
    step3: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/step3')
            me.startRout(View, { query: query });
        }, 'step3')
    },
    step4: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/step4')
            me.startRout(View, { query: query });
        }, 'step4')
    },
    pay_ok: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/pay_ok')
            me.startRout(View, { query: query });
        }, 'payo_k')
    },
    update_key: function (query) {
        var me = this;
        require.ensure([], function (require) {
            var View = require('../../view/admin/update_key')
            me.startRout(View, { query: query });
        }, 'update_key')
    }, 
    hashChange:function(){
    	var order=localStorage.orderNo;
    	stepNum = localStorage.stepNum;
    	if(window.location.hash!=""){
    		if(order){
    			if(stepNum!=window.location.hash){
    				service.status(order).done(function(data){
						if(data.code==0){
							localStorage.stepNum="#step"+data.data.operateStep;
							window.open("admin.html#step"+data.data.operateStep, '_self')
						}
					})
    			}	
		    }else{
	    		window.open("admin.html#step1", '_self')
	    	} 
    	}
    }
});

module.exports = Router;
