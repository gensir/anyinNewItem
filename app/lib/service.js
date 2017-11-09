define([
    'bootbox'
], function(bootbox) {    
    var domain = "";
    var baseUrl = "/api/web/";
    var anyin = ""
    //const oldBaseUrl = "/";
    var commonAjaxSetting = {
        'get': {
            dataType: "json",
            cache: false
        },
        'post': {
            dataType: "json",
            headers: {
                "Content-Type": "application/json"//"application/x-www-form-urlencoded"
            },
            data: {},
            cache: false
        },
        'put': {
            dataType: "json",
            headers: {
                "Content-Type": "application/json"//"application/x-www-form-urlencoded"
            },
            data: {},
            cache: false
        }        
        
    };

    var ajaxCall = function (setting, type) {
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
                        location.href = './index.html#login';
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
            autoAjaxCall:function(setting, type) {
                var xhr = ajaxCall(setting, type);
                xhr.fail(function(){
                    bootbox.alert({
                        message: info.defaultErrorMsg
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
            //common
            getMappingByType:function(type) {
                return this.autoAjaxCall({ url: baseUrl + 'common/CommDictionaryAll?type=' + type });
            },
            getBussnissInfoByUnitId:function(id) {
                return this.autoAjaxCall({ url: baseUrl + 'unit/get/' + id });
            },
            //page:order
            getOrderList:function(obj) {
                // let params=this.parseParams(obj);
                return this.autoAjaxCall({ url: domain + baseUrl + 'shop/shopOrder', data: obj }, 'post');

            },
            postSession:function(data) {
                return ajaxCall({ url: domain + baseUrl + 'user/police/login', data: data }, 'post');
            },
            getLogout:function(){
                return this.autoAjaxCall({ url:domain + baseUrl + 'user/logout'});
            },
            getShopOrder:function(orderId) {
                return ajaxCall({ url: domain + baseUrl + 'shop/shopOrder/' + encodeURIComponent(orderId) });
            },
            postCompanyList:function(data) {
                return ajaxCall({ url: domain + baseUrl + 'solr/company/list', data: data }, 'post');
            },
            safeCompanyList:function(data) {
                return ajaxCall({ url: domain + baseUrl + 'shop/approveOrder/list', data: data }, 'post');
            },
            recordSealList:function(data){
                return ajaxCall({ url: domain + baseUrl + 'shop/seal/list', data: data }, 'post');
            },
            //page:review
            postApprove:function(data) {
                return ajaxCall({ url: domain + baseUrl + 'shop/approveOrder', data: data }, 'post');
            },
            //page: order_detail
            getTransferAreaOrderByOrderId:function(orderId){
                return ajaxCall({ url:  domain + baseUrl + 'shop/unit/exchange/view/' + encodeURIComponent(orderId)});
            },
            postTransferArea:function(data){
                return ajaxCall({url:domain + baseUrl + 'shop/unit/exchange/approve/police',data:data},'post')
            },
            getSealRecordByOrderId:function(orderId){
                return ajaxCall({ url:  domain + baseUrl + 'shop/sealRecord/' + encodeURIComponent(orderId)});
            },
            postApproveAuditSealRecord:function(data){
                return ajaxCall({url:domain + baseUrl + 'shop/approveAuditSealRecord',data:data},'post')
            },
            getTransferAreaListByAreaCode:function(obj){
                var para = this.parseParams(obj);
                return this.autoAjaxCall({ url: domain + baseUrl + 'common/unitchange/toareas' + para});
            },
            getShopSealCancelDetail:function(orderId){
                return ajaxCall({ url:  domain + baseUrl + 'shop/shopSealCancel/detail/' + encodeURIComponent(orderId)});
            },
            getShopSealUndertakeDetail: function(orderId){
                return ajaxCall({ url:  domain + baseUrl + 'shop/undertakeOrder/' + encodeURIComponent(orderId)});
            },
            postShopSealCancelApprove:function(data){
                return ajaxCall({url:domain + baseUrl + 'shop/shopSealCancel/approve',data:data},'post');
            },
            getShopSealChangeDetail:function(orderId){
                return ajaxCall({ url:  domain + baseUrl + 'shop/unitChange/' + encodeURIComponent(orderId)});
            },
            postShopSealChangeApprove:function(data){
                return ajaxCall({url:domain + baseUrl + 'shop/approveAuditUnitChange',data:data},'post');

            },
            postReportByBusinessType:function(data){
                return ajaxCall({url:domain + baseUrl + 'seal/getreportbybusinesstype',data:data},'post');


            },
            postReportByTypeAndDeliverDate:function(data){
                return ajaxCall({url:domain + baseUrl + 'seal/getreportbytypeanddeliverdate',data:data},'post');
            },
            //查询从业人员信息列表接口
            employeePages:function(data){
                return ajaxCall({url:domain + baseUrl + 'employee/pages',data:data},'post');            	
            },
            //查询单个从业人员详情接口
            employeeDetails:function(data){
                return ajaxCall({ url:  domain + baseUrl + 'employee/'+encodeURIComponent(data)});
            },
            //page: sealDetail  
            getSealDetail: function(paramObj){
                return ajaxCall({ url:  domain + baseUrl + 'shop/seal/'+encodeURIComponent(paramObj.sealId)});
            },     
            //从业人员信息数据更新接口
             employeePut:function(data){
                return ajaxCall({ url: domain + baseUrl + 'employee', data: data }, 'put');
            },
            //从业人员离职接口
             employeeDeparture:function(data){
                return ajaxCall({ url: domain + baseUrl + 'employee/departure/'+data.employeeId+'/'+data.state }, 'put');
            },            
            //查询单位信息列表
            getUnitList:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/unit/pages',data:data},'post')
            },
            //单位查询详情
            getUnitQueryDetailById:function(id){
                return ajaxCall({ url: domain + baseUrl + 'police/unit/sealcard/' + id });
            },
            getSealRecordById:function(id){
                return ajaxCall({url: domain + baseUrl + 'police/seal/sealCard/' + id})
            },
            //查询印章店信息列表接口
            shopManagePages:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/shop/pages',data:data},'post');                
            },
            getShopManageDetailById:function(id){
                return ajaxCall({url:domain + baseUrl + 'police/shop/sealShopInfo/'+ encodeURIComponent(id)});
            },
            postShopManageDetail:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/shop/sealShop/', data:data}, 'post');
            },
            //新增处罚记录
            createPunish:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/shop/situation',data:data},'post');
            }, 
            //查询处罚记录列表
            getPunishList:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/shop/situationInfo',data:data},'post');
            },
            modifyPunish:function(data){
                return ajaxCall({url:domain + baseUrl + 'police/shop/situationModify',data:data},'post');
            }  
        }
    return allFun;
});