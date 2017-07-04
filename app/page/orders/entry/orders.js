import '../../../../asset/css/style.css';
require('../store/store.js');
window.reqres.request(  'global', 'current-user' );

var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');
var header=require('../../../view/pub/tpl/uhead.html')

$('body').prepend(tpl({  
}));
$(".wrapper").prepend(header)
window.S = {};

S.router = new Router();

Backbone.history.start({
    root : ''
});
