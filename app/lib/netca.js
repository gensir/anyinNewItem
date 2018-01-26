define([
	"./cert"
],function(certUtil){
	/**
     *      如果是true，则优先产生2048位的密钥对，如果生成不了，则产生1024位密钥对，再不行，则是出错，直接返回
     *      如果是false，则直接产生1024位密钥对，如果生成不了，则出错，直接返回。
     */
    var keypairLengthFlag = true;

    /**
     * 对原文签名
     * @param plainText
     * @returns
     */
    function signData(plainText) {

        var cert = certUtil.getCertFromDeviceByCrypto(null, null, null, null, null);
        //var plainText = '{"cert":{"certSN":"4e3fc52d7ecd488af2b68a2035af296b","interval":12,"issuer":"30818D310B300906035504061302434E310E300C060355040A13054E4554434131333031060355040B132A436C617373422054657374696E6720616E64204576616C756174696F6E20496E646976696475616C434131393037060355040313304E4554434120436C617373422054657374696E6720616E64204576616C756174696F6E20496E646976696475616C4341"},"linkman":{"email":"zhangsan@cnca.net","identity":"12345","identityType":2,"name":"张三","phone":"13512345678"},"memo":"续期1513583657516","systemId":"CYYZCertService"}';

        /*		console.log(cert.ValidFromDate);
        		var endTime = new Date(cert.ValidToDate).getTime();
        		var startTime = new Date(cert.ValidFromDate).getTime();
        		var now = new Date().getTime();
        		if(now < endTime && now > startTime ){*/
        var signature = certUtil.signData(null, null, null, null, null, cert, plainText);
        //}

        return signature;
    }

    /**
     * 1.选择证书
     * 2.通过证书请求后台，判断是否换CA续期
     * 3.是 产生p10，产生symmAlgo
     * 4.请求后台续期接口
     * 5.安装证书
     * 6.删除证书
     */

    /**
     * 选择并获取签名证书
     */
    function getCert() {
        var signCert = certUtil.getCertFromDeviceByCrypto(null, null, null, null, null);
        console.log(signCert);

        // 3不分行的BASE64编码
        var certBase64 = signCert.Encode(3);
        console.log(certBase64);

        certUtil.getCertInfo(certBase64);
        return signCert;
    }

    /**
     *产生symmAlgo 
     */
    function getSymmAlgo() {
        var userDevice = certUtil.getUserDevice();
        if (userDevice != null) {
            var keyType = userDevice.Type; // 设备类型
            var keySN = userDevice.SerialNumber; // 设备SN
            var symmAlgo = certUtil.getSymmAlgoFromKey(keyType, keySN);
            console.log(symmAlgo);
            return symmAlgo;
        }
    }

    /**
     * 产生p10
     * @param jsonObj
     * 	{
     *		"certE" : 证书E项,
     *		"certCn" : 证书cn项,
     *		"certOu" : 证书ou项,
     *		"certO" : 证书o项,
     *		"certL" : 证书l项,
     *		"certS" : 证书s项,
     *		"certC" : 证书c项,
     *		"hashAlgo": 摘要算法（2:sha1, 4:sha256, 6:sha512, 25:sm3）,
     * 	}
     * GenerateP10(dn, keypairType(密钥类型 1:加密,2:签名), keypairAlgo(密钥算法 1:RSA, 7:SM2), keyLength(密钥对长度(RSA:1024||2048, SM2:256)), hashAlgo(摘要算法,同jsonObj));
     * @returns base64编码类型的p10
     */
    function netcaBuildParamForRequestCa(jsonObj) {
        var dn = certUtil.getDN(jsonObj.certE, jsonObj.certCn, jsonObj.certOu, jsonObj.certO, jsonObj.certL, jsonObj.certS, jsonObj.certC);
        // 获取设备
        var userDevice = certUtil.getUserDevice();

        if (userDevice != null) {
            var keyType = userDevice.Type; // 设备类型
            var keySN = userDevice.SerialNumber; // 设备SN
            var p10;
            var hashAlgo = jsonObj.hashAlgo;
            var obj = certUtil.createActiveXObject("NetcaRAClientCom.Key");
            if (!obj.FindKey(keyType, keySN)) {
                alert("请插入要生成密钥对的key[" + keySN + "]");
                return "";
            }

            if (hashAlgo != 2 && hashAlgo != 4 && hashAlgo != 6 && hashAlgo != 25) {
                hashAlgo = 25;
            }

            if (hashAlgo == 25) {
                try {
                    p10 = obj.GenerateP10(dn, 7, hashAlgo, 256);
                } catch (e) {
                    alert("该key不支持SM2");
                    //throw new Error(e);
                }
            } else if (keypairLengthFlag) {
                try {
                    p10 = obj.GenerateP10(dn, 2, hashAlgo, 2048);
                } catch (e) {
                    try {
                        p10 = obj.GenerateP10(dn, 2, hashAlgo, 2048);
                    } catch (e) {
                        alert(e);
                        //throw new Error(e);
                    }
                }
            } else {
                try {
                    p10 = obj.GenerateP10(dn, 2, hashAlgo, 1024);
                } catch (e) {
                    console.log(e, 'error from netca.js');
                    //throw new Error(e);
                }
            }
            return {
                "dn": dn,
                "keyType": keyType,
                "keySN": keySN,
                "p10": p10
            };
        } else {
            alert("没有安装网证通证书驱动");
            //throw new Error("没有安装网证通证书驱动");
        }
    }

    /**
     * 安装证书（包括变更） 
     * @param jsonObj
     * 	{
     *		"certSign" : 签名证书,
     *		"certEnc" : 加密证书,
     *		"encPair" : 加密密钥对,
     * 	}
     * @returns 无
     */
    function netcaInstallCa(jsonObj) {
        var signcert = jsonObj.certSign; // 签名证书
        var enccert = jsonObj.certEnc; // 加密证书
        var enckeypair = jsonObj.encPair; // 加密密钥对
        var type = -1; //
        var userDevice = certUtil.getUserDevice();
        if (userDevice != null) {
            try {
                var obj = certUtil.createActiveXObject("NetcaRAClientCom.Key");
                var keyType = userDevice.Type; // 设备类型
                var keySN = userDevice.SerialNumber; // 设备SN
                if (!obj.FindKey(keyType, keySN)) {
                    alert("请插入要安装证书的key[" + keySN + "]");
                    return "";
                }
                // 不为空更换密钥
                if (enckeypair != null && enckeypair != "") {
                    // 新申请
                    obj.InstallCertAndPrivKey(enccert, signcert, enckeypair);
                } else { // 续期
                    obj.InstallCert(enccert, signcert);
                }
                console.log("NetcaWriteSuccess写入成功")
                return "NetcaWriteSuccess"
            } catch (e) {
                alert("烧录网证通证书失败：" + e.message);
                //throw new Error("烧录网证通证书失败：" + e.message);
            }
        } else {
            alert("没有安装网证通证书驱动");
            //throw new Error("没有安装网证通证书驱动");
        }
    }

    /**
     * 删除证书，建议从后台返回旧的签名和加密证书的颁发者和序列号
     */
    function delCert(deleteCertList) {
        var query = {
            deleteCertList: deleteCertList
        };
        //query 填null时显示所有证书
        var isSuccess = certUtil.delCertInDevice("-1", "-1", null); //query设置为空
        return isSuccess;
    }

    return {
        buildParamForRequestCa: netcaBuildParamForRequestCa,
        installCa: netcaInstallCa,
        delCert: delCert,
        getCert: getCert,
        getSymmAlgo: getSymmAlgo,
        signData: signData
    };
})