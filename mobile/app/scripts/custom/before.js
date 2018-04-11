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
        changeCenter: [116.4136103013, 39.9110666857],
        myCenter: [116.4136103013, 39.9110666857],
        //geotable_id: 生产175711,175143,
        geotable_id: 175143,
        ak: 'ZgzBAG9vHni8OITesxEGMrOqqTFC5NEX',
        radius: 5000,
        appid: 'wxe57d71ceca5b3aa9',//信卓企业服务平台
        secret: '7dfbb78a433398f3d599dfe54da15a64',
        bindRegister: "/mobile/login.html",
        debug: false,
        http: "http",
        wxdomain: "http://wxtest.yinzhangcloud.com"
    };
} else if (/www.yinzhangcloud/.test(location.host)) {//pro
    var configFile = {
        changeCenter: [116.4136103013, 39.9110666857],
        myCenter: [116.4136103013, 39.9110666857],
        //geotable_id: 生产175711,175143,
        geotable_id: 175711,
        ak: 'ZgzBAG9vHni8OITesxEGMrOqqTFC5NEX',
        radius: 5000,
        appid: 'wx05a0ea6231ed07d0',//印章云正式号
        secret: '13585d3524e7b96a15cfce1203aebb88',
        bindRegister: "/mobile/login.html",
        debug: false,
        http: "https",
        wxdomain: "https://www.yinzhangcloud.com"
    };
} else {//开发
    var configFile = {
        changeCenter: [116.4136103013, 39.9110666857],
        myCenter: [116.4136103013, 39.9110666857],
        //geotable_id: 生产175711,175143,
        geotable_id: 175143,
        ak: 'ZgzBAG9vHni8OITesxEGMrOqqTFC5NEX',
        radius: 5000,
        // appid: 'wx891c6bbfb8197d71',//公众平台测试号
        // secret: '9efd4acc4831b50af62a15e3d767fc54',
        appid: 'wx7c73badafceb0c07',//知印公众号
        secret: 'c41e67dd951d7ec76302cacec261309a',
        bindRegister: "/mobile/login.html",
        debug: false,
        http: "http",
        wxdomain: "http://wxpm.yinzhangcloud.com"
    };
}

var wxdomain = configFile.wxdomain;
document.write('<script src="' + configFile.http + '://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>');
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
            lang: "en"
        }
    },
    init: function () {
        var _this = this;
        this.data();
        //wxthird.weixinFunc.init();
        if (/wxthird.html/.test(location.pathname) && !GetQueryString('code')) {
            if (document.referrer == "" || /wxthird.html/.test(document.referrer) || document.referrer.indexOf("open.weixin.qq.com")!= -1 || document.referrer.indexOf(window.location.hostname) == -1) {
                bindRegister = configFile.bindRegister
            } else {
                bindRegister = '/' + document.referrer.split('/').slice(3).join('/');
            }
            window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.appid + "&redirect_uri=" + encodeURIComponent(wxdomain + bindRegister) + "&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect", '_self')
        }
        if (decodeURIComponent(GetQueryString('type')) == "news") {
            return
        }
        if (!$.cookie('openid') && !!$.cookie('isthird')) {//无openid有isthird
            $.cookie('isthird', false, { path: "/" }, { expires: 30 })
        }
        if ($.cookie('isthird') || (!!GetQueryString('code') && /login.html/.test(location.pathname))) {//无isthird无openid
            if (!$.cookie('openid')) {
                ajaxreq.wxthird1(this.wxthird1).done(function (res) {
                    _this.wxthird2.refresh_token = res.refresh_token;
                    ajaxreq.wxthird2(_this.wxthird2).done(function (res) {
                        _this.wxthird3.access_token = res.access_token;
                        _this.wxthird3.openid = res.openid;
                        ajaxreq.wxthird3(_this.wxthird3).done(function (res) {
                            wxthird.openid = res.openid
                            $.cookie('openid', res.openid, { path: "/" }, { expires: 30 });
                            defer.resolve();
                            // ajaxreq.user_auth_callback({ wxcode: res.openid }).done(function (res) {
                            //     console.log(res)
                            // })
                        })
                    })
                })
            }

        } else {
            window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.appid + "&redirect_uri=" + encodeURIComponent(wxdomain + location.pathname + location.search) + "&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redirect", '_self')

        }
        $.cookie('isthird', true, { path: "/" }, { expires: 30 })
    },
    weixinFunc: {
        init: function () {
            //document.write('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>')
            this.dataInit();
            this.getticket(function (_that) {
                _that.getJsSign(function () {
                    _that.func();
                });
            });
        },
        dataInit: function () {
            this.ticket = "",
                this.getajaxconfig = ""
        },
        getticket: function (callback) {
            var _that = this
            $.ajax({
                type: "get",
                async: true,
                datatype: "json",
                url: "/uiapi/weixin?buss=ticket",
                success: function (data) {
                    data = JSON.parse(data);
                    _that.ticket = data.data.ticket;
                    callback(_that);
                    if (data.code == 100) {
                        //alert("您的登录已失效，请重新登录")
                        // localStorage.removeItem("loginName");
                        // $.cookie('sealnetSession', null,{path:"/"});
                        // $.cookie('expires', (new Date(0)).toGMTString(),{path:"/"});
                        // window.location.href = window.location.href + "?id=" + 10000 * Math.random();
                    }
                },
                error: function (jqXHR) {
                    console.log("发生错误" + jqXHR.status);
                }
            });
        },
        getJsSign: function (callback) {
            var _that = this;
            this.getajaxconfig = $.ajax({
                type: "post",
                async: true,
                datatype: "json",
                url: "/uiapi/weixin?buss=getJsSign",
                data: {
                    ticket: _that.ticket,
                    url: location.href
                },
                success: function (data) {
                    data = JSON.parse(data);
                    wxthird.data();
                    var wxconfigObj = {
                        debug: configFile.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: wxthird.appid, // 必填，公众号的唯一标识
                        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.data.nonce_str, // 必填，生成签名的随机串
                        signature: data.data.sign,// 必填，签名，见附录1
                        jsApiList: [
                            'checkJsApi',
                            'openLocation',
                            'getLocation'
                        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    }
                    wx.config(wxconfigObj);
                    console.log(_that, 111);
                    console.log(wxconfigObj, 222);
                    if (data.code == 100) {
                        //alert("您的登录已失效，请重新登录");
                        // localStorage.removeItem("loginName");
                        // $.cookie('sealnetSession', null,{path:"/"});
                        // $.cookie('expires', (new Date(0)).toGMTString(),{path:"/"});
                        // localStorage.removeItem("loginName");
                        // $.cookie('sealnetSession', null);
                        // $.cookie('expires', (new Date(0)).toGMTString());
                        //window.location.href = window.location.href + "?id=" + 10000 * Math.random();
                    };
                    return callback();
                },
                error: function (jqXHR) {
                    console.log("发生错误" + jqXHR.status);
                }
            });
        },
        func: function () {
            this.getajaxconfig.then(function () {
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
                            'getLocation'
                        ],
                        success: function (res) {
                            // alert(JSON.stringify(res));
                            // alert(JSON.stringify(res.checkResult.getLocation));
                            if (res.checkResult.getLocation == false) {
                                alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
                                return;
                            }
                        }
                    });
                    //$(".reverseLogo").on("click", function () {
                    wx.getLocation({
                        type: 'BD09', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var speed = res.speed; // 速度，以米/每秒计
                            var accuracy = res.accuracy; // 位置精度
                            console.log(123, res)
                            //configFile.myCenter=[longitude,latitude]
                            var ggPoint = new BMap.Point(longitude, latitude);
                            var convertor = new BMap.Convertor();
                            var pointArr = [];
                            pointArr.push(ggPoint);
                            convertor.translate(pointArr, 1, 5, function (data) {
                                if (data.status == 0) {
                                    var dotx = data.points[0].lng
                                    var doty = data.points[0].lat
                                    console.log(data.points[0], dotx, doty, "ggPoint")
                                    alert(dotx + ",,," + doty)
                                    configFile.changeCenter[0] = dotx;
                                    configFile.changeCenter[1] = doty;
                                    configFile.myCenter[0] = dotx;
                                    configFile.myCenter[1] = doty;
                                    alert(dotx + "," + doty)
                                }

                            })
                            //console.log(pointArr,"ggPoint")
                        },
                        cancel: function (res) {
                            alert('用户拒绝授权获取地理位置');
                        }
                    });
                    //wx.closeWindow();
                    //})
                });

                wx.error(function (res) {
                    //console.log(res, 333)
                })

            })
        }
    }
};
if (new RegExp(location.host).test(wxdomain)) {
    wxthird.init();
}
if (/infirm.html|my.html|info.html|set_pwd.html|phoneorder.html|myReservation.html|passfind.html|lostReport.html|my_regnewspaper.html|my_reservation.html|unbind.html|lostReport_confirm_data.html|regnewspaper_detail.html/.test(location.pathname)) {
    var wxcode;
    if (window.document.location.hostname == "localhost") {
        var wxcode = "12345678901234567891"
    } else {
        var wxcode = $.cookie('openid');
    }
    var loginauto = {
        login: function (wxcode) {
            var data = {
                "wxcode": wxcode
            }
            ajaxreq.user_auth_callback(data).done(function (data) {
                if (data.code == 0) {
                    localStorage.loginName = data.data.username;
                    localStorage.openid = wxcode;
                    $.cookie('sealnetSession', data.data.token, { path: "/" });
                    localStorage.loginnum = 0;
                } else if (data.code == 1) {
                    localStorage.loginnum = 1;
                    localStorage.openid = wxcode;
                    $.removeCookie('sealnetSession');
                    if (!(/phoneorder.html|myReservation.html|passfind.html/.test(location.pathname))) {
                        weui.alert("您还未绑定印章网登录账号", function () {
                            window.open('login.html', '_self');
                        }, { title: '提示' });
                    }
                    return false;
                } else {
                    localStorage.loginnum = 1;
                    $.removeCookie('sealnetSession');
                    if (!(/phoneorder.html|myReservation.html|passfind.html/.test(location.pathname))) {
                        weui.alert("微信获取失败，请重新授权进入", function () {
                            window.location.href = "wxthird.html"
                        }, { title: '提示' });
                    }
                    return false;
                }
            })
        }
    };
    $(function () {
        setTimeout(loginauto.login(wxcode), 100);
    })
};

//wxthird.weixinFunc.init();

var encryption = {
    encryption: function (str, callback) {
        if (str) {
            str = $.trim(str);
        }
        var debugging = false;
        $.ajax({
            url: "/sealnet/search?buss=param_encrypt",
            dataType: "json",
            headers: {
                "Content-Type": "text/plain;charset=UTF-8"
            },
            method: "post",
            data: { search_value: str },
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                callback(data);
            }
        });
    },
    goBack: function () {
        window.history.back()
    }
};
// ajaxreq.wxthird().done(function(){

// })

//https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx891c6bbfb8197d71&secret=9efd4acc4831b50af62a15e3d767fc54&code=021b3VEc0hQOUv1pwbGc0VM3Fc0b3VEq&grant_type=authorization_code
