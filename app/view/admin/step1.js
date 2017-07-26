import tpl from './tpl/step1.html'
var service = require('../../server/service').default;
var sealstyle = [],result;
var sealList=[];
var step1 = Backbone.View.extend({
	el: '.container',
	initialize() {	
//		this.render();
	},
	events: {
		'click #goStep2': 'goStep2',
		'click .sealStyle span': 'choice',
		'change input:radio':'islegal',
	},
	render: function(query) {
		
		this.getstep1("440303044053");
//		var result={
//	        "address": "宝安区松岗街道罗田第三工业区象山大道15号一楼西面",
//	        "businessLicenseNumber": "12345666666",
//	        "legalName": "张三疯",
//	        "name": "深圳菱正环保设备有限公司",
//	        "uniformSocialCreditCode": "914403005538853123",
//	        "sealList":['财务章','行政章']
//	    }
		$(".contents").empty();
		this.$el.html(tpl({data:result}));
		sealstyle = [];
		document.body.scrollTop = document.documentElement.scrollTop = 0;
//		bootbox.dialog({
//			className: "errorTips",
//			title: "<div class='title'>新办电子印章提示</div>",
//			message: "<div class='message'>" +
//				"<div class='icon'><span></span></div>" +
//				"<div class='errorOrderTips'>" +
//				"<div class='errorOrderTitle'>您还有未完成的订单,是否继续完成该订单?</div>" +
//				"<div class='errorOrderSeal'>" +
//				"<span>电子行政章</span><span>电子行政章</span></div>" +
//				"<div class='errorOrderRed'>新建订单将覆盖原有的订单,您需要重新填写资料</div></div><div class='clear'></div></div>",
//			buttons: {
//				cancel: {
//					label: "返回",
//					className: "btn1"
//				},
//				confirm1: {
//					label: "继续该订单",
//					className: "btn2",
//					callback: function() {
//						$(this).find(".message").html(123);
//						console.log($(this).find(".message").html())
//						if(i = 5) {
//							return false;
//						}
//
//					}
//				},
//				confirm2: {
//					label: "新建订单",
//					className: "btn3",
//					callback: function() {
//						window.location.href = "admin.html#step1";
//					}
//				}
//			}
//		})
	},
	goStep2: function(event) {
		
		var isLegal = $('input:radio:checked').val();
		window.reqres.setHandler("foo", function() {
			return isLegal;
		});
		if($('.sealStyle span').hasClass('choice')) {	
			for(var i=0;i<sealstyle.length;i++){
				for(var j=0;j<result.availableEsealList.length;j++){
					if(sealstyle[i]==result.availableEsealList[j].esealName){
						sealList.push(result.availableEsealList[j]);
					}
				}
			}
			result.availableEsealList=sealList;
			if(isLegal==0){
				result.isOperatorLegalPersion=0
				this.model.set({ "clickEle": $(event.target).data('id') })
				this.model.isValid()
				if(!this.model.isValid()){
					result.operatorIdCard=$(".legalID").val();
					result.operatorName=$(".countCode").val();
					console.log(result);
					this.poststep1(result);
				}
			}else{
//				window.open('admin.html#step2','_self')
//				console.log(result);
//				result=JSON.stringify(result);
//				result=JSON.parse(result);
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
				var obj={
	                "createTime": null,
	                "easalId": null,
	                "enterpriseCode": "440303044053",
	                "enterpriseCodeType": null,
	                "enterpriseName": null,
	                "esealCode": "4403030019792",
	                "esealCreateTime": null,
	                "esealFullName": "行政章",
	                "esealName": 1,
	                "esealStatus": 3,
	                "esealType": null,
	                "firmId": "4403030019792",
	                "id": null,
	                "isDelete": null,
	                "oid": null,
	                "operateId": null,
	                "picData": null,
	                "picHeight": 30,
	                "picType": null,
	                "picWidth": 45,
	                "recordStatus": null,
	                "recordTime": null,
	                "updateTime": null,
	                "validEnd": null,
	                "validStart": null,
	                "version": null,
	                "vid": null
	            }
				data.data.availableEsealList.push(obj);
				result=data.data;
			} else {
				result={
			        "availableEsealList": [
			            {
			                "createTime": null,
			                "easalId": null,
			                "enterpriseCode": "440303044053",
			                "enterpriseCodeType": null,
			                "enterpriseName": null,
			                "esealCode": "4403030019792",
			                "esealCreateTime": null,
			                "esealFullName": "行政章",
			                "esealName": 1,
			                "esealStatus": 3,
			                "esealType": null,
			                "firmId": "4403030019792",
			                "id": null,
			                "isDelete": null,
			                "oid": null,
			                "operateId": null,
			                "picData": null,
			                "picHeight": 30,
			                "picType": null,
			                "picWidth": 45,
			                "recordStatus": null,
			                "recordTime": null,
			                "updateTime": null,
			                "validEnd": null,
			                "validStart": null,
			                "version": null,
			                "vid": null
			            },
			            {
			                "createTime": null,
			                "easalId": null,
			                "enterpriseCode": "440303044053",
			                "enterpriseCodeType": null,
			                "enterpriseName": null,
			                "esealCode": "4403030019793",
			                "esealCreateTime": null,
			                "esealFullName": "财务专用章",
			                "esealName": 2,
			                "esealStatus": 3,
			                "esealType": null,
			                "firmId": "4403030019793",
			                "id": null,
			                "isDelete": null,
			                "oid": null,
			                "operateId": null,
			                "picData": null,
			                "picHeight": 30,
			                "picType": null,
			                "picWidth": 45,
			                "recordStatus": null,
			                "recordTime": null,
			                "updateTime": null,
			                "validEnd": null,
			                "validStart": null,
			                "version": null,
			                "vid": null
			            }
			        ],
			        "enterpriseInfo": {
			            "address": "罗湖区凤凰路3号海珑华苑海天阁1018",
			            "areaCode": "szpsfj",
			            "businessLicenseNumber": null,
			            "createTime": "2013-10-31 00:00:00",
			            "createUserId": null,
			            "establishmentDate": "2011-12-06 00:00:00",
			            "headOfficeId": null,
			            "id": "440303044053",
			            "idcardNumber": "D228173（3）",
			            "idcardType": "11",
			            "industryType": null,
			            "legalAddress": null,
			            "legalName": "郑振欧",
			            "name": "仕贝伦莎服饰(深圳)有限公司",
			            "nameEnglish": null,
			            "nameMinorityNationality": null,
			            "nature": "99",
			            "organizationCode": "593044067",
			            "phone": "13823268742",
			            "remark": null,
			            "scale": null,
			            "status": "0",
			            "taxNumber": null,
			            "telephone": "13823268742",
			            "type": "02",
			            "uniformSocialCreditCode": "2323322",
			            "updateTime": null,
			            "updateUserId": null
			        },
			        "isDelUnpayed": 1,
			        "isOperatorLegalPersion": 1,
			        "operatorIdCard": null,
			        "operatorName": null
			    }
				console.log(data.msg)
			}
		})
	},
	poststep1:function(data){
		service.poststep1(data).done(function(data) {
			if(data.code == 0) {
				console.log(data.msg);
				pictureFlag[num] = 0;
			} else {
				console.log(data.msg);
			}
		});
	}
	
});

module.exports = step1;