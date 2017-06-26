var Util = {
    
};

//域名键值对调用
function GetQueryString(name, elseUrl) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (elseUrl !== undefined) {
        var s = elseUrl.split("?")[1].match(reg);
        if (s != null) return decodeURIComponent(s[2]); return null;
    }
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
}

function SetQueryString(obj) {
    var tempAry = [];
    for (var i in obj) {
        tempAry.push(i + "=" + encodeURIComponent(obj[i]));
    }
    var ret = tempAry.join("&");
    return ret;
}

export function add(){
    console.log("只是一个公用的 function !")
};

export function elseFuns(){
    console.log("这是另一个公用的 function !")
}