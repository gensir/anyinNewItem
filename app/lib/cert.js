
var ActiveXObject = window.ActiveXObject, utils;
//依赖网证通NetcaPki NetcaRAClientCom控件(安装客户端即可)，依赖json2.js
var certUtil = (function () {
    /*设备标志*/
    var NETCAPKI_DEVICETYPE_ANY = -1;
    var NETCAPKI_DEVICEFLAG_CAN_INSTALL_CERT = 256;

    //var NETCARACLIENT_ENCODE_BASE64_NO_NL = 1;//为不分行的BASE64编码

    var NETCAPKI_UIFLAG_ALWAYS_UI = 3;//显示UI

    //描述：创建一个ActiveXObject对象 
    function createActiveXObject(str, isAlert) {
        isAlert = (isAlert == undefined) ? true : isAlert;
        try {
            var obj = new ActiveXObject(str);
            if (typeof (obj) == "object") {
                return obj;
            } else {
                if (isAlert == true) {
                    alert("创建" + str + "对象失败，请检查此对象控件是否已成功安装！");
                }
            }
        } catch (e) {
            if (isAlert == true) {
                //alert("创建" + str + "对象失败，请配置IE相关的安全性！" + getErrMsg(e));
            }
        }
    }
    //返回所有的设备对象
    function getAllDevice(type, flag) {
        var utils = null;
        try {
            utils = createActiveXObject("NetcaPki.Utilities");
            var set = utils.CreateDeviceSetObject();
            type = (type) ? type : NETCAPKI_DEVICETYPE_ANY;
            flag = (flag) ? flag : NETCAPKI_DEVICEFLAG_CAN_INSTALL_CERT;
            set.GetAllDevice(type, flag);
            utils = null;
            return set;
        } catch (e) {
            alert(e.message);
            if (utils != null) {
                utils = null;
            }
        }
    }
    //描述：返回所有的设备对象
    function getUserDevice(logSN, isAlert, tips) {
        isAlert = (isAlert == undefined) ? true : isAlert;
        logSN = (logSN) ? logSN : parent.m_logSN;
        tips = (tips) ? tips : "请先插入制证用的设备";
        var set = getAllDevice();
        try {
            var set_len = set.Count;
            if (set_len <= 0) {
                if (isAlert) {
                    alert("请先插入你的设备");
                }
                return null;
            } else {
                var j = 0;
                var temp = 1;
                for (var i = 1; i <= set_len; i += 1) {
                    if (set.Item(i).SerialNumber != logSN) {
                        temp = i;
                        j += 1;
                    }
                }
                if (j == 0) {
                    if (isAlert) {
                        alert(tips);
                    }
                    return null;
                } else if (j == 1) {
                    return set.Item(temp);
                } else {
                    if (isAlert) {
                        alert("只能插入一个业务操作设备！");
                    }
                    return null;
                }
            }
        } catch (e) {
            alert(e.message);
            return null;
        }
    }



    function getDN(E, CN, OU, O, L, S, C) {
        // E-CN-OU-O-L-S-C
        var dn = "";
        var count = 0;
        if (E != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "E=" + E;
            count++;
        }
        if (CN != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "CN=" + CN;
            count++;
        }
        if (OU != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "OU=" + OU;
            count++;
        }
        if (O != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "O=" + O;
            count++;
        }
        if (L != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "L=" + L;
            count++;
        }
        if (S != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "S=" + S;
            count++;
        }
        if (C != "") {
            if (count > 0) {
                dn += ",";
            }
            dn += "C=" + C;
            count++;
        }
        return dn;
    }

    /**
    * 删除证书
    * operatorKeyType：输入参数，不要删除密钥对的 Key的类型。
    * operatorKeySN：输入参数，不要删除密钥对 Key的序列号。
    *	query:变更操作时候，不为null，要删除的旧的证书的条件，为json串
    *	query示例："{\"deleteCertList\":[{\"issuer\":\"308191310B300906035504061302434E310E300C060355040A13054E4554434131353033060355040B132C436C617373422054657374696E6720616E64204576616C756174696F6E204F7267616E697A6174696F6E4341313B3039060355040313324E4554434120436C617373422054657374696E6720616E64204576616C756174696F6E204F7267616E697A6174696F6E4341\",\"sn\":\"0242FAF741F97B61900325465E6541CB\"},{\"issuer\":\"308191310B300906035504061302434E310E300C060355040A13054E4554434131353033060355040B132C436C617373422054657374696E6720616E64204576616C756174696F6E204F7267616E697A6174696F6E4341313B3039060355040313324E4554434120436C617373422054657374696E6720616E64204576616C756174696F6E204F7267616E697A6174696F6E4341\",\"sn\":\"4B77D2A025D87D14A853F8B47A744099\"}]}"
       筛选条件为证书的序列号，和证书的颁发者，分别对应证书属性：NETCA_PKI_CERT_ATTRIBUTE_SN_HEX和NETCA_PKI_CERT_ATTRIBUTE_ISSUER_HEX_ENCODE
    */
    function delCertInDevice(operatorKeyType, operatorKeySN, query) {
        try {
            var key = new ActiveXObject("NetcaRAClientCom.Key");
            key.DelKeypair(operatorKeyType, operatorKeySN, query ? JSON.stringify(query) : 0);
            return "deleSuccess" 
        } catch (e) {
            console.log(e);
            alert(e);
            return;
        }
    }

    /**
     * 根据getDeviceSNAndType得到的设备序列号和设备类型获取 用于的保护加密密钥对的对称密钥（目前主要是只有 SM2 的加密秘钥使用。）
     */
    function getSymmAlgoFromKey(keyType, keySN) {
        var obj = null;
        try {
            if (keySN && keyType) {
                obj = new ActiveXObject("NetcaRAClientCom.Key");
                if (obj.FindKey(keyType, keySN)) {
                    var alg = obj.GetImportKeyPairAlgorithm();
                    return alg;
                }
            }
        } catch (e) {
            alert(e.message);
        }
        return false;
    }

    /**
     *描述：通过设备集筛选并获取证书
     */
    function getCertFromDeviceByCrypto(filter, deviceType, deviceFlag, UI, tips) {
        filter = (filter) ? filter : "(IssuerO='NETCA Certificate Authority'||IssuerO='NETCA')&&CertType='Signature'&&InValidity='True'";
        deviceType = (deviceType) ? deviceType : NETCAPKI_DEVICETYPE_ANY;
        deviceFlag = (deviceFlag) ? deviceFlag : NETCAPKI_DEVICEFLAG_CAN_INSTALL_CERT;
        UI = (UI) ? UI : NETCAPKI_UIFLAG_ALWAYS_UI;
        tips = (tips) ? tips : '请选择证书！';
        var cert = null;
        var deviceSet = null;
        var utils = null;
        try {
            utils = createActiveXObject("NetcaPki.Utilities");
            deviceSet = utils.CreateDeviceSetObject();
            deviceSet.GetAllDevice(deviceType, deviceFlag);
            cert = deviceSet.FindCertificate(filter, UI);
            if (cert == null) {
                alert(tips);
                cert = deviceSet.FindCertificate(filter, UI);
            }
            utils = null;
            return cert;
        } catch (e) {
            alert("获取证书失败。请检查设备。" + e.message);
            utils = null;
            deviceSet = null;
        }
    }

    function getCertInfo(certBase64) {
        var cert = null;

        try {
            utils = createActiveXObject("NetcaPki.Utilities");
            cert = utils.CreateCertificateObject();
            cert.decode(certBase64);
            console.log("证书E项" + cert.SubjectEmail);
            console.log("证书cn项" + cert.SubjectCN);
            console.log("证书ou项" + cert.SubjectOU);
            console.log("证书o项" + cert.SubjectO);
            console.log("证书L项" + cert.SubjectL);
            console.log("证书S项" + cert.SubjectST);
            console.log("证书C项" + cert.SubjectC);
            //console.log("证书hashAlgo项"+cert.SubjectEmail);

            return {
                "certE": cert.SubjectEmail,
                "certCn": cert.SubjectCN,
                "certOu": cert.SubjectOU,
                "certO": cert.SubjectO,
                "certL": cert.SubjectL,
                "certS": cert.SubjectST,
                "certC": cert.SubjectC,
                "hashAlgo": 4
            };
        } catch (e) {
            console.log(e,'getCertInfo');
            cert = null;
        }
        //return cert;
    }

    return {
        createActiveXObject: createActiveXObject,
        getUserDevice: getUserDevice,
        getDN: getDN,
        delCertInDevice: delCertInDevice,
        getCertFromDeviceByCrypto: getCertFromDeviceByCrypto,
        getSymmAlgoFromKey: getSymmAlgoFromKey,
        getCertInfo: getCertInfo
    };
})();
//export default certUtil;
//module.exports = certUtil;