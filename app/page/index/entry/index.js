import '../../../../asset/css/style.css';
import '../../../../asset/css/user.css';
import {add} from '../../../publicFun/public';
require('../store/store.js');
//require('../store/model.js');
window.reqres.request(  'global', 'current-user' );
var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../view/pub/tpl/main.html');

$('body').prepend(tpl({
    list: [
        {url: '', name: 'index'},
    ]
}));

window.S = {};
S.router = new Router();
Backbone.history.start({
    root : ''
});