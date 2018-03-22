define([
    "./service",
    "bootbox"
], function(service, bootbox) {
    var ukeys = {
        ukeyInit: function() {
            // 这里就是注册表中CLSID文件夹根目录的文件夹名称
            try {
                var ActiveXObject = window.ActiveXObject;
                this.data.ukey =
                    ActiveXObject !== undefined &&
                    new ActiveXObject("IYIN_SIGNACTIVE.IYIN_SignActiveCtrl.1");
                this.data.KeyManage = new ActiveXObject(
                    "KeyManage.ConnManage.1"
                );
            } catch (e) {
                if (ActiveXObject === undefined) {
                    this.data.isAvailableUkey = false;
                } else {
                    console.log("uninstall KeyManage");
                }
            }
        },
        data: {
            ukey: null,
            KeyManage: null,
            isAvailableUkey: true,
            ukeyName: [],
            PINResult: null
        },
        tip: function(text) {
            bootbox.alert({
                size: "small",
                title: "提示",
                message: text,
                callback: function() {
                    /* your callback code */
                }
            });
        },
        issupport: function() {
            if (!this.data.isAvailableUkey || !this.data.ukey) {
                this.tip("请插入ukey并安装驱动后在IE浏览器下使用ukey");
                return false;
            }
            return true;
        },
        randomNum: function(esealCode, keyType) {
            //获取随机数
            var data = { esealCode: esealCode };
            if (keyType == 1) {
                data = { oid: decodeURIComponent(esealCode) };
            }
            var type = keyType == 1 ? "oid" : "esealCode";
            return service.getRandomNum(data[type]).done(function(data) {})
                .responseJSON.data;
        },
        ukeyName: function() {
            //获取所有ukey名（数组）
            if (this.issupport()) {
                var nCount = this.data.ukey.GetCertCount();
                this.data.ukeyName = [];
                for (var i = 0; i < nCount; i++) {
                    this.data.ukey.SetCertIndex(i); //获取第几个ukey
                    this.data.ukeyName.push(this.data.ukey.GetCertInfo(0));
                }
                return this.data.ukeyName;
            }
        },
        getCertSignSN: function(selectukeyInd) {
            //获取签名证书序列号
            if (this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(10);
            }
        },
        getCertEncSN: function(selectukeyInd) {
            //获取加密证书序列号
            if (this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(11);
            }
        },
        dCertPublicKey: function(selectukeyInd) {
            //数字加密证书公钥；
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(9);
            }
        },
        GetCertCount: function() {
            return this.data.ukey && this.data.ukey.GetCertCount();
        },
        PIN: function(val, selectukeyInd) {
            // 验证PIN密码
            if (val && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.SetCertPin(val); //Boolean
            }
        },
        dSignature: function(selectukeyInd, randomNum, getPwd) {
            //客户端数字签名；
            if (randomNum && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                this.data.ukey.SetCertPin(getPwd);
                return this.data.ukey.Signature(randomNum, randomNum.length);
            }
        },
        dCertificate: function(selectukeyInd) {
            //数字加密证书；
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertData(1);
            }
        },
        getSignatureCert: function(selectukeyInd) {
            //签名证书
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertData(0);
            }
        },
        esealCode: function(val, selectukeyInd) {
            //印章编码
            var checkResult = null;
            if (this.PIN(val, selectukeyInd)) {
                //this.data.ukey.SetCertIndex(selectukeyInd);
                checkResult = this.data.ukey.SetCertPin(val);
            }
            return this.data.ukey.GetCertInfo(3);
        },
        startDate: function(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(5);
            }
        },
        endDate: function(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(6);
            }
        },
        getCertType: function(selectukeyInd) {
            //1==ODC OR 0==IYIN
            if (selectukeyInd !== undefined && this.issupport()) {
                //this.data.ukey.SetCertIndex(selectukeyInd);

                return this.data.ukey.GetCertInfo(2);
            }
        },
        CertType: function(selectukeyInd) {
            //key里边   个人or机构==0         返回出去1是机构   2是个人
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(4)==0?"1":"2";
            }
        },
        // ConnectKey:function(dwKeyIndex, bandRates) {//检测ukey
        //     //console.log(JSON.stringify())
        //     return this.data.KeyManage.ConnectKey()
        // },
        SetPIN: function(PassWord) {
            if (this.issupport()) {
                return this.data.KeyManage.SetPIN(PassWord);
            }
        },
        ChangePIN: function(PINType, oldPIN, newPIN) {
            if (this.issupport()) {
                return this.data.KeyManage.ChangePIN({
                    PINType: PINType,
                    oldPIN: oldPIN,
                    newPIN: newPIN
                });
            }
        },
        GetKeyID: function(PassWord) {
            if (this.issupport()) {
                return this.data.KeyManage.GetKeyID();
            }
        },
        GetOid: function(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                //this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(1);
            }
        },
        GetenterpriseCode: function(selectukeyInd) {
            if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return this.data.ukey.GetCertInfo(8);
            }
        },
        WriteSignDataToKey: function(WriteSignDataToKeyText) {
            if (this.issupport()) {
                return this.data.KeyManage.WriteSignDataToKey(
                    WriteSignDataToKeyText
                );
            }
        },
        //获取证书厂商
        certificateFirms: function(selectukeyInd){
        	if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
//              var arrKeyOEM = new Array("GDCA","NETCA","SZCA","BJCA","未知");
//				1.GDCA、2.NETCA、3.SZCA、4.BJCA
                return this.data.ukey.GetCertInfo(7)-0+1;
            }
        },
        //获取数字证书颁发者信息
        getCertIssuer:function(selectukeyInd){
        	if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return JSON.parse(this.data.ukey.GetCertInfo(14));
            }
        },
        //获取证书拥有者信息
        getCertOwner:function(selectukeyInd){
        	if (selectukeyInd !== undefined && this.issupport()) {
                this.data.ukey.SetCertIndex(selectukeyInd);
                return JSON.parse(this.data.ukey.GetCertInfo(13));
            }
        },
        trustId:function(selectukeyInd){ //GDCA 信任号；
	        if (this.issupport()) {
	            this.data.ukey.SetCertIndex(selectukeyInd);
	            return this.data.ukey.GetCertInfo(12);
	        }
	    },
        WriteSignDataToKeyText: "<Signature>" +
            "<Sign>" +
            "<SignName>电子印章测试专用章(5)</SignName>" +
            "<SignCompany>深圳市创业印章科技有限公司</SignCompany>" +
            "<SignCode>e440301000412</SignCode>" +
            "<KeySN>C1146035</KeySN>" +
            "<SignType>单位专用章</SignType>" +
            "<SignState>False</SignState>" +
            "<SignTime>2018-05-25 12:00:00</SignTime>" +
            "<SignImage>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</SignImage>" +
            "<Width>629</Width>" +
            "<Height>629</Height>" +
            "<Ckid>7e32139a-82cb-4346-9829-2d12af1e4f69</Ckid>" +
            "</Sign>" +
            "</Signature>"
    };
    ukeys.ukeyInit();

    return ukeys;
});