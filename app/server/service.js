const domain = "";
const baseUrl = "/api/";
const basemp = "/mp/";
//const basemps = "/mps/";
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
                message: '<div class="msgcenter"><em></em>  ！</div>',
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
    commSignetLog(pageNum, pageSize, data) {
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
        return this.ajaxCall({ url: domain + basemp + "sys/login", data: data }, "post");
    },
    loginCaptcha() {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/captcha", async: false });
    },
    getRandomNum(){
        return this.ajaxCall({ url: domain + basemp + "common/getRandomNum", async: false });
    },
    //获取订单中心列表
    queryOrderList(pageNum,pageSize,enterpriseCode) {
        return this.ajaxCall({ url: domain + basemp + "/mpEsealOrder/queryOrderList/"+pageNum+"/"+pageSize+"?enterpriseCode="+enterpriseCode});
    },
    //上传图片时删除之前的图片
    deletePhoto(data) {
        return this.ajaxCall({ url: domain + basemp + "file?fileUrl="+data }, "delete");
    },
    //检查信用代码
    checkidCode(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/checkidCode", data: data }, "post");
    },
    //企业附件信息上传
    attach(data) {
        return this.ajaxCall({ url: domain + basemp + "attach", data: data }, "post");
    },
    //刻章店查询  /get_area/sealShops/queryPageSealShopsByAreacode?areacode=440305&page=1&size=5
    getSealShop(areacode,pageNum,pageSize){
    	return this.ajaxCall({ url: domain + basemp + "get_area/sealShops/queryPageSealShopsByAreacode?areacode="+areacode+"&page="+pageNum+"&size="+pageSize });
    },
    //获取行政区  get_area/codeArea/queryCodeArea?area_code=440300
    queryCodeArea(data){
    	return this.ajaxCall({ url: domain + basemp + "get_area/codeArea/queryCodeArea?area_code="+data});
    },
    //提交账号和密码
    registerUser(mobile,passwd,enterpriseCode){
    	return this.ajaxCall({ url: domain + basemp + "common/registerUser?mobile="+mobile+"&password="+passwd+"&enterpriseCode="+enterpriseCode});
    },
    //点击注册
    toRegister(data){
    	return this.ajaxCall({ url: domain + basemp + "common/toRegister", data: data });
    },
     //新办电子印章第一步
    getstep1(data){
    	return this.ajaxCall({ url: domain + basemp + "eseal/order/step1?enterpriseId="+data, async: false });
    },
    //提交第一步
    poststep1(data){
    	return this.ajaxCall({ url: domain + basemp + "eseal/order/step1?", data:data }, "post" );
    },
    //获取新版电子印章第二步
    getstep2(data){
    	return this.ajaxCall({ url: domain + basemp + "eseal/order/step2?orderNo="+data, async: false });
    },
    //检查企业是否注册
    checkUserIsExist(data){
    	return this.ajaxCall({ url: domain + basemp + "common/checkUserIsExist", data: data });
    },
    //检查图片验证码
    checkCaptcha(data){
    	return this.ajaxCall({ url: domain + basemp + "common/checkCaptcha", data: data });
    }
}