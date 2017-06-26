import '../../../../asset/css/index.css';
import {add} from '../../../publicFun/public'
console.log(add())
var service=require('../../../server/service').default;
var Router = require('../Router');
var Util = require('../../../publicFun/public');
var tpl = require('../../../../asset/tpl/main.html');
require('../store/store.js')
reqres.request(  'global', 'current-user' );
$('body').prepend(tpl({
    list: [
        { url: 'homess/', name: 'Homes' },
        { url: 'stat/', name: 'Statsssss' }
    ]
}));
window.S = {};
S.router = new Router();
Backbone.history.start({
    root: ''
});
//测试代理;
// service.serverTest().done(function (data) {
//     console.log(data); 
//     console.log("测试代理成功122")
// })
// console.log("index")
