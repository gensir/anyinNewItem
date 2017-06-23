
const domain = "";
const baseUrl = "/api/";
const anyin=""
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

var ajaxCall = function (setting, type) {
    if (type === undefined) {
        type = 'get';
    }
    var sendData = commonAjaxSetting[type];
    sendData.type = type;
    sendData = $.extend({}, sendData, setting);
    return $.ajax(sendData);
};
function getSubPath(){
    var subpath=location.pathname.split("/")[1]
    if(subpath.length>0 && subpath.indexOf('.')===-1){
        subpath="/"+subpath;
    }else{
        subpath = 'yzpm';
    }
    return subpath;
} 


export default {
        serverTest() {
            return ajaxCall({ url: domain + baseUrl + "sealnet/visitorsList"});
    }
}

