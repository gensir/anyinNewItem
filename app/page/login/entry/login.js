import '../../../../asset/css/index.css';
require('../../../../asset/lib/jquery-placeholder');
import {add} from '../../../publicFun/public'
import {imgModalBig} from '../../../publicFun/public'
//import verify from '../../../publicFun/validate'
var service=require('../../../server/service').default;
var Router = require('../Router');
var Util = require('../../../publicFun/public');
require('../store/store.js')
window.reqres.request(  'global', 'current-user' );
window.S = {};
S.router = new Router();
Backbone.history.start({
    root: ''
});
//测试代理;
console.log(service)
service.serverTest().done(function (data) {
    console.log(data); 
    console.log("测试代理成功");
})