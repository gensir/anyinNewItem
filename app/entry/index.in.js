import '../../asset/css/index.css';
import service from '../server/service'
var Router = require('../router/Router');
var Util = require('../lib/Util');
var tpl = require('../view/index/tpl/main.html');
var footer = require('../view/index/tpl/footer.html');
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
