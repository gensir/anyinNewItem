import '../../../../asset/css/register.css';
import '../../../../asset/css/style.css';
import {add} from '../../../publicFun/public';
import '../../../../asset/lib/jquery-placeholder.js';
// require('../store/store.js');
//require('../store/model.js');
// window.reqres.request(  'global', 'current-user' );
//console.log(add())

var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');

$('body').prepend(tpl({
    list: [
        {url: '', name: 'Home'},
        {url: 'stat/', name: 'Stat'},
        {url: 'login', name: 'login'},
        {url: 'step1', name: 'register'}
    ]
}));

window.S = {};

S.router = new Router();

Backbone.history.start({
    root : ''
});
//console.log("register")
