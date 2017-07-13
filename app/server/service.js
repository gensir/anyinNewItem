const domain = "";
const baseUrl = "/api/";
const anyin = "";
const anyinUrl = "http://192.168.1.159:9500";
const jsl = "http://192.168.4.94:8082"
//const oldBaseUrl = "/";
var commonAjaxSetting = {
    'get': {
        dataType: "json",
        cache: false
    },
    'post': {
        dataType: "json",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
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
        subpath = 'yzpm';
    }
    return subpath;
}

export default {
    successCheckCode(data) {
        if (data.code == 100) {

        } else if (data.code != 0) {

        }
    },
    ajaxCall(setting, type) {
        var xhr = autoAjaxCall(setting, type);
        xhr.fail(() => {
            bootbox.dialog ({
                //closeButton: 'true',
                className: 'common',
                title: '接口提示',
                onEscape: 'true',
                message: '<div class="msgcenter"><em></em>接口异常，请求数据失败！</div>',
                buttons: {
                    cancel: {
                        label: "确定",
                        className: "btn2",
                    },
                }
            });

            //bootbox.alert("请求失败")
        });
        return xhr;
    },
    serverTest() {
        return this.ajaxCall({ url: domain + baseUrl + "sealnet/visitorsList" });
    },
    getSMSVerifCode() {
        return this.ajaxCall({ url: domain + baseUrl + "standard_server/common/getSMSVerifCode" });
    },
    //印章管理
    getEsealList(pageNum, pageSize) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/eseal/list/1/10" });
    },
    //签章日志记录
    getLogsList(pageNum, pageSize) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/logs/list/1/5" });
    },
    checkSmsCode() {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/common/checkSmsCode" });
    },
    userlogin(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/login", data: data }, "post");
    },
    loginCaptcha() {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/captcha", async: false });
    },
    //操作日志
    Operationlog (pageNum, pageSize) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/Operationlog/list/1/10" });
    },
    //获取订单中心列表
    queryOrderList(pageNum,pageSize){
    	return this.ajaxCall({ url: domain + baseUrl + "management_platform/mpEsealOrder/queryOrderList/1/10" });
    },
    //上传图片时删除之前的图片
    deletePhoto(){
    	return this.ajaxCall({ url: domain + baseUrl + "mp/file" });
    }
}