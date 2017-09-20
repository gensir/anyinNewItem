import tpl from './tpl/step1.html'
var service = require('../../server/service').default;
var sealstyle = [],result,firmId,that,localSeal;
var sealList=[];
var step1 = Backbone.View.extend({
	el: '.container',
	initialize() {},
	events: {
		'click #goStep2': 'goStep2',
		'click .sealStyle span': 'choice',
		'click .ODC span': 'choice1',
		'change input:radio':'islegal',
	},
	render: function(query) {
		that=this;
		firmId=$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).user.firmId;
//		firmId=localStorage.firmId||440311285096;
//		firmId=440305436959
        var isODC=$.cookie('loginadmin') && JSON.parse($.cookie('loginadmin')).loginType;
        if(isODC==2){
        	$(".ODChide").show();
        }
		this.getstep1(firmId);
		$(".contents").empty();
		this.$el.html(tpl({data:result}));
		sealstyle = [];
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	},
	goStep2: function(event) {
		service.errorOrder(firmId).done(function(data){
			if(data.code==0){				
				if(data.data.list!=null){
					var length=data.data.list[0].orderDetails;
					var str=""
					for(var j=0;j<length.length;j++){
						str+="<span>"+length[j].esealFullName+"</span>";
					}
					bootbox.dialog({
						className: "errorTips",
						title: "<div class='title'>新办电子印章提示</div>",
						message: "<div class='message'>" +
							"<div class='icon'><span></span></div>" +
							"<div class='errorOrderTips'>" +
							"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
							"<div class='errorOrderSeal'>" +str+"</div>" +
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
                                    result.cancelable = window.open('admin.html#step' + data.data.list[0].operateStep, '_self');
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
				}else{
					that.goonstep(event);
				}
			}else{
				bootbox.alert(data.msg);
			}
		})
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
	choice1:function(event){
		var ele = event.target
		if($(ele).hasClass('choice')) {
			$(ele).removeClass('choice');
		} else {
			$(ele).addClass('choice');
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
				localSeal=result.availableEsealList;
			} else {
				bootbox.alert(data.msg);
			}
		})
	},
	poststep1:function(data){
//		var seals=sealstyle;
//		localStorage.seals=seals;
//		console.log(JSON.stringify(data));
		service.poststep1(data).done(function(data) {
			if(data.code == 0) {
				localStorage.stepNum="#step2";
				localStorage.orderNo=data.data;
				window.open('admin.html#step2', '_self');
			} else {
				bootbox.alert("很抱歉，您的企业无法在线上申请电子印章，请前往刻章店申请");
			}
		});
	},
	goonstep:function(event){
		sealList=[];
		var isLegal = $('input:radio:checked').val();
//		localStorage.isLegal=isLegal;
		if($('.sealStyle span').hasClass('choice')||$('.ODC span').hasClass('choice')) {	
			if($('.sealStyle span').hasClass('choice')){
				for(var i=0;i<sealstyle.length;i++){
					for(var j=0;j<localSeal.length;j++){
						if(sealstyle[i]==localSeal[j].esealCode){
							sealList.push(localSeal[j]);
						}
					}
				}
				result.availableEsealList=sealList;
			}
			if($('.ODC span').hasClass('choice')){
				var obj={
					"esealCode":"",             //印章编码
					"esealName":"",             //电子印章类型：1行政，2财务，3发票，4合同，5法人，6私人，7杂章，8报关，9业务章
					"esealFullName":"",         //电子印章全名
					"firmId":"",                //非必传
					"esealStatus":"",           //如果没有就传1,1代表正常
					"keyType":1
				};
				result.availableEsealList.push(obj);
				result.encrytPublicKey="";      //必传，ODC类型的印章的加密公钥
			}
//			不是经办人
			if(isLegal==0){
				result.isDelUnpayed=1;
				result.isOperatorLegalPersion=0
//				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
				that.model.set({ "clickEle": $(event.target).data('id') })
		        var isValid = that.model.isValid();
		        if (!isValid) {
		            result.operatorIdCard=$(".legalID").val();
					result.operatorName=$(".countCode").val();
					this.poststep1(result);
		        }else{
		        	return;
		        }
			}else{
				result.isDelUnpayed=1;
				result.isOperatorLegalPersion=1;
//				result.enterpriseInfo.uniformSocialCreditCode="14236578624"
				this.poststep1(result);
			}	
		} else {
			var dialog = bootbox.alert({
				className: "alert",
				message: "请选择要办理的电子印章类型",
			})
		}
	}
});

module.exports = step1;