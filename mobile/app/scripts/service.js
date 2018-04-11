;
const domain = "";
const baseUrl = "/api/";
const basedev = "/uiapi/";
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

var autoAjaxCall = function(setting, type) {
    if (type === undefined) {
        type = 'get';
    }
    var sendData = commonAjaxSetting[type];
    sendData.type = type;
    if (sendData.headers && sendData.headers['Content-Type'] == "application/json") {
        setting.data = JSON.stringify(setting.data);
    }
    sendData = $.extend({}, sendData, setting);
    //console.log(JSON.stringify(sendData))
    return $.ajax(sendData);
};

function getSubPath() {
    var subpath = location.pathname.split("/")[1]
    if (subpath.length > 0 && subpath.indexOf('.') === -1) {
        subpath = "/" + subpath;
    } else {
        subpath = 'yzpm';
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
    sendvercode(data) {
        return this.ajaxCall({ url: domain + "/user?method=sendvercode", data: data }, "POST");
    },
    //验证码检验
    sms_code(data) {
        return this.ajaxCall({ url: domain + "/user?method=valid_sms_code", data: data }, "POST");
    },
    //检查用户是否存在
    check_user(data) {
        return this.ajaxCall({ url: domain + "/user?method=check", data: data }, "POST");
    },
    //用户注册
    register_member(data) {
        return this.ajaxCall({ url: domain + basedev + "party/user/wx?method=mob_register_member", data: data }, "POST");
    },
    //解除账号绑定
    sms_unbing_wxcode(data) {
        return this.ajaxCall({ url: domain + basedev + "party/user/wx?method=sms_unbing_wxcode", data: data }, "POST");
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
    //微信用户授权回调
    user_auth_callback(data) {
        return this.ajaxCall({ url: domain + basedev + "party/user/wx?method=user_auth_callback ", data: data, async: false }, 'POST');
    },
};