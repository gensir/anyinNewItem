import '../../asset/css/register.css';

var Router = require('../router/Router');
var Util = require('../lib/Util');
var tpl = require('../../asset/tpl/main.html');

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
