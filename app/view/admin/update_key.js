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
			var firmId=firmId = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId);
			var data={
				"orderNo":"RENEW09201990457425",
				"firmId":440305438270
			}
			service.getListByOrderNo(data).done(function(res){
				if(res.code==0){
//					that.$el.html(tpl);
					var result = res.data;
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
                title: "璇佷功鏇存柊",
                message: dialogsText.find(".msg1.msg0")[0].outerHTML,
                buttons: {
                    cancel: {
                        label: "鍙栨秷",
                        className: "btn1",
                        callback: function(result) {
                            //console.log(result, "cancel")
                            result.cancelable = false;
                        }
                    },
                    confirm: {
                        label: "缁х画",
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
                                        $(_this).find(".btn2").show().html("閲嶈瘯");
                                    } else {
                                        var msg6 = dialogsText.find(".msg6")[0].outerHTML;
                                        $(_this).find(".bootbox-body").html(msg6);
                                        $.each(ukeys.ukeyName(), function(ind,val) {
                                            $("#seleBook").append("<Option value='ind'>" + val + "</Option>");
                                        });
                                        $(_this).find(".btn1,.btn2").show();
                                        $(_this).find(".btn2").show().html("缁х画");
                                    }
                                }, 1000);
                            } else if (numInd == 2) {
                                var selectedUkey = $("#seleBook option:selected").val();
                                var unlockCode = $("#unlockCode").val();
                                if (selectedUkey == "") {
                                    numInd = 1;
                                    $(_this).find("#seleBook-error").html("璇烽€夋嫨涓€涓瘉涔);
                                    $(_this).find(".btn2").show().html("缁х画");
                                    $("#seleBook").change(function() {
                                        $("#seleBook-error").html("");
                                    });
                                } else if (unlockCode.length < 6) {
                                    numInd = 1;
                                    $(_this).find("#unlock-error").html("璇疯緭鍏浣嶄互涓奝IN鐮);
                                    $(_this).find(".btn2").show().html("缁х画");
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
                                    		//濡傛灉PIN姝ｇ‘
                                    		debugger;
                                    		var isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
                                    		if(isODC){  //ODC鏂板姙
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
													"issuer":ukeys.getCertIssuer(selectedUkey).certCn,                             //鏁板瓧璇佷功棰佸彂鑰
													"certificateFirms":ukeys.certificateFirms(selectedUkey),                        //璇佷功鍘傚晢
													"certificateType":keyType,                                //璇佷功绫诲瀷 
													"certificateAssigned":ukeys.CertType(selectedUkey),                     //鏁板瓧璇佷功褰掑睘鑰
													"signCertificateSn":ukeys.getCertSignSN(selectedUkey),    //绛惧悕璇佷功搴忓垪鍙
													"encryptCertificateSn": ukeys.getCertEncSN(selectedUkey)  //鍔犲瘑璇佷功搴忓垪鍙
												}
												if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
				                                    $(_this).find(".btn2").hide();
				                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缂哄皯蹇呭～椤鐢靛瓙鍗扮珷缁湡澶辫触锛);
				                                    return false;
				                                }
				                                service.write_cert_GDCA(realdata).done(function(res) {
				                                    if (res.code == 0) {
				                                        $(_this).find(".btn2").hide();
				                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("鐢靛瓙鍗扮珷缁湡鎴愬姛锛);
				                                    } else {
				                                        $(_this).find(".btn2").hide();
				                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text(res.msg);
				                                    }
				                                });
                                    		}else{    //anyin缁湡
                                    			if(certificateFirms==1){    //GDCA
	                                    			var dataGDCA = {
			                                            orderNo: "",
			                                            gdcaRequest: {
			                                                trustId: ukeys.trustId(selectedUkey),
			                                                cn: ukeys.getCertIssuer(selectedUkey).certCn,
			                                                c: 'CN',
			                                                publicKey: ukeys.trustId(selectedUkey),
			                                                orgCode: ukeys.GetenterpriseCode(selectedUkey),
			                                                busyType: 'RENEW',//榛樿鏇存柊涓ゅ勾鏃朵负RENEW锛屽綋涓哄叾浠栧勾浠芥椂鐢ㄤ笅鍒掔嚎闅斿紑锛宔f:RENEW_3
			                                                certType: certificateType
			                                            }
			                                        };
			                                        service.renew_certGDCA(dataGDCA).done(function(ret) {
			                                            if (ret.code == 0) {
			                                                window.open(ret.data, '_blank');
			                                                $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("缁湡鎴愬姛鍚庤鐐瑰嚮缁х画锛);
			                                            } else {
			                                                numInd = 1;
			                                                $(_this).find("#writezm-error").html(ret.msg);
			                                                $(_this).find(".btn2").show().html("閲嶈瘯");
			                                            }
			                                            console.log(ret)
			                                        })
	                                  			}else if(certificateFirms==2){    //netCA
	                                  				ukeys.ChangePin(1, "", "");
	                                  				var getPIN = $("#writezmCode").val(), selectedUkey = Math.max($("#seleBook option:selected").index() - 1, 0);
	                                    			if (ukeys.PIN(getPIN, selectedUkey)) {
					                                    if (!(item.esealCode == ukeys.esealCode(getPIN, selectedUkey))) {
					                                        $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("鎮ㄦ彃鍏ョ殑UKEY涓庢墍閫塙KEY涓嶇锛岃閲嶆柊鎻掑叆");
					                                        $(_this).find(".btn2").show().html("閲嶈瘯");
					                                        numInd = 0;
					                                        return false;
					                                    }
					                                    function inRenewFun(p10, symmAlgo, isNeedChangeCert) {
					                                        var data = {
					                                            oid: ukeys.GetOid(selectedUkey),
					                                            orderNo: item.orderNo,//"RENEW11090365271661"
					                                            esealCode: item.esealCode,
					                                            signCertContent: ukeys.getSignatureCert(selectedUkey),
					                                            year: item.effectivedeDuration ? item.effectivedeDuration : 2, //寰呭畾
					                                            p10: p10 ? p10 : 'p10',
					                                            symmAlgo: symmAlgo ? symmAlgo : 12345678
					                                        };
					                                        that.renew_cert(data).done(function(ret) {
					                                            if (ret.code == 0) {
					                                                if (!(ret.data.bpmsResponse.certInfo && Object.keys(ret.data.bpmsResponse.certInfo).length != 0)) {
					                                                    window.bootbox.alert({
					                                                        size: "small",
					                                                        title: "鎻愮ず",
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
					                                                        //濡傛灉鍒犻櫎鎴愬姛锛屽氨鍐欏叆璇佷功锛
					                                                        window.bootbox.alert({
					                                                            size: "small",
					                                                            title: "鎻愮ず",
					                                                            message:
					                                                            "鍒犻櫎鏃ц瘉涔﹀け璐ワ紝鏃犳硶鍐欏叆鏂拌瘉涔,
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
					                                                    that.netcaCallBack(data).done(function(ret) {
					                                                        $(_this).find(".btn2").hide();
					                                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("鐢靛瓙鍗扮珷缁湡鎴愬姛锛);
					                                                    });
					                                                }
					                                            } else {
					                                                numInd = 1;
					                                                $(_this).find("#writezm-error").html(ret.msg);
					                                                $(_this).find(".btn2").show().html("閲嶈瘯");
					                                            }
					                                        });
					                                    }
					                                    if (item.caType == 2) {
					                                        var data = {
					                                            signCertContent: ukeys.getSignatureCert(selectedUkey)
					                                        };
					                                        that.isNeedChangeCert(data).done(function(ret) {
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
					                                        that.renew_certGDCA(dataGDCA).done(function(ret) {
					                                            if (ret.code == 0) {
					                                                window.open(ret.data, '_blank');
					                                                $(_this).find(".bootbox-body").html(that.msg4).end().find(".msg4").text("缁湡鎴愬姛鍚庤鐐瑰嚮缁х画锛);
					                                            } else {
					                                                numInd = 1;
					                                                $(_this).find("#writezm-error").html(ret.msg);
					                                                $(_this).find(".btn2").show().html("閲嶈瘯");
					                                            }
					                                            console.log(ret)
					                                        })
					                                    }
					                                } else {
					                                    numInd = 1;
					                                    $(_this).find("#writezm-error").html("PIN鐮佷笉姝ｇ‘锛岃閲嶈瘯");
					                                    $(_this).find(".btn2").show().html("閲嶈瘯");
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
	                                                $(_this).find(".btn2").show().html("閲嶈瘯");
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
									"issuer":ukeys.getCertIssuer(selectedUkey).certCn,                             //鏁板瓧璇佷功棰佸彂鑰
									"certificateFirms":ukeys.certificateFirms(selectedUkey),                        //璇佷功鍘傚晢
									"certificateType":keyType,                                //璇佷功绫诲瀷 
									"certificateAssigned":ukeys.CertType(selectedUkey),                     //鏁板瓧璇佷功褰掑睘鑰
									"signCertificateSn":ukeys.getCertSignSN(selectedUkey),    //绛惧悕璇佷功搴忓垪鍙
									"encryptCertificateSn": ukeys.getCertEncSN(selectedUkey)  //鍔犲瘑璇佷功搴忓垪鍙
								}
								if (!realdata.certificateAssigned || !realdata.signCertificateSn || !realdata.encryptCertificateSn || !realdata.certificateFirms) {
                                    $(_this).find(".btn2").hide();
                                    $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("缂哄皯蹇呭～椤鐢靛瓙鍗扮珷缁湡澶辫触锛);
                                    return false;
                                }
                                service.write_cert_GDCA(realdata).done(function(res) {
                                    if (res.code == 0) {
                                        $(_this).find(".btn2").hide();
                                        $(_this).find(".bootbox-body").addClass("isreload").html(that.msg4).end().find(".msg4").text("鐢靛瓙鍗扮珷缁湡鎴愬姛锛);
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