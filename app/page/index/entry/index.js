import '../../../../asset/css/index.css';
import {add} from '../../../publicFun/Util'
console.log(add())
var service=require('../../../server/service').default;
var Router = require('../Router');
var Util = require('../../../publicFun/Util');
var tpl = require('../../../../asset/tpl/main.html');
require('../store/store.js')
window.reqres.request(  'global', 'current-user' );
$('body').prepend(tpl({
    list: [
        { url: 'home/', name: 'Home' },
        { url: 'stat/', name: 'Stat' }
    ]
}));
window.S = {};
S.router = new Router();
Backbone.history.start({
    root: ''
});
//测试代理;
service.serverTest().done(function (data) {
    console.log(data); 
    console.log("测试代理成功")
})
console.log("index")
