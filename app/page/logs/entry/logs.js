import '../../../../asset/css/style.css';
import '../../../../asset/css/logs.css';
//import '../../../../asset/lib/datetimepicker/bootstrap-datetimepicker.css';
import {add} from '../../../publicFun/public';
import '../../../../asset/lib/jquery-placeholder.js';
require('../store/store.js');
window.reqres.request(  'global', 'current-user' );
var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');
var header=require('../../../view/pub/tpl/uhead.html')
var search=require('../../../view/logs/tpl/search.html')
$('body').prepend(tpl({
}));
$(".contents").prepend(search)
$(".wrapper").prepend(header)
window.S = {};
S.router = new Router();
Backbone.history.start({
    root : ''
});
//console.log("logs")