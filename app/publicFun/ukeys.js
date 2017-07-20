var service = require('../server/service').default;
var ukeys = {
    ukeyInit() {
        // 这里就是注册表中CLSID文件夹根目录的文件夹名称
        try {
            this.data.ukey = new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
        } catch (e) {
            this.data.isAvailableUkey = false;
        }
    },
    data: {
        ukey: null,
        isAvailableUkey: true,
        ukeyName: [],
        PINResult: null
    },
    tip(text) {
        bootbox.alert({
            size: "small",
            title: "提示",
            message: text,
            callback: function () { /* your callback code */ }
        })
    },
    randomNum() {//获取随机数
        return service.getRandomNum().done(function (data) {
        }).responseJSON.data
    },
    ukeyName() {//获取所有ukey名（数组）
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        var nCount = this.data.ukey.GetCertCount();
        this.data.ukeyName = [];
        for (var i = 0; i < nCount; i++) {
            this.data.ukey.SetCertIndex(i);//获取第几个ukey
            this.data.ukeyName.push(this.data.ukey.GetCertInfo(0));
        }
        return this.data.ukeyName
    },
    PIN(val, selectukeyInd) {// 验证PIN密码
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        if (val) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.SetCertPin(val);//Boolean
        }
    },
    dSignature(selectukeyInd) {//客服端数字签名；
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        var randomNum =this.randomNum();//"111111";// 
        if (randomNum) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.Signature(randomNum, randomNum.length);
        }
    },
    Dcertificate(selectukeyInd) {//数字证书；
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        if (selectukeyInd !== undefined) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.GetCertInfo(1)
        }
    },
    esealCode(selectukeyInd) {//印章编码
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        if (selectukeyInd !== undefined) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.GetCertInfo(3)
        }

    }
}
ukeys.ukeyInit();
module.exports = ukeys;