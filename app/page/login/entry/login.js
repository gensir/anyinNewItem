import '../../../../asset/css/login.css';
import {add} from '../../../publicFun/public'
import {imgModalBig} from '../../../publicFun/public'
//import verify from '../../../publicFun/validate'
var service=require('../../../server/service').default;
var Router = require('../Router');
var Util = require('../../../publicFun/public');
// require('../store/store.js')
// window.reqres.request(  'global', 'test' );
window.S = {};
S.router = new Router();
Backbone.history.start({
    root: ''
});
