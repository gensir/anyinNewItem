define([
    "text!./tpl/update_key.html",
    "text!../pub/tpl/footer.html",
    "text!../pub/tpl/dialog.html",
    "../../../app/lib/service",
    "../../lib/ukeys",
    "../../lib/cert",
    "../../lib/netca",
    "bootbox"
], function (tpl, primary, dialog, service, ukeys, certUtil, netca, bootbox) {
    var template = require('art-template');
    var dialogs = $(dialog);
    var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
    var that, year, orderNo, realdata, keyStyle ,time;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize: function () { },
        events: {
            'click .update #updatekey': 'check'
        },
        render: function (query) {
        	localStorage.removeItem("ODCchoice");
        	localStorage.removeItem("u_keyType");
        	localStorage.removeItem("u_certificateFirm");
            that = this;
            that.updataInfo();
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        },
        getDates: function (year) {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hours = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (hours >= 0 && hours <= 9) {
                hours = "0" + hours;
            }
            if (min >= 0 && min <= 9) {
                min = "0" + min;
            }
            if (sec >= 0 && sec <= 9) {
                sec = "0" + sec;
            }
            var str = seperator1 + month + seperator1 + strDate
                + " " + hours + seperator2 + min
                + seperator2 + sec;
            var currentdate1 = date.getFullYear() + str;
            var currentdate2 = date.getFullYear() - 0 + year + str;
            var arr = [];
            arr[0] = currentdate1;
            arr[1] = currentdate2;
            return arr;
        },
        changeDate: function (date1, date2, year) {
            var str1 = date1.split("-")[0] - 0 + year; //2017
            var str3 = date1.split("-")[1];    //12
            var str5 = date1.split("-")[2];    //13 17:40:18
            var str2 = date2.split("-")[0] - 0 + year;
            var str4 = date2.split("-")[1];
            var str6 = date2.split("-")[2];
            str1 = str1 + "-" + str3 + "-" + str5;
            str2 = str2 + "-" + str4 + "-" + str6;
            var arr = [];
            arr[0] = str1;
            arr[1] = str2;
            return arr;
        },
        getUrlParam: function (name) {
            var after = window.location.hash.split("?")[1];
            if (after) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = after.match(reg);
                if (r != null) {
                    return decodeURIComponent(r[2]);
                } else {
                    return null;
                }
            }
        },
        updataInfo: function () {
            var firmId = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId);
            var orgCode = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode);
            var enterpriseName = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username);
            var oid = that.getUrlParam("oid"); 
            keyStyle = that.getUrlParam("keyType")||localStorage.u_keyType;
            var data = {
                "firmId": firmId,
                "orgCode":orgCode,
                "enterpriseName":enterpriseName,
                "oid" : oid,
                "esealCode" : that.getUrlParam("esealcode")
            };
            service.getListByOrderNo(data).done(function (res) {
                if (res.code == 0) {
                	var result = res.data;
                	if(!result.mpEsealOrderExtChangeVO){
                        bootbox.dialog({
                            backdrop: true,
                            closeButton: false,
                            className: "common unlock",
                            title: "证书更新",
                            // message:"订单内查询不到印章信息,请到订单中心进行更新证书操作！",
                            message: '<div class="msgcenter"><em></em><span>查询不到印章信息，请到印章管理中进行更新证书！</span></div',
                            buttons:{
                                // cancel: {
                                //     label: "取消",
                                //     className: "btn1",
                                //     callback: function (result) {
                                //         //console.log(result, "cancel")
                                //         result.cancelable = false;
                                //     }
                                // },
                                confirm:{
                                    label: "确定",
                                    className: "btn2",
                                    callback: function (event) {
                                        window.location = "admin.html";
                                    }
                                }
                            }
                        });
                        return;
                    }
                    year = result.mpEsealOrderExtChangeVO.effectiveDuration;
                    if(result.mpEsealOrderExtChangeVO.validStart&&result.mpEsealOrderExtChangeVO.oldValidStart){
                    	result.mpEsealOrderExtChangeVO.validStart = '';
                    }
                    time = result.mpEsealOrderExtChangeVO.validEnd.split("-")[0];
                    orderNo = result.mpEsealOrderExtChangeVO.orderNo;
                    that.$el.html(template.compile(tpl)({ data: result }));
                } else {
                    bootbox.alert(res.msg)
                }
            })
        },
        check:function(){
        	if(localStorage.u_keyType==2&&localStorage.u_certificateFirm==2){
            	var data={};
            	data.oid = this.getUrlParam("oid");
            	data.esealCode = this.getUrlParam("esealcode");
            	data.caType = localStorage.u_certificateFirm;
            	data.keyType= localStorage.u_keyType;
            	service.check_cert_valid(data).done(function(res){
            		if(res.code==0){
            			if(res.data.pointCode==5){
            				bootbox.alert("该电子印章已过期，请前往电子印章受理门店办理续期业务");
            				return;
            			}
            		}else{
            			bootbox.alert(res.msg);
            			return;
            		}
            		that.updatekey();
            	})
            }else{
            	that.updatekey();
            }
        },
        updatekey: function () {
            if (!ukeys.issupport()) {
                return false;
            }
            
            var that = this;
            var numInd = 0;
            var dialogsText = dialogs.find(".unlock");
            bootbox.hideAll();
            bootbox.dialog({
                backdrop: true,
                closeButton: false,
                className: "common unlock",
                title: "证书更新",
                message: dialogsText.find(".msgcenter")[0].outerHTML,
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn1",
                        callback: function (result) {
                            //console.log(result, "cancel")
                            result.cancelable = false;
                        }
                    },
                    confirm: {
                        label: "继续",
                        className: "btn2",
                        callback: function (event) {
                            numInd++;
                            var _this = this;
                            var certificateFirms;
                            var realdata;
                            var oid;
                            if (numInd == 1) {
                                var msg4 = dialogsText.find(".msg4")[0].outerHTML;
                                $(this).find(".bootbox-body").html(msg4);
                                $(this).find(".btn1,.btn2").hide();
                                setTimeout(function () {
                                    if (!ukeys.ukeyName().length) {
                                        numInd = 0;
                                        var msg3 = dialogsText.find(".msg3")[0].outerHTML;
                                        $(_this).find(".bootbox-body").html(msg3);
                                        $(_this).find(".btn1,.btn2").show();
                                        $(_this).find(".btn2").show().html("重试");
                                    } else {
                                        var msg6 = dialogsText.find(".msg6")[0].outerHTML;
                                        $(_this).find(".bootbox-body").html(msg6);
                                        $.each(ukeys.ukeyName(), function (ind, val) {
                                            $("#seleBook").append("<Option value='ind'>" + val + "</Option>");
                                        });
                                        $(_this).find(".btn1,.btn2").show();
                                        $(_this).find(".btn2").show().html("继续");
                                    }
                                }, 1000);
                            } else if (numInd == 2) {
                                var selectedUkey = $("#seleBook option:selected").val();
                                var unlockCode = $("#unlockCode").val();
                                if (selectedUkey == "") {
                                    numInd = 1;
                                    $(_this).find("#seleBook-error").html("请选择一个证书");
                                    $(_this).find(".btn2").show().html("继续");
                                    $("#seleBook").change(function () {
                                        $("#seleBook-error").html("");
                                    });
                                } else if (unlockCode.length < 6) {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("请输入6位或6位以上的PIN码");
                                    $(_this).find(".btn2").show().html("继续");
                                    $("#unlockCode").keyup(function () {
                                        $("#unlock-error").html("");
                                    });
                                } else {
                                    if(!ukeys.GetCertCount()){
                                        numInd = 1;
                                        $(_this).find("#unlock-error").html("未检测到ukey,请插入ukey后重试");
                                        $(_this).find(".btn2").show().html("重试");
                                        return false;
                                    }
                                    certificateFirms = ukeys.certificateFirms(selectedUkey);
                                    selectedUkey = $("#seleBook option:selected").index() - 1;
                                    localStorage.selectedUkey = selectedUkey;
                                    oid = ukeys.GetOid(selectedUkey);
                                    var oidUrl = that.getUrlParam("oid");
                                    if (oid == oidUrl) {
                                        if (ukeys.PIN($("#unlockCode").val(), selectedUkey)) {
                                            //如果pin正确
                                            numInd = 2;
                                            $(_this).find("#seleBook,#unlockCode").attr("disabled", true);
                                            $(_this).find("#unlock-error").html("正在读取UKEY内容，请稍候……");
                                            $(_this).find(".btn2").attr("disabled", true);
                                            var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1 : 2;

                                            if (keyType==1) {
                                                //ODC新办
                                                var oid = ukeys.GetOid(selectedUkey);
                                                var issuer = ukeys.getCertIssuer(selectedUkey).certCn;
                                                var certificateAssigned = ukeys.CertType(selectedUkey) - 0;
                                                var signCertificateSn = ukeys.getCertSignSN(selectedUkey);
                                                var encryptCertificateSn = ukeys.getCertEncSN(selectedUkey);
                                                var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
                                                var enterpriseName = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username;
                                                realdata = {
                                                    "orderNo": orderNo,
                                                    "validStart": $(".vaildStart .new").text(),
                                                    "validEnd": $(".validEnd .new").text(),
                                                    "esealCode": $(".esealCode .new").text() || $(".esealCode .text").text(),
                                                    "oid": oid,
                                                    "enterpriseCode": enterpriseCode,
                                                    "enterpriseName": enterpriseName,
                                                    "issuer": issuer,                             //数字证书颁发者
                                                    "certificateFirms": certificateFirms,                        //证书厂商
                                                    "certificateType": keyType,                                //证书类型 
                                                    "certificateAssigned": certificateAssigned,                     //数字证书归属者
                                                    "signCertificateSn": signCertificateSn,    //签名证书序列号
                                                    "encryptCertificateSn": encryptCertificateSn  //加密证书序列号
                                                }
                                                if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
                                                    $(_this).find(".btn2").hide();
                                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缺少必填项,电子印章续期失败！");
                                                    return false;
                                                }

                                                service.write_cert_GDCA(realdata).done(function (res) {
                                                    if (res.code == 0) {
                                                        numInd = 3;
                                                        $(_this).find(".btn1").hide();
                                                        $(_this).find(".btn2").html("确定").attr("disabled", false);
                                                        $(_this).find(".bootbox-body").addClass("isreload").html("<div class='msg5 success'>ODC新办电子印章成功！</div>");
                                                    } else {
                                                        $(_this).find("#unlock-error").html(res.msg);
                                                        $(_this).find(".btn2").hide();
                                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text(res.msg);
                                                    }
                                                });
                                            } else if(keyType==2){
                                                //anyin续期
                                                if (certificateFirms == 1) {
                                                    //GDCA证书
                                                    var renew;
                                                    if (year == 2) {
                                                        renew = "RENEW"
                                                    } else {
                                                        renew = "RENEW_" + year;
                                                    }
                                                    var certificateAssigned = ukeys.CertType(selectedUkey) - 0;
                                                    var dataGDCA = {
                                                        orderNo: orderNo,
                                                        esealCode : $(".esealCode .new").text()||$(".esealCode .text").text(),
                                                        keyEnd: ukeys.endDate(selectedUkey),
                                                        gdcaRequest: {
                                                            trustId: ukeys.trustId(selectedUkey),
                                                            cn: ukeys.getCertOwner(selectedUkey).certCn,
                                                            c: 'CN',
                                                            publicKey: ukeys.dCertPublicKey(selectedUkey),
                                                            orgCode: ukeys.GetenterpriseCode(selectedUkey),
                                                            busyType: renew,//默认更新两年时为RENEW，当为其他年份时用下划线隔开，ef:RENEW_3
                                                            certType: certificateAssigned
                                                        }
                                                    };
                                                    var newDate = /[0-9]{4}/.exec(ukeys.endDate(selectedUkey))[0];//key里面的时间
                                                    if(newDate>=time ){//如果key里面的年和接口返回的年一样
                                                        numInd = 8;
                                                        $(_this).find("#unlock-error").html("请点击继续按钮，完成后续操作！");
                                                        $(_this).find(".btn2").html("继续").show().attr("disabled", false);
                                                    }else{
                                                        
                                                        service.renew_certGDCA(dataGDCA).done(function (ret) {
                                                            if (ret.code == 0) {
                                                                numInd = 8;
                                                                window.open(ret.data, '_blank');
                                                                $(_this).find("#unlock-error").html("请在弹出的新窗口内更新证书，完成后请点击继续！");
                                                                $(_this).find(".btn2").html("继续").show().attr("disabled", false);
                                                            }else if(ret.code == 40035){
                                                                numInd = 8;
                                                                $(_this).find("#unlock-error").html("请点击继续按钮，完成后续操作！");
                                                                $(_this).find(".btn2").html("继续").show().attr("disabled", false);
                                                            } else {
                                                                numInd = 1;
                                                                $(_this).find("#unlock-error").html(ret.msg);
                                                                $(_this).find(".btn2").show().html("重试").attr("disabled", false);
                                                            }
                                                        })
                                                    }

                                                } else if (certificateFirms == 2) {
                                                    //netCA   首先判断是否能进行换体续期调3035接口-->调3054接口获取签名原文进行签名，得到得userSignature作为续期接口得入参-->调用3031续期接口
                                                    var getPIN = $("#unlockCode").val(), selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
                                                    if (ukeys.PIN(getPIN, selectedUkey)) {
                                                        if (!($(".esealCode .text").text() == ukeys.esealCode(getPIN, selectedUkey))) {
                                                            numInd = 0;
                                                            $(_this).find("#unlock-error").html("您选择的UKEY与续费的印章不符，请更换UKEY后重试！");
                                                            $(_this).find(".btn2").show().html("重试").attr("disabled", false);
                                                            return false;
                                                        }
                                                        function netcaFun(isNeedChangeCert,data){
                                                        	service.renewNetca(data).done(function(ret){
                                                        		if(ret.code==0){
                                                        			if (!(ret.data.bpmsResponse.certInfo && Object.keys(ret.data.bpmsResponse.certInfo).length != 0)) {
					                                                    window.bootbox.alert({
					                                                        size: "small",
					                                                        title: "提示",
					                                                        message:
					                                                        ret.data.bpmsResponse.responseResult.msg,
					                                                        callback: function () {
					                                                            /* your callback code */
					                                                        }
					                                                    });
					                                                    return;
					                                                }
                                                        			if (isNeedChangeCert && !(netca.delCert() == "deleSuccess")) {
				                                                        //如果删除成功，就写入证书；
				                                                        window.bootbox.alert({
				                                                            size: "small",
				                                                            title: "提示",
				                                                            message:
				                                                            "删除旧证书失败，无法写入新证书",
				                                                            callback: function () {
				                                                                /* your callback code */
				                                                            }
				                                                        });
				                                                        return;
				                                                    }
                                                        			var correctData = ret.data.bpmsResponse;
					                                                var write_cert = {
					                                                    certEnc: "",
					                                                    certSign: "",
					                                                    encPair: ""
					                                                };
					                                                $.each(correctData.certInfo, function (i, v) {
					                                                    if (v.certUsage == 1) {
					                                                        write_cert.certEnc = v.certContent;
					                                                        write_cert.encPair = v.enckeyPair || "";
					                                                    } else if (v.certUsage == 2) {
					                                                        write_cert.certSign = v.certContent;
					                                                    }
					                                                });
					                                                var obj={
                                                                        "reqId":ret.data.bpmsResponse.reqId,
                                                                        "orderNo":orderNo,
                                                                        "signCertContent": ukeys.getSignatureCert(selectedUkey),//write_cert.certSign,
                                                                        "esealCode":$(".esealCode .text").text()
                                                                    }
					                                                netca.installCa(write_cert);
				                                                    if (netca.installCa(write_cert) == "NetcaWriteSuccess") {
                                                                        service.netcaCallBack(obj).done(function(res){
                                                                            if(res.code==0){
                                                                                numInd = 3;
                                                                                $(_this).find(".btn1").hide();
                                                                                $(_this).find(".btn2").html("确定").attr("disabled", false);
                                                                                $(_this).find(".bootbox-body").addClass("isreload").html("<div class='msg5 success'>电子印章续期成功！</div>");
                                                                            }else{
                                                                                numInd = 1;
                                                                                $(_this).find(".btn1").hide();
                                                                                $(_this).find(".btn2").html("重试").attr("disabled", false);
                                                                                $(_this).find(".bootbox-body").addClass("isreload").html("<div class='msg5 success'>电子印章续期失败！</div>");
                                                                            }
                                                                        }) 
					                                                } 
                                                        		}else{
                                                        			$(_this).find("#unlock-error").html(ret.msg);
                                                        		}
                                                        	})
                                                        }
                                                        function inRenewFun(p10, symmAlgo, isNeedChangeCert) {
                                                            var data = {
                                                                oid: ukeys.GetOid(selectedUkey),
                                                                orderNo: orderNo,
                                                                esealCode: $(".esealCode .text").text(),
                                                                signCertContent: ukeys.getSignatureCert(selectedUkey),
                                                                year: year,
                                                                p10: p10 ? p10 : 'p10',
                                                                symmAlgo: symmAlgo ? symmAlgo : 12345678,
                                                                isChangeBody:isNeedChangeCert?1:0
                                                            };
                                                            service.getPlaintext(data).done(function (ret) {
                                                            	if (typeof ret !== "string") {
				                                                    ret = JSON.stringify(ret)
				                                                }
                                                            	data.userSignature = netca.signData(ret);
                                                            	var ret = JSON.parse(ret);
                                                                netcaFun(isNeedChangeCert,data);
                                                            });
                                                        }
                                                        var data = {
                                                            signCertContent: ukeys.getSignatureCert(selectedUkey)
                                                        };
                                                        service.isNeedChangeCert(data).done(function (ret) {
                                                        	if(ret.code==0){
                                                        		var isNeedChangeCert=ret.data
                                                        		if(ret.data){
                                                        			var jsonVal = certUtil.getCertInfo(ukeys.dCertificate(selectedUkey));
	                                                                var p10 = jsonVal && netca.buildParamForRequestCa(jsonVal)["p10"];
	                                                                var symmAlgo = netca.getSymmAlgo();
                                                        		}else{
                                                        			var p10 = "p10",symmAlgo = 12345678;
                                                        		}
                                                        	}else{
                                                        		bootbox.alert(ret.msg);
                                                        	}
                                                            inRenewFun(p10, symmAlgo, isNeedChangeCert);
                                                        });
                                                        
                                                    } else {
                                                        numInd = 1;
                                                        $(_this).find("#writezm-error").html("PIN码不正确，请重试");
                                                        $(_this).find(".btn2").show().html("重试");
                                                    }
                                                }
                                            }
                                        } else {
                                            numInd = 1;
                                            var GetOid = ukeys.GetOid(selectedUkey);
                                            var data = {
                                                oid: GetOid,
                                                errorCode: 1
                                            };
                                            service.checkPIN(data).done(function (data) {
                                                if (data.code == 1) {
                                                    $(_this).find("#unlock-error").html(data.msg);
                                                    $(_this).find(".btn2").show().html("重试");
                                                }
                                                $("#unlockCode").change(function () {
                                                    $("#unlock-error").html("");
                                                });
                                            });
                                        }
                                    } else {
                                        numInd = 0;
                                        $(_this).find("#unlock-error").html("您选择的UKEY不正确，请更换UKEY后重试！");
                                        $(_this).find(".btn2").show().html("重试");
                                    }
                                }
                            } else if (numInd == 9) {
                                var selectedUkey = localStorage.selectedUkey;
                                var oldDate = Number(/[0-9]{4}/.exec($(".validEnd .text").text())),
                                    newDate = /[0-9]{4}/.exec(ukeys.endDate(0))[0];
                                if (newDate <= oldDate) {
                                	numInd = 0;
//                                  $(_this).find(".btn2").hide();
                                    $(_this).find(".bootbox-body").addClass("isreload").html("<div class='msg4'>证书时间未更新，电子印章续期失败！</div>");
                                    return false;
                                }
                                $(_this).find(".btn2").attr("disabled", true);
                                var certificateAssigned = ukeys.CertType(selectedUkey) - 0;
                                var oid = that.getUrlParam("oid");
                                var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1 : 2;
                                var issuer = ukeys.getCertIssuer(selectedUkey).certCn;
                                
                                var certificateFirms = ukeys.certificateFirms(selectedUkey);
                                var signCertificateSn = ukeys.getCertSignSN(selectedUkey);
                                var encryptCertificateSn = ukeys.getCertEncSN(selectedUkey);
                                var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
                                var enterpriseName = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username;
                                realdata = {
                                	"orderNo":orderNo,
                                    "validStart": $(".vaildStart .text").text(),
                                    "validEnd": $(".validEnd .new").text(),
                                    "esealCode": $(".esealCode .text").text(),
                                    "oid": oid,
                                    "businessType": "2",
                                    "enterpriseCode": enterpriseCode,
                                    "enterpriseName": enterpriseName,
                                    "issuer": issuer,                             //数字证书颁发者
                                    "certificateFirms": certificateFirms,                        //证书厂商
                                    "certificateType": keyType,                                //证书类型 
                                    "certificateAssigned": ukeys.CertType(selectedUkey) - 0,                     //数字证书归属者
                                    "signCertificateSn": signCertificateSn,    //签名证书序列号
                                    "encryptCertificateSn": encryptCertificateSn  //加密证书序列号
                                };
                                if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
                                    $(_this).find(".btn2").hide();
                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缺少必填项,电子印章续期失败！");
                                    return false;
                                }
                                service.write_cert_GDCA(realdata).done(function (res) {
                                    if (res.code == 0) {
                                        $(_this).find(".btn2").attr("disabled", false);
                                        numInd = 3;
                                        $(_this).find(".btn1").hide();
                                        $(_this).find(".btn2").html("确定");
                                        $(_this).find(".bootbox-body").html("<div class='msg4'>电子印章续期成功</div>");
                                    } else {
                                        $(_this).find(".btn2").attr("disabled", false);
                                        numInd = 0
                                        $(_this).find(".btn2").html("重试");
                                        $(_this).find(".bootbox-body").html("<div class='msgcenter'><em></em>" + res.msg + "</div>");
                                    }
                                });
                            } else if(numInd == 4) {
                                this.modal('hide')
                                window.location.href = "admin.html";
                            } 
                            //                            this.modal('hide');
                            return false;
                        }
                    }
                }
            });
        }
    });
    return main;
});