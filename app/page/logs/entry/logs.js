import '../../../../asset/css/style.css';
import '../../../../asset/lib/datetimepicker/bootstrap-datetimepicker.css';
import {add} from '../../../publicFun/public';
import '../../../../asset/lib/jquery-placeholder.js';
//require('../../../../asset/lib/datetimepicker/bootstrap-datetimepicker.js');
//import '../../../../asset/lib/datetimepicker/locales/bootstrap-datetimepicker.zh-CN.js';
require('../store/store.js');
//require('../store/model.js');
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
//console.log("logs")