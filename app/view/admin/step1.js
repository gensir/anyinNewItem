import tpl from './tpl/step1.html'
var service = require('../../server/service').default;
var sealstyle = [],result;
var sealList=[];
var step1 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'click #goStep2': 'goStep2',
		'click .sealStyle span': 'choice',
		'change input:radio':'islegal',
	},
	render: function(query) {
		var enterpriseCode="440303044053";
		this.getstep1(enterpriseCode);
		$(".contents").empty();
		this.$el.html(tpl({data:result}));
		sealstyle = [];
		document.body.scrollTop = document.documentElement.scrollTop = 0;
		service.errorOrder(enterpriseCode).done(function(data){
			if(data.code==0){
				var obj={
		                "id": 100000241,
		                "orderNo": "OFFLINE-2017071793798629",
		                "firmId": "100001000001",
		                "orderOrigin": 4,
		                "actualAmount": 0,
		                "privilegeScheme": 0,
		                "businessType": 1,
		                "payType": 4,
		                "orderStatus": 1,
		                "enterpriseCode": "100001000001",
		                "enterpriseName": "深圳市盐田区祥圆商店1",
		                "operateStep": 2,
		                "linkMan": "开发",
		                "linkManCertificateType": 11,
		                "linkManCertificateNumber": "43012645321455214",
		                "isRefund": 0,
		                "isDelete": 1,
		                "createTime": "Jul 17, 2017 4:58:35 PM",
		                "updateTime": "Jul 19, 2017 2:09:52 PM"
		            }
				data.data.list.push(obj);
				if(data.data.list.length>0){
					bootbox.dialog({
						className: "errorTips",
						title: "<div class='title'>新办电子印章提示</div>",
						message: "<div class='message'>" +
							"<div class='icon'><span></span></div>" +
							"<div class='errorOrderTips'>" +
							"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
							"<div class='errorOrderSeal'>" +
							"<span>电子行政章</span><span>电子行政章</span><span>电子行政章</span><span>电子行政章</span></div>" +
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
									window.location.href = "admin.html#step"+data.data.list[0].operateStep;
								}
							},
							confirm2: {
								label: "新建订单",
								className: "btn3",
								callback: function() {
									window.location.href = "admin.html#step1";
								}
							}
						}
					})
				}
			}else{
				bootbox.alert(data.msg);
			}
		})

	},
	goStep2: function(event) {	
		var isLegal = $('input:radio:checked').val();
		localStorage.isLegal=isLegal;
		if($('.sealStyle span').hasClass('choice')) {	
			for(var i=0;i<sealstyle.length;i++){
				for(var j=0;j<result.availableEsealList.length;j++){
					if(sealstyle[i]==result.availableEsealList[j].esealName){
						sealList.push(result.availableEsealList[j]);
					}
				}
			}
			result.availableEsealList=sealList;
//			不是经办人
			if(isLegal==0){
				result.isDelUnpayed=1;
				result.isOperatorLegalPersion=0
				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
				this.model.set({ "clickEle": $(event.target).data('id') })
				this.model.isValid()
				if(!this.model.isValid()){
					result.operatorIdCard=$(".legalID").val();
					result.operatorName=$(".countCode").val();
					console.log(result);
					this.poststep1(result);
				}
			}else{
				result.isDelUnpayed=1;
				result.isOperatorLegalPersion=1;
				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
				this.poststep1(result);
			}	
		} else {
			var dialog = bootbox.alert({
				className: "alert",
				message: "请选择要办理的电子印章类型",
			})
		}
	},
	choice: function(event) {		
		var ele = event.target
		var count=$(ele).data('id');
		if($(ele).hasClass('choice')) {
			$(ele).removeClass('choice');
			for(var i=0;i<sealstyle.length;i++){
				if(sealstyle[i]==count){
					sealstyle.pop(count);
				}
			}
		} else {
			$(ele).addClass('choice');
			sealstyle.push(count);
		}
	},
	islegal:function(){
		var isLegalVal=$('input:radio:checked').val();
		(isLegalVal==0)?$(".islegal").show():$(".islegal").hide();
	},
	getstep1:function(data){
		service.getstep1(data).done(function(data) {
			if(data.code == 0) {
				result=data.data;
			} else {
				bootbox.alert(data.msg);
			}
		})
	},
	poststep1:function(data){
		var seals=sealstyle;
		localStorage.seals=seals;
		service.poststep1(data).done(function(data) {
			if(data.code == 0) {
				localStorage.orderNo=data.data;
				window.open('admin.html#step2', '_self');
			} else {
				bootbox.alert(data.msg);
			}
		});
	}
});

module.exports = step1;