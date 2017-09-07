const domain = "";
const baseUrl = "/api/";
const basemp = "/mp/";
const gateway ="/gateway/"
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
    console.log(JSON.stringify(sendData))
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
        return this.ajaxCall({ url: domain + basemp + "common/getSMSVerifCode?mobilePhoneNo=" + data });
    },
    //印章管理
    getEsealList(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/list/" + pageNum + "/" + pageSize, data: data });
    },
    //签章日志记录
    commSignetLog(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "commSignetLog/list/" + pageNum + "/" + pageSize, data: data }, "post");
    },
    //系统操作日志
    Operationlog(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "operateLog/list/" + pageNum + "/" + pageSize, data: data });
    },
    //校验短信
    checkSmsCode(code, phone) {
        return this.ajaxCall({ url: domain + basemp + "common/checkSmsCode?smsCode=" + code + "&mobilePhoneNo=" + phone });
    },
    //登录
    userlogin(data) {
        return this.ajaxCall({ url: domain + basemp + "sys/login", data: data }, "post");
    },
    loginCaptcha() {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/captcha", async: false });
    },
    getRandomNum(data) {
        return this.ajaxCall({ url: domain + basemp + "common/getRandomNum", async: false, data: data });
    },
    //获取订单中心列表
    queryOrderList(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "mpEsealOrder/queryOrderList/" + pageNum + "/" + pageSize, data: data });
    },
    //上传图片时删除之前的图片
    deletePhoto(data) {
        return this.ajaxCall({ url: domain + basemp + "file?fileUrl=" + data , async: false }, "delete");
    },
    //检查信用代码
    checkidCode(data) {
        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/checkidCode", data: data }, "post");
    },
    //企业附件信息上传
    attach(data, urls) {
        return this.ajaxCall({ url: domain + basemp + "attach" + urls, data: data }, "post");
    },
    //刻章店查询  /get_area/sealShops/queryPageSealShopsByAreacode?areacode=440305&page=1&size=5
    getSealShop(areacode, pageNum, pageSize) {
        return this.ajaxCall({ url: domain + basemp + "get_area/sealShops/queryPageSealShopsByAreacode?areacode=" + areacode + "&page=" + pageNum + "&size=" + pageSize, async: false });
    },
    //获取行政区  get_area/codeArea/queryCodeArea?area_code=440300
    queryCodeArea(data) {
        return this.ajaxCall({ url: domain + basemp + "get_area/codeArea/queryCodeArea?area_code=" + data, async: false });
    },
    //提交账号和密码
    registerUser(data) {
        return this.ajaxCall({ url: domain + basemp + "common/registerUser", data: data }, "post");
    },
    //点击注册
    toRegister(data) {
        return this.ajaxCall({ url: domain + basemp + "common/toRegister", data: data });
    },
    //检查企业是否注册
    checkUserIsExist(data) {
        return this.ajaxCall({ url: domain + basemp + "common/checkUserIsExist", data: data });
    },
    //检查图片验证码
    checkCaptcha(data) {
        return this.ajaxCall({ url: domain + basemp + "common/checkCaptcha", data: data });
    },
    //新办电子印章第一步
    getstep1(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step1?enterpriseId=" + data, async: false });
    },
    //查询有问题的订单
    errorOrder(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/list/1/5?orderStatus=1&enterpriseCode=" + data, async: false });
    },
    //提交第一步
    poststep1(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step1", data: data }, "post");
    },
    //获取新版电子印章第二步
    getstep2(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step2?orderNo=" + data, async: false });
    },
    //提交新办电子印章第二步
    poststep2(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step2", data: data }, "post");
    },
    //获取新办电子印章第三步
    getstep3(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step3?orderNo=" + data, async: false });
    },
    //提交新办电子印章第三步
    poststep3(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step3", data: data }, "post");
    },
    //获取电子印章订单的详情
    esealOrderInfo(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/info?orderNo=" + data, data: data });
    },
    //Step4界面展示
    orderStep4(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step4?orderNo=" + data, data: data });
    },
    //获取订单状态
    status(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/status?orderNo=" + data, async: false });
    },
    //提交Step4
    submitStep4(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/step4", data: data }, "post");
    },
    //获取微信支付的二维码
    qrCode(data) {
        //return this.ajaxCall({ url: domain + basemp + "eseal/order/qr_code?codeUrl="+data, data: data});
        return domain + basemp + "eseal/order/qr_code?codeUrl=" + data
    },
    //创建支付宝或银联订单的Json数据
    payment(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/payment", data: data });
    },
    //弹出银联或者支付宝的付款页面
    payAlertPage(data, requestUrl) {
        return this.ajaxCall({ url: requestUrl, data: data }, "post");
    },
    //前端查第三方订单状态手动更新订单接口 
    esealOrderResult(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order", data: data }, "put");
    },
    //查询公司所在区域的行政编码
    getCompanyArea(data) {
        return this.ajaxCall({ url: domain + basemp + "get_company_area_number/", data: data }, "post");
    },
    //名称查询企业编码
    checkname(data) {
        return this.ajaxCall({ url: domain + basemp + "check_organization/web/solr/company/name", data: data }, "post");
    },
    //登录权限控制
    loginLicense(data) {
        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/updateKey", data: data }, "post");
    },
    //登录权限控制
    licenselist(pageNum, pageSize, data) {
        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/selectEsealInfoList/" + pageNum + "/" + pageSize, data: data });
    },
    //登录权限最后一个关闭控制
    licenseLast(data) {
        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/selectCountByEnterpriseCode", data: data,async:false });
    },
    //更新状态
    updateStatus(data) {
        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/update_status", data: data }, "POST");
    },
    //银联接口
    unYlyl(data) {
        return this.ajaxCall({ url: domain + gateway + "api/frontTransReq.do",data: data, dataType:'html'}, "POST");
    },
    //通过发票流水号生成百望电子发票
    orderInvoice(data) {
        return this.ajaxCall({ url: domain + basemp + "eseal/order/invoice", data: data }, "POST");
    },
    //手机号是否存在
    mobileIsNotExist(data){
    	return this.ajaxCall({ url: domain  + basemp + "common/mobileIsNotExist", data: data });
    },  
    getRenewInfo(data){

    	return this.ajaxCall({ url: domain  + basemp + "order/renew/info", data: data  });
    },    
    orderRenew(data){
    	return this.ajaxCall({ url: domain  + basemp + "order/renew", data: data}, "post");
    },
    //根据firmId获取行政区域编码
    getAreaByFirmId(data) {
        return this.ajaxCall({ url: domain + basemp + "api/web/unit/get/" + data });
    },
    //根据公司名查询firmId
    getAreaByCom(data){
    	return this.ajaxCall({ url: domain + basemp + "api/web/solr/company/name", data: data,async:false }, "post");
    },
    //单个订单附件上传
    orderAttach(data){
    	return this.ajaxCall({ url: domain + basemp + "eseal/order/attach", data: data }, "post");
    }
}