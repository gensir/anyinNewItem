define([
	"text!./tpl/update_key.html",
	"text!../pub/tpl/footer.html",
	"text!../pub/tpl/dialog.html",
	"../../../app/lib/service",
	"../../lib/ukeys",
	"bootbox"
], function(tpl, primary,dialog, service,ukeys, bootbox) {
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
			var oidUrl = this.getUrlParam("oid");
			var data={
				"oid":oidUrl
			}
			service.getListByOid(data).done(function(res){
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
                                    $(_this).find("#unlock-error").html("请输入6位以上PIN码");
                                    $(_this).find(".btn2").show().html("继续");
                                    $("#unlockCode").keyup(function() {
                                        $("#unlock-error").html("");
                                    });
                                } else {
                                	certificateFirms = ukeys.certificateFirms(selectedUkey);
                                    selectedUkey = $("#seleBook option:selected").index() - 1;
                                    oid = ukeys.GetOid(selectedUkey);
                                    var oidUrl=that.getUrlParam("oid");
                                    if(oid==oidUrl){
                                    	if (ukeys.PIN($("#unlockCode").val(),selectedUkey)) {
                                    		//如果PIN正确
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
								var certData={
									"validStart":localStorage.validStart,
									"validEnd":localStorage.validEnd,
									"esealCode":localStorage.esealCode,
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