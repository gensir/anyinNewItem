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
    issupport() {
        if (!this.data.isAvailableUkey) {
            this.tip("请在IE浏览器下使用ukey");
            return false;
        }
        return true;
    },
    randomNum() {//获取随机数
        return service.getRandomNum().done(function (data) {
        }).responseJSON.data
    },
    ukeyName() {//获取所有ukey名（数组）
        if (this.issupport()) {
            var nCount = this.data.ukey.GetCertCount();
            this.data.ukeyName = [];
            for (var i = 0; i < nCount; i++) {
                this.data.ukey.SetCertIndex(i);//获取第几个ukey
                this.data.ukeyName.push(this.data.ukey.GetCertInfo(0));
            }
            return this.data.ukeyName
        }
    },
    PIN(val, selectukeyInd) {// 验证PIN密码
        if (val && this.issupport()) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.SetCertPin(val);//Boolean
        }
    },
    dSignature(selectukeyInd) {//客服端数字签名；
        var randomNum = this.randomNum();//"111111";// 
        var randomNum="111111"
        if (randomNum && this.issupport()) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.Signature(randomNum, randomNum.length);
        }
    },
    dCertificate(selectukeyInd) {//数字证书；
        if (selectukeyInd !== undefined && this.issupport()) {
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.GetCertInfo(1)
        }
    },
    esealCode(val,selectukeyInd) {//印章编码
        if(this.PIN(val,selectukeyInd)){
            this.data.ukey.SetCertIndex(selectukeyInd);
            return this.data.ukey.GetCertInfo(3)
        }
    }
}
ukeys.ukeyInit();
module.exports = ukeys;