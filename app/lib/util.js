define([],function(){
    var loginTips = {
    	ie8: '请使用IE8以上的浏览器',
        ie9: '请使用IE9以上的浏览器',
        install: '请先安装USB KEY控件<a href="/static/plugin/keyPlugin.rar">点击下载</a>',
        originTip: '插入USB KEY',
        passTip: 'USB KEY已插入',
        permission: '此用户不能登录该系统',
        password: '密码错误',
        other: '您有控件没有成功下载到本地，是否要下载所有控件安装？安装后请重新进入本功能进行操作。'
    };

    var checkUsbkeyOnLine = function(){
        var CYSignetPlutoCtrlItem = document.getElementById("CYSignetPlutoCtrl");
        var result = CYSignetPlutoCtrlItem.UsbkeyOnline;
        if (result != 0){
            return false;
        }
        return true;
    };

    var checkUsbkey = function(){
        var CYSignetPlutoCtrlItem = document.getElementById("CYSignetPlutoCtrl");
        if (CYSignetPlutoCtrlItem && CYSignetPlutoCtrlItem.object == null) {
            return {code:1, msg:loginTips.install};//code:1 set value to errInfo
        }else if(checkUsbkeyOnLine()){
            return {code:0, msg:loginTips.passTip};
        }else {
            return {code:2, msg:loginTips.originTip};//code:2 set value to key
        }
    };

    function getBrowserAndVersion(){
        var browser={};
        if (/(chrome\/[0-9]{2})/i.test(navigator.userAgent)) {
            browser.agent = navigator.userAgent.match(/(chrome\/[0-9]{2})/i)[0].split("/")[0];
            browser.version  = parseInt(navigator.userAgent.match(/(chrome\/[0-9]{2})/i)[0].split("/")[1]);
        } else if (/(firefox\/[0-9]{2})/i.test(navigator.userAgent)) {
            browser.agent = navigator.userAgent.match(/(firefox\/[0-9]{2})/i)[0].split("/")[0];
            browser.version  = parseInt(navigator.userAgent.match(/(firefox\/[0-9]{2})/i)[0].split("/")[1]);
        } else if (/(MSIE\ [0-9]{1})/i.test(navigator.userAgent)) {
            browser.agent = navigator.userAgent.match(/(MSIE\ [0-9]{1})/i)[0].split(" ")[0];
            browser.version  = parseInt(navigator.userAgent.match(/(MSIE\ [0-9]{1})/i)[0].split(" ")[1]);
            if(browser.version == 1){//it may be ie10+
                browser.version  = parseInt(navigator.userAgent.match(/(MSIE\ [0-9]{2})/i)[0].split(" ")[1]);
            }
        } else if (/(Opera\/[0-9]{1})/i.test(navigator.userAgent)) {
            browser.agent = navigator.userAgent.match(/(Opera\/[0-9]{1})/i)[0].split("/")[0];
            browser.version  = parseInt(navigator.userAgent.match(/(Opera\/[0-9]{1})/i)[0].split("/")[1]);
        } else if (/(Trident\/[7]{1})/i.test(navigator.userAgent)) {
            browser.agent = "MSIE";
            browser.version  = 11;
        } else {
            browser.agent = false;
            browser.version  = false;
        }
        return browser;
    }

    var browserInfo = getBrowserAndVersion();

    var Util = {
        loginTips: loginTips,
        checkUsbkey: checkUsbkey,
        checkUsbkeyOnLine: checkUsbkeyOnLine,
        browserInfo: browserInfo
    };
    
    return Util
})
