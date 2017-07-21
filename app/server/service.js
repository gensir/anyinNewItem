const domain = "";
const sealShop="/api/sealShops/";
const baseUrl = "/api/";
const basemp = "/mp/";
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
    },
    'delete': {
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
            bootbox.hideAll();
            var dialog = bootbox.dialog({
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
    //手机验证码
    getSMSVerifCode(data) {
        return this.ajaxCall({ url: domain + basemp + "common/getSMSVerifCode?mobilePhoneNo="+data });
    },
    //印章管理
    getEsealList(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/list/" + pageNum + "/" + pageSize, data: data });
    },
    //签章日志记录
    getLogsList1(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/logs/list/1/5", data: data });
    },
    //签章日志记录
    getLogsList(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "commSignetLog/list/" + pageNum + "/" + pageSize, data: data });
    },
    //系统操作日志
    Operationlog(pageNum, pageSize) {
        return this.ajaxCall({ url: domain + basemp + "operateLog/list/" + pageNum + "/" + pageSize });
    },
    //校验短信
    checkSmsCode(data) {
        return this.ajaxCall({ url: domain + basemp + "common/checkSmsCode?smsCode="+data });
    },
    userlogin(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/login", data: data }, "post");
    },
    loginCaptcha() {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/captcha", async: false });
    },
    getRandomNum(){
        return this.ajaxCall({ url: domain + basemp + "common/getRandomNum", async: false });
    },
    //获取订单中心列表
    queryOrderList(pageNum,pageSize,enterpriseCode) {
        return this.ajaxCall({ url: domain + basemp + "management_platform/mpEsealOrder/queryOrderList/"+pageNum+"/"+pageSize+"?enterpriseCode="+enterpriseCode});
    },
    //上传图片时删除之前的图片
    deletePhoto(data) {
        return this.ajaxCall({ url: domain + anyinUrl + "file", data: data }, "delete");
    },
    //检查信用代码
    checkidCode(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/checkidCode", data: data }, "post");
    },
    //获取随机码
    yzmCode(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/method=getvercode" }, "post");
    },
    //检查随机验证码
    checkyzmCode(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/checkyzmCode", data: data });
    },
    //企业附件信息上传
    attach(data) {
        return this.ajaxCall({ url: domain + basemp + "attach", data: data }, "post");
    },
    //刻章店查询
    getSealShop(areacode,pageNum,pageSize){
    	return this.ajaxCall({ url: domain + sealShop + "queryPageSealShopsByAreacode?areacode="+areacode+"&page="+pageNum+"&size="+pageSize });
    },
    //获取行政区
    queryCodeArea(data){
    	return this.ajaxCall({ url: domain + baseUrl + "codeArea/queryCodeArea?area_code="+data});
    }
}