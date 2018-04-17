; const domain = "";
const basemp = "/mp/";
var commonAjaxSetting = {
    'get': {
        dataType: "json",
        cache: false
    },
    'post': {
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        },
        data: {},
        cache: false
    },
    'POST': {
        dataType: "json",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {},
        cache: false
    },
    'delete': {
        dataType: "json",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {},
        cache: false
    },
    'put': {
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        },
        data: {},
        cache: false
    }
};

var autoAjaxCall = function (setting, type) {
    if (type === undefined) {
        type = 'get';
    }
    var sendData = commonAjaxSetting[type];
    sendData.type = type;
    if (sendData.headers && sendData.headers['Content-Type'] == "application/json") {
        setting.data = JSON.stringify(setting.data);
    }
    sendData = $.extend({}, sendData, setting);
    return $.ajax(sendData);
};

function getSubPath() {
    var subpath = location.pathname.split("/")[1]
    if (subpath.length > 0 && subpath.indexOf('.') === -1) {
        subpath = "/" + subpath;
    } else {
        subpath = 'mobile';
    }
    return subpath;
}

var ajaxreq = {
    successCheckCode(data) {
        if (data.code != 0) {
            weui.alert(data.msg || "网络异常,请稍候重试.", { title: '提示' });
            return false;
        }
        return true;
    },
    ajaxCall(setting, type) {
        var xhr = autoAjaxCall(setting, type);
        xhr.fail(() => {
            weui.alert("接口请求失败！", { title: '提示' });
        });
        return xhr;
    },
    //发送短信
    SMSVerifCode(data) {
        return this.ajaxCall({ url: domain + basemp + "common/getSMSVerifCode", data: data });
    },
    //验证码验证
    checkSmsCode(data) {
        return this.ajaxCall({ url: domain + basemp + "common/checkSmsCode", data: data });
    },
    //自动登录
    WechatUser(data) {
        return this.ajaxCall({ url: domain + basemp + "sysUser/getSysUserAndWechatUser", data: data, async: false });
    },
    //账号绑定
    bindAccount(data) {
        return this.ajaxCall({ url: domain + basemp + "sysUser/bindAccount", data: data }, "post");
    },
    //解除账号绑定
    unbingAccount(data) {
        return this.ajaxCall({ url: domain + basemp + "sysUser/removeBind", data: data }, "post");
    },
    wxthird1(data) {
        return this.ajaxCall({ url: domain + "/sns/oauth2/access_token", data: data, async: false });
    },
    wxthird2(data) {
        return this.ajaxCall({ url: domain + "/sns/oauth2/refresh_token", data: data, async: false });
    },
    wxthird3(data) {
        return this.ajaxCall({ url: domain + "/sns/userinfo", data: data, async: false });
    },
};