import '../../../../asset/css/style.css';
import {add} from '../../../publicFun/public';
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