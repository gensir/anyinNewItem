//域名键值对调用
; function GetQueryString(name, elseUrl) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (elseUrl !== undefined) {
        var s = elseUrl.split("?")[1].match(reg);
        if (s != null) return decodeURIComponent(s[2]);
        return null;
    }
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
};
if (/wxtest/.test(location.host)) {//test
    var configFile = {
        appid: 'wxe57d71ceca5b3aa9',//信卓企业服务平台
        secret: '7dfbb78a433398f3d599dfe54da15a64',
        bindRegister: window.location.pathname,
        wxdomain: "http://wxtest.yinzhangcloud.com"
    };
} else if (/i-yin.net/.test(location.host)) {//pro
    var configFile = {
        appid: 'wx454800986353aea2',//安印科技正式号
        secret: 'f2bcb609772fc6c9a32af3969ae7555c',
        bindRegister: window.location.pathname,
        wxdomain: "https://yun.i-yin.net"
    };
} else {//开发
    var configFile = {
        appid: 'wx7c73badafceb0c07',//知印公众号
        secret: 'c41e67dd951d7ec76302cacec261309a',
        bindRegister: window.location.pathname,
        wxdomain: "http://wxpm.yinzhangcloud.com"
    };
};

var wxdomain = configFile.wxdomain;
var bindRegister = configFile.bindRegister;
window.defer = new $.Deferred();
var wxthird = {
    data: function () {
        this.appid = configFile.appid;
        this.secret = configFile.secret;
        this.wxthird1 = {
            appid: this.appid,
            secret: this.secret,
            code: GetQueryString('code'),
            grant_type: 'authorization_code'
        };
        this.wxthird2 = {
            appid: this.appid,
            grant_type: 'refresh_token',
            refresh_token: ""
        }
        this.wxthird3 = {
            access_token: "",
            openid: "",
            lang: "zh_CN"
        }
    },
    init: function () {
        var _this = this;
        this.data();
        if (!$.cookie('authorize') || (!$.cookie('wxuserinfo') && !GetQueryString('code'))) {
            $.cookie('authorize', true, { path: "/" }, { expires: 30 })
            window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.appid + "&redirect_uri=" + encodeURIComponent(wxdomain + bindRegister) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect", '_self')
        }
        if (!$.cookie('wxuserinfo')) {
            ajaxreq.wxthird1(this.wxthird1).done(function (res) {
                _this.wxthird2.refresh_token = res.refresh_token;
                ajaxreq.wxthird2(_this.wxthird2).done(function (res) {
                    _this.wxthird3.access_token = res.access_token;
                    _this.wxthird3.openid = res.openid;
                    ajaxreq.wxthird3(_this.wxthird3).done(function (res) {
                        wxthird.openid = res.openid;
                        if (!res.errcode && !res.errmsg) {
                            $.cookie('wxuserinfo', JSON.stringify(res), { path: "/" });
                        }
                        defer.resolve();
                    })
                })
            })
        }
    }
};
if (new RegExp(location.host).test(wxdomain)) {
    wxthird.init();
};
if (window.document.location.hostname == "localhost") {
    var wxuserinfo = {
        "openid": "o9dQ6wvdXHzT9Wta6kLBNMI4sA_w",
        // "openid": "o9dQ6wrtrOVVFFbRiSKPrPdOo_VU",
        "nickname": "张三没有名字",
        "sex": 1,
        "language": "zh_CN",
        "city": "Shenzhen",
        "province": "Guangdong",
        "country": "China",
        "headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/Qic5GhQ3lBGcAIMBibxefz5obtibIqmVDiaFbsnH0r9ua09rpK0wdrKGqYiaCNqOSk5eCyB0ibTzD4o7abfpomBWS5rg/132",
        "privilege": []
    }
} else {
    var wxuserinfo = JSON.parse($.cookie('wxuserinfo'));
};

function GetLoginUser() {
    var data = {
        "openid": wxuserinfo.openid
    };
    ajaxreq.WechatAutoLogin(data).done(function (res) {
        if (res.code == 0 && res.data != null) {
            $.cookie('loginuser', JSON.stringify(res.data), { path: "/" });
        } else {
            $.removeCookie('loginuser', { path: "/" });
            if (!/login.html/.test(location.pathname)) {
                weui.alert("您还未绑定账号！", function () {
                    window.location.href = 'login.html';
                }, { title: '提示' });
            }
        }
    })
};
//不验证绑定的请增加html页面
if (!/index.html/.test(location.pathname)) {
    $(function () {
        GetLoginUser();
    })
};