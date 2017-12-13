define([
	"text!./tpl/update_key.html",
	"text!../pub/tpl/footer.html",
	"text!../pub/tpl/dialog.html",
	"../../../app/lib/service",
	"../../lib/ukeys",
	"../../lib/cert",
	"../../lib/netca",
	"bootbox"
], function(tpl, primary,dialog, service,ukeys,certUtil,netca,bootbox) {
	var template = require('art-template');
	var dialogs = $(dialog);
	var that;
	var main = Backbone.View.extend({
		el: '.contents',
		initialize:function() {},
		events: {
			'click .update #updatekey': 'updatekey'
		},
		render: function (query) {
			that = this;
			this.updataInfo();
			var certOn=ukeys.getCertIssuer(0);
	        
	        document.body.scrollTop = document.documentElement.scrollTop = 0;
	    },
	    getDate:function(year){
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
		    var currentdate2 = date.getFullYear()-0+ year + str;      
		    var arr=[];
		    arr[0]=currentdate1;
		    arr[1]=currentdate2;
		    return arr;
	    },
        getUrlParam: function(name) {
			var after = window.location.hash.split("?")[1];
			if(after) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = after.match(reg);
				if(r != null) {
					return decodeURIComponent(r[2]);
				} else {
					return null;
				}
			}
		},
		updataInfo:function(){
			var orderNo = this.getUrlParam("orderNo");
			var firmId = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId);
			var data={
				"orderNo":"APPLY12051278482404",
				"firmId":440305438270
			}
			service.getListByOrderNo(data).done(function(res){
				if(res.code==0){
//					that.$el.html(tpl);
					
					var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
					var result = res.data;
					var year = result.mpEsealOrderExtChangeVO.effectiveDuration||2;
//					if(isODC){
						result.mpEsealOrderExtChangeVO.validStart=that.getDate(year)[0];
						result.mpEsealOrderExtChangeVO.validEnd=that.getDate(year)[1];
//					}
					that.$el.html(template.compile(tpl)({ data: result }));
				}else{
					bootbox.alert(res.msg)
				}
			})
		},
		updatekey: function(){
			if (!ukeys.issupport()) {
                return false;
            }
			var that = this;
            var numInd = 0;
            var dialogsText = dialogs.find(".unlock");
            bootbox.hideAll();
            bootbox.dialog({
                backdrop: true,
                //closeButton: false,
                className: "common unlock",
                title: "证书更新",
                message: dialogsText.find(".msg1.msg0")[0].outerHTML,
                buttons: {
                    cancel: {
                        label: "取消",
                        className: "btn1",
                        callback: function(result) {
                            //console.log(result, "cancel")
                            result.cancelable = false;
                        }
                    },
                    confirm: {
                        label: "继续",
                        className: "btn2",
                        callback: function(event) {
                            numInd++;
                            var _this = this;
                            var certificateFirms;
                            var selectedUkey,oid;
                            if (numInd == 1) {
                            	var msg4 = dialogsText.find(".msg4")[0].outerHTML;
                                $(this).find(".bootbox-body").html(msg4);
                                $(this).find(".btn1,.btn2").hide();
                                setTimeout(function() {
                                    if (!ukeys.ukeyName().length) {
                                        numInd = 0;
                                        var msg3 = dialogsText.find(".msg3")[0].outerHTML;
                                        $(_this).find(".bootbox-body").html(msg3);
                                        $(_this).find(".btn1,.btn2").show();
                                        $(_this).find(".btn2").show().html("重试");
                                    } else {
                                        var msg6 = dialogsText.find(".msg6")[0].outerHTML;
                                        $(_this).find(".bootbox-body").html(msg6);
                                        $.each(ukeys.ukeyName(), function(ind,val) {
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
                                    $("#seleBook").change(function() {
                                        $("#seleBook-error").html("");
                                    });
                                } else if (unlockCode.length < 6) {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("请输入6位以上的PIN码");
                                    $(_this).find(".btn2").show().html("继续");
                                    $("#unlockCode").keyup(function() {
                                        $("#unlock-error").html("");
                                    });
                                } else {
                                	certificateFirms = ukeys.certificateFirms(selectedUkey);
                                    selectedUkey = $("#seleBook option:selected").index() - 1;
                                    oid = ukeys.GetOid(selectedUkey);
                                    var oidUrl=that.getUrlParam("oid");
                                    if(true){
                                    	if (ukeys.PIN($("#unlockCode").val(),selectedUkey)) {
                                    		//如果pin正确
                                    		var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                                    		if(isODC){  //ODC新办
                                    			var oid = ukeys.GetOid(selectedUkey);
				                                var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1: 2;
												var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
												var enterpriseName = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username;
												var realdata={
													"validStart":$(".vaildStart .new").val()||$(".vaildStart .text").val(),
													"validEnd":$(".vaildEnd .new").val()||$(".vaildEnd .text").val(),
													"esealCode":$(".esealCode .text").val(),
													"oid":oid,
													"enterpriseCode":enterpriseCode,
													"enterpriseName":enterpriseName,
													"issuer":ukeys.getCertIssuer(selectedUkey).certCn,                             //数字证书颁发者
													"certificateFirms":ukeys.certificateFirms(selectedUkey),                        //证书厂商
													"certificateType":keyType,                                //证书类型 
													"certificateAssigned":ukeys.CertType(selectedUkey),                     //数字证书归属者
													"signCertificateSn":ukeys.getCertSignSN(selectedUkey),    //签名证书序列号
													"encryptCertificateSn": ukeys.getCertEncSN(selectedUkey)  //加密证书序列号
												}
												if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
				                                    $(_this).find(".btn2").hide();
				                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缺少必填项,电子印章续期失败！");
				                                    return false;
				                                }
				                                service.write_cert_GDCA(realdata).done(function(res) {
				                                    if (res.code == 0) {
				                                        $(_this).find(".btn2").hide();
				                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("电子印章续期成功！");
				                                    } else {
				                                        $(_this).find(".btn2").hide();
				                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text(res.msg);
				                                    }
				                                });
                                    		}else{    //anyin续期
                                    			if(certificateFirms==1){    //GDCA
	                                    			var dataGDCA = {
			                                            orderNo: "",
			                                            gdcaRequest: {
			                                                trustId: ukeys.trustId(selectedUkey),
			                                                cn: ukeys.getCertIssuer(selectedUkey).certCn,
			                                                c: 'CN',
			                                                publicKey: ukeys.trustId(selectedUkey),
			                                                orgCode: ukeys.GetenterpriseCode(selectedUkey),
			                                                busyType: 'RENEW',//默认更新两年时为RENEW，当为其他年份时用下划线隔开，ef:RENEW_3
			                                                certType: certificateType
			                                            }
			                                        };
			                                        service.renew_certGDCA(dataGDCA).done(function(ret) {
			                                            if (ret.code == 0) {
			                                                window.open(ret.data, '_blank');
			                                                $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("续期成功后请点击继续！");
			                                            } else {
			                                                numInd = 1;
			                                                $(_this).find("#writezm-error").html(ret.msg);
			                                                $(_this).find(".btn2").show().html("重试");
			                                            }
			                                            console.log(ret)
			                                        })
	                                  			}else if(certificateFirms==2){    //netCA
	                                  				ukeys.ChangePin(1, "", "");
	                                  				var getPIN = $("#writezmCode").val(), selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
	                                    			if (ukeys.PIN(getPIN, selectedUkey)) {
					                                    if (!(item.esealCode == ukeys.esealCode(getPIN, selectedUkey))) {
					                                        $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("您插入的UKEY与所选UKEY不符，请重新插入");
					                                        $(_this).find(".btn2").show().html("重试");
					                                        numInd = 0;
					                                        return false;
					                                    }
					                                    function inRenewFun(p10, symmAlgo, isNeedChangeCert) {
					                                        var data = {
					                                            oid: ukeys.GetOid(selectedUkey),
					                                            orderNo: item.orderNo,//"RENEW11090365271661"
					                                            esealCode: item.esealCode,
					                                            signCertContent: ukeys.getSignatureCert(selectedUkey),
					                                            year: item.effectivedeDuration ? item.effectivedeDuration : 2, //待定
					                                            p10: p10 ? p10 : 'p10',
					                                            symmAlgo: symmAlgo ? symmAlgo : 12345678
					                                        };
					                                        service.renew_cert(data).done(function(ret) {
					                                            if (ret.code == 0) {
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
					                                                if (item.caType == 2) {
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
					                                                }
					                                                );
					
					                                                if (netca.installCa(write_cert) == "NetcaWriteSuccess") {
					                                                    var data = {
					                                                        reqId: ret.data && ret.data.bpmsResponse.reqId,
					                                                        orderNo: item.orderNo,
					                                                        signCertContent: write_cert.certSign
					                                                    };
					                                                    service.netcaCallBack(data).done(function(ret) {
					                                                        $(_this).find(".btn2").hide();
					                                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("电子印章续期成功！");
					                                                    });
					                                                }
					                                            } else {
					                                                numInd = 1;
					                                                $(_this).find("#writezm-error").html(ret.msg);
					                                                $(_this).find(".btn2").show().html("重试");
					                                            }
					                                        });
					                                    }
					                                    if (item.caType == 2) {
					                                        var data = {
					                                            signCertContent: ukeys.getSignatureCert(selectedUkey)
					                                        };
					                                        service.isNeedChangeCert(data).done(function(ret) {
					                                            if (ret.data) {
					                                                var jsonVal = certUtil.getCertInfo(
					                                                    ukeys.dCertificate(selectedUkey)
					                                                );
					                                                var p10 = jsonVal && netca.buildParamForRequestCa(jsonVal)["p10"];
					                                                var symmAlgo = netca.getSymmAlgo();
					                                            } else {
					                                                var p10 = "p10",
					                                                    symmAlgo = 12345678,
					                                                    isNeedChangeCert = ret.data;
					                                            }
					                                            inRenewFun(p10, symmAlgo, isNeedChangeCert);
					                                        });
					                                    } else if (item.caType == 1) {
					                                        var dataGDCA = {
					                                            orderNo: item.orderNo,
					                                            gdcaRequest: {
					                                                trustId: ukeys.trustId(selectedUkey),
					                                                cn: item.enterpriseName,
					                                                c: 'CN',
					                                                publicKey: ukeys.trustId(selectedUkey),
					                                                orgCode: ukeys.GetenterpriseCode(selectedUkey),
					                                                busyType: item.effectivedeDuration ? 'RENEW_' + item.effectivedeDuration : 'RENEW',
					                                                certType: item.caType
					                                                // contact: {
					                                                //     ctName: 'wt',
					                                                //     ctCertificate: '430989199011001100'
					                                                // }
					                                            }
					                                        };
					                                        service.renew_certGDCA(dataGDCA).done(function(ret) {
					                                            if (ret.code == 0) {
					                                                window.open(ret.data, '_blank');
					                                                $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("续期成功后请点击继续！");
					                                            } else {
					                                                numInd = 1;
					                                                $(_this).find("#writezm-error").html(ret.msg);
					                                                $(_this).find(".btn2").show().html("重试");
					                                            }
					                                            console.log(ret)
					                                        })
					                                    }
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
	                                        localStorage.GetOid = GetOid;
	                                        var data = {
	                                            oid: GetOid,
	                                            errorCode: 1
	                                        };
	                                        service.checkPIN(data).done(function(data) {
	                                            if (data.code == 1) {
	                                                $(_this).find("#unlock-error").html(data.msg);
	                                                $(_this).find(".btn2").show().html("重试");
	                                            }
	                                            $("#unlockCode").change(function() {
	                                                $("#unlock-error").html("");
	                                            });
	                                        });
	                                    }
                                    }else{
                                    	numInd = 1;
                                    }
                                }
                            }else if (numInd == 3) {
                        		var oid = ukeys.GetOid(selectedUkey);
                                var keyType = ukeys.getCertType(selectedUkey) == 1 ? 1: 2;
								var enterpriseCode = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.enterpriseCode;
								var enterpriseName = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.username;
								var realdata={
									"validStart":$(".vaildStart .new").val()||$(".vaildStart .text").val(),
									"validEnd":$(".vaildEnd .new").val()||$(".vaildEnd .text").val(),
									"esealCode":$(".esealCode .text").val(),
									"oid":oid,
									"enterpriseCode":enterpriseCode,
									"enterpriseName":enterpriseName,
									"issuer":ukeys.getCertIssuer(selectedUkey).certCn,                             //数字证书颁发者
									"certificateFirms":ukeys.certificateFirms(selectedUkey),                        //证书厂商
									"certificateType":keyType,                                //证书类型 
									"certificateAssigned":ukeys.CertType(selectedUkey),                     //数字证书归属者
									"signCertificateSn":ukeys.getCertSignSN(selectedUkey),    //签名证书序列号
									"encryptCertificateSn": ukeys.getCertEncSN(selectedUkey)  //加密证书序列号
								}
								if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
                                    $(_this).find(".btn2").hide();
                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缺少必填项,电子印章续期失败！");
                                    return false;
                                }
                                service.write_cert_GDCA(realdata).done(function(res) {
                                    if (res.code == 0) {
                                        $(_this).find(".btn2").hide();
                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("电子印章续期成功！");
                                    } else {
                                        $(_this).find(".btn2").hide();
                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text(res.msg);
                                    }
                                });
                            }

                            //this.modal('hide');
                            return false;
                        }
                    }
                }
            });
		}
	});
	return main;
});