import '../../../../asset/css/index.css';
import {add} from '../../../publicFun/public'
console.log(add())

var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../../asset/tpl/main.html');

$('body').prepend(tpl({
    list: [
        {url: '', name: 'Home'},
        {url: 'stat/', name: 'Stat'}
    ]
}));

window.S = {};

S.router = new Router();

Backbone.history.start({
    root : ''
});
console.log("register")
