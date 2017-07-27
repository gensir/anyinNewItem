import '../../../../asset/css/style.css';
import {add} from '../../../publicFun/public';
var service = require('../../../server/service').default;
require('../store/store.js');
window.reqres.request(  'global', 'current-admin' );

var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');
var header=require('../../../view/pub/tpl/uhead.html')
$('body').prepend(tpl({

}));
$(".wrapper").prepend(header)
require('../../../view/pub/uhead')
window.S = {};

S.router = new Router();

Backbone.history.start({
    root : ''
});
var order = localStorage.orderNo;
service.status(order).done(function(data){
	if(data.code==0){
		if(window.location.hash!=""){
			window.open("admin.html#step"+data.data.operateStep, '_self')
		}
//		window.open("admin.html#step"+data.data.operateStep, '_self')
	}
})
