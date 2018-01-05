define([
    "text!./tpl/invoice.html",
    "../../lib/service",
    "../../lib/public",
    "text!../pub/tpl/dialog.html",
    "bootbox"
    ],function(tpl,service,public,bootbox,bootbox) {
    var Backbone = require('backbone');
    var template = require('art-template');
    var dialogs = $(dialogs);
    var type = 1;
    var flag = false;
    var orderNo;
    var invoice_info;
    var main = Backbone.View.extend({
        el: '.contents',
        initialize:function () {
        	
        },
        render: function() {
            that = this;
            orderNo = that.getUrlParam('orderNo');
            this.ordersinfo();
            public.placeholder();
        },
        events: {
			'click .idname input[type="radio"]': 'idType',
			'click #invoice_Apply': 'Apply',
        },
        //取订单号
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
        //发票内容
        invoicetype: function() {
            if (type ==1) {
				if($("#invoice_user").val() == "") {
					flag = false;
					$("#invoice_user-error").text("请填写个人发票抬头！")
				} else {
					var invoice_user = {
						"orderNo": orderNo,
						"invoiceType": 0,
						"invoiceHeader": $("#invoice_user").val(),
					};
					invoice_info = invoice_user;
					flag = true;
				}
            } else if (type ==2) {
				if($("#invoice_company").val() == "") {
					flag = false;
					$("#invoice_company-error").text("请填写企业发票抬头！")
                } else if ($("#invoice_taxpayer").val().length != 15 && $("#invoice_taxpayer").val().length != 18 && $("#invoice_taxpayer").val().length != 20) {
					flag = false;
					$("#invoice_taxpayer-error").text("请输入15、18或20位的纳税人识别号！")
                }
                 else {
					var invoice_company = {
						"orderNo": orderNo,
						"invoiceType": 0,
						"invoiceHeader": $("#invoice_company").val(),
						"buyerTaxerNo": $("#invoice_taxpayer").val(),
					};
					invoice_info = invoice_company;
					flag = true;
				}
            }
        },
        //点击立即申请
        Apply: function() {
            that.invoicetype();
			if(flag) {
                $("#invoice_Apply").attr("disabled", true);
				that.invoice_Submit(invoice_info);
			} else {
				console.log("请正确填写开具发票的信息！");
			}
        },
        invoice_Submit: function(invoice_info) {
            service.invoice_apply(invoice_info).done(function(res) {
                if (res.code == 0) {
                    console.log("开票成功")
                    localStorage.dfsPdfUrl = res.data.dfsPdfUrl
                    window.location.href = "#invoice_ok";
                } else if (res.code == 40008) {
                    var errortip = res.msg + "，请勿重复提交信息！"
                    that.dialog_tip(errortip, 1, "返回")
                } else if (res.code == 50004) {
                    var errortip = "开票服务请求失败，请稍后重试！"
                    that.dialog_tip(errortip)
                } else {
                    that.dialog_tip(res.msg)
                }
            })
        },
        
        //弹窗提示
        dialog_tip: function(data, errorcode, text) {
            //data 为提示内容，errorcode为错误代码,text为按钮文字
            bootbox.dialog({
                backdrop: true,
                closeButton: false,
                className: "common",
                title: "异常信息",
                message: '<div class="msgcenter"><em></em><span>' + data + '</span></div',
                buttons: {
                    confirm: {
                        label: text || "确定",
                        className: "btn2",
                        callback: function(result) {
                            if (errorcode == 1) {
                                result.cancelable = window.location.href = 'orders.html';
                            } else {
                                result.cancelable = false;
                                $("#invoice_Apply").attr("disabled", false);
                            }
                        }
                    },
                }
            })
            return false;
        },
        //选择发票类型
		idType: function(event) {
			type = event.target.value;
			$("#taxTips").text("");
			if(type == 1) {
				$("#company").hide();
				$("#person").show();
			} else if(type == 2) {
				$("#company").show();
				$("#person").hide();
			}
        },
        //获取订单相关信息
        ordersinfo: function() {
            var _this = this;
            var data = {
                "orderNo": orderNo
            }
            service.OrderDetail(data).done(function(res) {
                var tempObj;
                if (res.code != 0) {
                    tempObj = {}
                } else {
                    tempObj = res.data;
                    _this.model.get("tplhtml").value = tempObj;
                    _this.$el.html(template.compile(tpl)(_this.model.get("tplhtml")));
                    console.log(tempObj.orderStatus);
                    if ((tempObj.orderStatus != 4) && (tempObj.orderStatus != 5) ) {
                        $("#invoice_Apply").attr("disabled", true);
                        _this.dialog_tip("该订单状态不支持申请发票！", 1, "返回")
                    }
                }
            })
        },
    });
    return main;
});
