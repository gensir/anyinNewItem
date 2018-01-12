define([
	"text!./tpl/step1.html",
	"../../../app/lib/service",
	"bootbox"
], function(adminstep1, service, bootbox) {
	var sealstyle = [],
		sealstyle1 = [],
		result, firmId, that, localSeal,isODC;
	var sealList = [];
	var choiceflag = false;
	var gotoflag = false;
	var template = require('art-template');
	var main = Backbone.View.extend({
		el: '.contents',
		initialize:function() {},
		events: {
			'click #goStep2': 'goStep2',
			'click .sealStyle span': 'choice',
			'click .ODC span': 'choice1',
			'change input:radio': 'islegal',
		},
		render: function(query) {
			that = this;
			sealstyle = [];
			isODC = $.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).keyType == 1;
			//keyType==1为ODC
			firmId = ($.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId);
			that.getstep1(firmId);  
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		},
		goStep2: function(event) {
			var godata={
				"firmId":firmId,
				"orderStatus":1,
				"businessType":1    //业务类型(1、开通 2、续费 3、退款)
			}
			service.errorOrder(godata).done(function(data) {
				if(data.code == 0) {
					if(data.data.list != null) {
						var length = data.data.list[0].orderDetails;
						var str = ""
						for(var j = 0; j < length.length; j++) {
							str += "<span>" + length[j].esealFullName + "</span>";
						}
						bootbox.dialog({
							className: "errorTips",
							title: "<div class='title'>新办电子印章提示</div>",
							message: "<div class='message'>" +
								"<div class='icon'><span></span></div>" +
								"<div class='errorOrderTips'>" +
								"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
								"<div class='errorOrderSeal'>" + str + "</div>" +
								"<div class='errorOrderRed'>新建订单将覆盖原有的订单,您需要重新填写资料</div></div><div class='clear'></div></div>",
							buttons: {
								cancel: {
									label: "返回",
									className: "btn1"
								},
								confirm1: {
									label: "继续该订单",
									className: "btn2",
									callback: function() {
										localStorage.orderNo = data.data.list[0].orderNo;
										setTimeout(function(){
											result.cancelable = window.open('admin.html#step' + data.data.list[0].operateStep, '_self');
										},100)
									}
								},
								confirm2: {
									label: "新建订单",
									className: "btn3",
									callback: function() {
										that.goonstep(event);
									}
								}
							}
						})
					} else {
						that.goonstep(event);
					}
				} else {
					bootbox.alert(data.msg);
				}
			})
		},
		choice: function(event) {
			var ele = event.target
			var count = $(ele).data('id');
			if($(ele).hasClass('choice')) {
				$(ele).removeClass('choice');
				for(var i = 0; i < sealstyle.length; i++) {
					if(sealstyle[i] == count) {
						sealstyle.splice(i,1);
					}
				}
				if(!choiceflag) {
					for(var i = 0; i < $(".ODC span").length; i++) {
						var count1 = $(".ODC span")[i].getAttribute('data-id');
						if(count == count1) {
							$(".ODC span")[i].style.display = 'inline-block';
						}
					}
				}
			} else {
				$(ele).addClass('choice');
				sealstyle.push(count);

				//			for(var i=0;i<$(".ODC span").length;i++){
				//				var count1=$(".ODC span")[i].getAttribute('data-id');
				//				if(count==count1){
				//					$(".ODC span")[i].removeAttribute('choice');
				//				}
				//			}
			}
		},
		//	选择ODC
		choice1: function(event) {
			var ele = event.target;
			var count = $(ele).data('id');
			if($(ele).hasClass('choice')) {
				localStorage.ODCchoice=false;
				$(ele).removeClass('choice');
				$(ele).siblings().removeClass('choice');
				choiceflag = false;
				for(var i = 0; i < sealstyle1.length; i++) {
					if(sealstyle1[i] == count) {
						sealstyle1.splice(i,1);
					}
				}
				for(var i = 0; i < $(".sealStyle span").length; i++) {
					var count1 = $(".sealStyle span")[i].getAttribute('data-id');
					if(count == count1) {
						$(".sealStyle span")[i].style.display = 'inline-block';
					}
				}
			} else {
				localStorage.ODCchoice=true;
				choiceflag = true;
				$(ele).addClass('choice');
				$(ele).siblings().removeClass('choice');
				sealstyle1.push(count);
				for(var i = 0; i < $(".sealStyle span").length; i++) {
					var count1 = $(".sealStyle span")[i].getAttribute('data-id');
					if(count == count1) {
						$(".sealStyle span")[i].className = '';
						$(".sealStyle span")[i].style.display = 'none';
					} else {
						$(".sealStyle span")[i].style.display = 'inline-block';
					}
				}

			}
		},
		islegal: function() {
			var isLegalVal = $('input:radio:checked').val();
			(isLegalVal == 0) ? $(".islegal").show(): $(".islegal").hide();
		},
		getstep1: function(data) {
			service.getstep1(data).done(function(data) {
				if(data.code == 0) {
					result = data.data;
					localSeal = result.availableEsealList;
					$(".contents").empty();
					if(result.enterpriseInfo==null ){
						bootbox.alert("获取单位主体信息为空，请稍后再试");
					}else{
						that.$el.html(template.compile(adminstep1)({ data: result }));
					}										
		        	if(isODC) {
						$(".ODChide").show();
					}
				} else {
					bootbox.alert(data.msg);
				}
			})
		},
		poststep1: function(data) {
			service.poststep1(data).done(function(data) {
				if(data.code == 0) {
					localStorage.orderNo = data.data;
					if(gotoflag) {
						localStorage.stepNum = "#step2";
						window.open('admin.html#step2', '_self');
					} else {
						localStorage.stepNum = "#step4";
						window.open('admin.html#step4', '_self');
					}

				} else {
					bootbox.alert("很抱歉，您的企业无法在线上申请电子印章，请前往刻章店申请");
				}
			});
		},
		goonstep: function(event) {
			sealList = [];
			var isLegal = $('input:radio:checked').val();
			//		localStorage.isLegal=isLegal;
			if($('.sealStyle span').hasClass('choice') || $('.ODC span').hasClass('choice')) {
				if($('.sealStyle span').hasClass('choice')) {
					gotoflag = true;
					for(var i = 0; i < sealstyle.length; i++) {
						for(var j = 0; j < localSeal.length; j++) {
							if(sealstyle[i] == localSeal[j].esealCode) {
								localSeal[j].keyType = 2
								sealList.push(localSeal[j]);
							}
						}
					}
				}
				//选择ODC
				if($('.ODC span').hasClass('choice')) {
					for(var j = 0; j < localSeal.length; j++) {
						if(sealstyle1[0] == localSeal[j].esealCode) {
							localSeal[j].keyType = 1;
							localSeal[j].oid = localStorage.ODCoid;
							sealList.push(localSeal[j]);
						}
					}
					result.encrytPublicKey = localStorage.publicKey; //必传，ODC类型的印章的加密公钥
				}
				result.availableEsealList = sealList;
				//			不是经办人
				if(isLegal == 0) {
					result.isDelUnpayed = 1;
					result.isOperatorLegalPersion = 0
					//				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
					that.model.set({ "clickEle": $(event.target).data('id') })
					var isValid = that.model.isValid();
					if(!isValid) {
						result.operatorIdCard = $(".legalID").val();
						result.operatorName = $(".countCode").val();
						that.poststep1(result);
					} else {
						return;
					}
				} else {
					result.isDelUnpayed = 1;
					result.isOperatorLegalPersion = 1;
					//				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
					that.poststep1(result);
				}
			} else {
				var dialog = bootbox.alert({
					className: "alert",
					message: "请选择要办理的电子印章类型",
				})
			}
		}
	});
	return main;
});