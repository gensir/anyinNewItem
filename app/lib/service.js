define([
    'bootbox'
], function(bootbox) {    
    var domain = "";
    var baseUrl = "/api/";
    var basemp = "/mp/";
    var baseps = "/ps/";
    var gateway = "/gateway/";
	//var basemps = "/mps/";
	//var oldBaseUrl = "/";
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
        return $.ajax(sendData);
    };
    
    var info = {
        defaultErrorMsg: '网络异常，请稍后再试',
        unlogin:'登录信息失效，请重新登录'
    };

    var allFun =  {
            serverTest:function() {
                return ajaxCall({ url: domain + baseUrl + "sealnet/visitorsList" });
            },
            successCheckCode:function(ret) {
                if(!ret){
                    bootbox.alert({
                        message: info.defaultErrorMsg
                    });
                    return false;
                }else if (ret.code === 100) {
                    bootbox.alert(info.unlogin,function(){
                        location.href = './login.html';
                    });
                    return false
                } else if (ret.code !== 0) {
                    bootbox.alert({
                        message: ret.msg || info.defaultErrorMsg
                    });
                    return false;
                }
                return true;
            },
            ajaxCall:function(setting, type) {
                var xhr = autoAjaxCall(setting, type);
                xhr.fail(function(){
		            bootbox.hideAll();
		            var dialog = bootbox.dialog({
		                //closeButton: 'true',
		                className: 'common',
		                title: '接口提示',
		                onEscape: 'true',
		                message: '<div class="msgcenter"><em></em><span>接口异常，请求数据失败！</span></div>',
		                buttons: {
		                    cancel: {
		                        label: "确定",
		                        className: "btn2",
		                    },
		                }
		            });
                });
                return xhr;
            },
            parseParams:function(obj){
                var params='?';
                for(var param in obj){
                    params+=param+'='+ encodeURIComponent(obj[param])+'&'
                }
                return params.slice(0,params.length-1)
            },
		    serverTest:function() {
		        return this.ajaxCall({ url: domain + baseUrl + "sealnet/visitorsList" });
		    },
		    //手机验证码
		    getSMSVerifCode:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/getSMSVerifCode?mobilePhoneNo=" + data });
		    },
		    //印章管理
		    getEsealList:function(pageNum, pageSize, data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/list/" + pageNum + "/" + pageSize, data: data });
		    },
		    //签章日志记录
		    commSignetLog:function(pageNum, pageSize, data) {
		        return this.ajaxCall({ url: domain + basemp + "commSignetLog/list/" + pageNum + "/" + pageSize, data: data }, "post");
		    },
		    //系统操作日志
		    Operationlog:function(pageNum, pageSize, data) {
		        return this.ajaxCall({ url: domain + basemp + "operateLog/list/" + pageNum + "/" + pageSize, data: data });
		    },
		    //校验短信
		    checkSmsCode:function(code, phone) {
		        return this.ajaxCall({ url: domain + basemp + "common/checkSmsCode?smsCode=" + code + "&mobilePhoneNo=" + phone });
		    },
		    //登录
		    userlogin:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "sys/login", data: data }, "post");
		    },
		    loginCaptcha:function() {
		        return this.ajaxCall({ url: domain + baseUrl + "management_platform/captcha", async: false });
		    },
		    getRandomNum:function(val) {
		        return this.ajaxCall({ url: domain + basemp + "common/getRandomNum?esealCode"+"="+decodeURIComponent(val), async: false});
		    },
		    //获取订单中心列表
		    queryOrderList:function(pageNum, pageSize, data) {
		        return this.ajaxCall({ url: domain + basemp + "mpEsealOrder/queryOrderList/" + pageNum + "/" + pageSize, data: data });
		    },
		    //上传图片时删除之前的图片
		    deletePhoto:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "file?fileUrl=" + data, async: false }, "delete");
		    },
		    //检查信用代码
		    checkidCode:function(data) {
		        return this.ajaxCall({ url: domain + baseUrl + "management_platform/sys/checkidCode", data: data }, "post");
		    },
		    //企业附件信息上传
		    attach:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "attach", data: data }, "POST");
		    },
		    //刻章店查询  /get_area/sealShops/queryPageSealShopsByAreacode?areacode=440305&page=1&size=5
		    getSealShop:function(areacode, pageNum, pageSize) {
		        return this.ajaxCall({ url: domain + basemp + "get_area/sealShops/queryPageSealShopsByAreacode?areacode=" + areacode + "&page=" + pageNum + "&size=" + pageSize, async: false });
		    },
		    //获取行政区  get_area/codeArea/queryCodeArea?area_code=440300
		    queryCodeArea:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "get_area/codeArea/queryCodeArea?area_code=" + data, async: false });
		    },
		    //提交账号和密码
		    registerUser:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/registerUser", data: data }, "post");
		    },
		    //点击注册
		    toRegister:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/toRegister", data: data });
		    },
		    toRegisterOdc:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/toRegisterOdc", data: data }, 'get');
		    },
		    //检查企业是否注册
		    checkUserIsExist:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/checkUserIsExist", data: data });
		    },
		    //检查图片验证码
		    checkCaptcha:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/checkCaptcha", data: data });
		    },
		    //新办电子印章第一步
		    getstep1:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step1?enterpriseId=" + data,async: false });
		    },
		    //查询有问题的订单
		    errorOrder:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/list/1/5", data:data, async: false });
		    },
		    //提交第一步
		    poststep1:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step1", data: data }, "post");
		    },
		    //获取新版电子印章第二步
		    getstep2:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step2?orderNo=" + data, async: false });
		    },
		    //提交新办电子印章第二步
		    poststep2:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step2", data: data }, "post");
		    },
		    //获取新办电子印章第三步
		    getstep3:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step3?orderNo=" + data, async: false });
		    },
		    //提交新办电子印章第三步
		    poststep3:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step3", data: data }, "post");
		    },
		    //获取电子印章订单的详情
		    esealOrderInfo:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/info?orderNo=" + data, data: data });
		    },
		    //Step4界面展示
		    orderStep4:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step4?orderNo=" + data });
		    },
		    //获取订单状态
		    status:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/status?orderNo=" + data, async: false });
		    },
		    //提交Step4
		    submitStep4:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/step4", data: data }, "post");
		    },
		    //获取微信支付的二维码
		    qrCode:function(data) {
		        //return this.ajaxCall({ url: domain + basemp + "eseal/order/qr_code?codeUrl="+data, data: data});
		        return domain + basemp + "eseal/order/qr_code?codeUrl=" + data
		    },
		    //创建支付宝或银联订单的Json数据
		    payment:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/payment", data: data });
		    },
		    //弹出银联或者支付宝的付款页面
		    payAlertPage:function(data, requestUrl) {
		        return this.ajaxCall({ url: requestUrl, data: data }, "post");
		    },
		    //前端查第三方订单状态手动更新订单接口 
		    esealOrderResult:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order", data: data }, "put");
		    },
		    //查询公司所在区域的行政编码
		    getCompanyArea:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "get_company_area_number/" });
		    },
		    //名称查询企业编码
		    checkname:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "check_organization/web/solr/company/name", data: data }, "post");
		    },
		    //登录权限控制
		    loginLicense:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/updateKey", data: data }, "post");
		    },
		    //登录权限控制
		    licenselist:function(pageNum, pageSize, data) {
		        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/selectEsealInfoList/" + pageNum + "/" + pageSize, data: data });
		    },
		    //登录权限最后一个关闭控制
		    islicenseLast:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/selectCountByEnterpriseCode", data: data, async: false });
		    },
		    //更新状态
		    updateStatus:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/update_status", data: data }, "POST");
		    },
		    //银联接口
		    unYlyl:function(data) {
		        return this.ajaxCall({ url: domain + gateway + "api/frontTransReq.do", data: data, dataType: 'html' }, "POST");
		    },
		    //通过发票流水号生成百望电子发票
		    orderInvoice:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/invoice", data: data, async: false }, "POST");
		    },
		    //手机号是否存在
		    mobileIsNotExist:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "common/mobileIsNotExist", data: data });
		    },
		    getRenewInfo:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "order/renew/info", data: data });
		    },
		    orderRenew:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "order/renew", data: data }, "post");
		    },
		    //根据firmId获取行政区域编码
		    getAreaByFirmId:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "get_company_area_number/web/unit/get/" + data });
		    },
		    //根据公司名查询firmId
		    getAreaByCom:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "check_organization/web/solr/company/name", data: data }, "post");
		    },
		    //单个订单附件上传
		    orderAttach:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "eseal/order/attach", data: data }, "post");
		    },
		    //PIN码错误次数校验
		    checkPIN:function(data) {
		        return this.ajaxCall({ url: domain + basemp + "mpkeyuserinfo/checkPIN", data: data }, "post");
		    },
            //线上预挂失
            updatePreLossStatus:function(data) {
                return this.ajaxCall({ url: domain + basemp + "esealReportLossInfo/updatePreLossStatus", data: data }, "post");
            },
            //取消预挂失
            updateEsealStatus:function(data) {
                return this.ajaxCall({ url: domain + basemp + "esealReportLossInfo/updateEsealStatus", data: data }, "post");
            },
            //申请证书成功回写证书信息
            writeCert:function(data){
		    	return this.ajaxCall({ url: domain + basemp + "commEsealEquipmentInfo/getListByOid", data: data });
		    },
		    //GDCA 续费支付成功
		    renew_certGDCA:function(data){
		    	return this.ajaxCall({ url: domain + basemp + "order/renew_cert/gdca", data: data }, "post");
		    },
		    //所有CA 新办和续期写入证书；
		    write_cert_GDCA:function(data) { 
	            return this.ajaxCall({ url: domain + basemp + "eseal/write_cert", data: data }, 'post')
	        },
	        //netca 续期请求url
	        renewNetca:function(data){
	        	return this.ajaxCall({ url: domain + basemp + "order/renew_cert/netca", data: data }, 'post')
	        },
	        //netca 续期回调
	        netcaCallBack:function(data) {
	            return this.ajaxCall({ url: domain + basemp + "order/renew_cert/netcaCallBack", data: data }, 'get')
	        },
		    //根据OID查询证书接口
		    getListByOrderNo:function(data){
		    	return this.ajaxCall({ url: domain + basemp + "mpEsealOrderExt/getCommEsealEquipmentMapChangeVO", data: data },'get');
		    },
		    //判断netca是否可以进行换体续期
		    isNeedChangeCert:function(data){
		    	return this.ajaxCall({ url: domain + basemp + "order/renew_cert/isNeedChangeCert", data: data },'get');
		    }
        }
    return allFun;
});
