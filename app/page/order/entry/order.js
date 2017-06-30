import '../../../../asset/css/style.css';
import {add} from '../../../publicFun/public';
require('../store/store.js');
window.reqres.request(  'global', 'current-user' );
console.log(add())

var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');

$('body').prepend(tpl({

}));

window.S = {};

S.router = new Router();

Backbone.history.start({
    root : ''
});
console.log("order")
