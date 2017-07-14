var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var http = require('http');
// var bodyParser = require('body-parser');
// express().use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
// express().use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
//   extended: true
// }));
function md5(text) {
	return crypto.createHash('md5').update(text).digest('hex');
};

//获取电子印章列表
router.get('/management_platform/eseal/list/1/10', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": {
			"totalRows": 1,
			"totalPages": 1,
			"pageNum": 1,
			"pageSize": 10,
			"curPageSize": 1,
			"list": [{
				"id": 10000000,
				"version": "1",
				"vid": "1212",
				"esealCode": "1235678",
				"esealType": 1,
				"esealName": 4,
				"esealFullName": "好章",
				"easalId": "0622",
				"esealStatus": 1314,
				"esealCreateTime": "Jul 3, 2017 4:55:23 PM",
				"recordStatus": 0,
				"recordTime": "Jul 3, 2017 4:55:23 PM",
				"validStart": "Jul 3, 2017 4:55:23 PM",
				"validEnd": "Jul 3, 2017 4:55:23 PM",
				"picType": "BMP",
				"picData": "2",
				"picWidth": 0,
				"picHeight": 1,
				"oid": "1223456",
				"enterpriseCodeType": 500,
				"enterpriseCode": "123456",
				"enterpriseName": "12456",
				"firmId": "nihao",
				"isDelete": 0,
				"createTime": "Jul 3, 2017 4:55:23 PM",
				"updateTime": "Jul 3, 2017 4:55:23 PM",
				"certStatus": [0, 1, 1]
			}, {
				"id": 10000000,
				"version": "1",
				"vid": "1212",
				"esealCode": "1235678",
				"esealType": 1,
				"esealName": 6666,
				"esealFullName": "好章",
				"easalId": "0622",
				"esealStatus": 1314,
				"esealCreateTime": "Jul 3, 2017 4:55:23 PM",
				"recordStatus": 0,
				"recordTime": "Jul 3, 2017 4:55:23 PM",
				"validStart": "Jul 3, 2017 4:55:23 PM",
				"validEnd": "Jul 3, 2017 4:55:23 PM",
				"picType": "BMP",
				"picData": "2",
				"picWidth": 0,
				"picHeight": 1,
				"oid": "1223456",
				"enterpriseCodeType": 500,
				"enterpriseCode": "123456",
				"enterpriseName": "12456",
				"firmId": "nihao",
				"isDelete": 0,
				"createTime": "Jul 3, 2017 4:55:23 PM",
				"updateTime": "Jul 3, 2017 4:55:23 PM",
				"certStatus": [0, 1, 1]
			}]
		}
	})
});
//获取签章日志列表
router.get('/management_platform/logs/list/1/5', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": {
			"totalRows": 1,
			"totalPages": 1,
			"pageNum": 1,
			"pageSize": 5,
			"curPageSize": 1,
			"list": [{
				"id": 001,
				"version": "1",
				"fileName": "深圳市安印科技销售合同书1.pdf", //文档名称
				"signDate": "2017-2-2 12:12:11", //签章时间
				"fileSize": "2.4M", //文档大小
				"fileHash": "a518d940152480ac1800ad9f9902025e", //文档哈希值
				"sealnetType": "骑缝签章", //签章类型
				"signname": "电子行政章", //印章名称
				"sealCode": "e4403071111231", //印章编码
				"esealCreateTime": "2017-2-1 14:12:54", //制作日期
				"validitybefore": "2016/12/12", //有效期起
				"validityafter": "2018/12/12", //有效期止
				"clientIp": "210.210.210.210", //
				"clientMac": "5D-21-D5-E1-28-6D", //
				"clientAdd": "中国广东省深圳市南山区",
				"clientName": "电脑名称",
				"clientsSystem": "windows7",
				"sealtype": "安印PDF客户端 v2.0.1.3",
				"Status": "1"
			}, {
				"id": 002,
				"version": "1",
				"fileName": "深圳市安印科技销售合同书2.pdf", //文档名称
				"signDate": "2017-2-3 12:25:41", //签章时间
				"fileSize": "2.4M", //文档大小
				"fileHash": "a518d940152480ac1800ad9f9902025e", //文档哈希值
				"sealnetType": "骑缝签章", //签章类型
				"signname": "电子行政章", //印章名称
				"sealCode": "e4403071111231", //印章编码
				"esealCreateTime": "2017-2-1 14:12:54", //制作日期
				"validitybefore": "2016/12/12", //有效期起
				"validityafter": "2018/12/12", //有效期止
				"clientIp": "210.210.210.210", //
				"clientMac": "5D-21-D5-E1-28-6D", //
				"clientAdd": "中国广东省深圳市南山区",
				"clientName": "电脑名称",
				"clientsSystem": "windows7",
				"sealtype": "安印PDF客户端 v2.0.1.3",
				"Status": "2"
			}, {
				"id": 003,
				"version": "1",
				"fileName": "深圳市安印科技销售合同书3.pdf", //文档名称
				"signDate": "2017-2-4 12:22:06", //签章时间
				"fileSize": "2.4M", //文档大小
				"fileHash": "a518d940152480ac1800ad9f9902025e", //文档哈希值
				"sealnetType": "骑缝签章", //签章类型
				"signname": "电子行政章", //印章名称
				"sealCode": "e4403071111231", //印章编码
				"esealCreateTime": "2017-2-1 14:12:54", //制作日期
				"validitybefore": "2016/12/12", //有效期起
				"validityafter": "2018/12/12", //有效期止
				"clientIp": "210.210.210.210", //
				"clientMac": "5D-21-D5-E1-28-6D", //
				"clientAdd": "中国广东省深圳市南山区",
				"clientName": "电脑名称",
				"clientsSystem": "windows7",
				"sealtype": "安印PDF客户端 v2.0.1.3",
				"Status": "1"
			}]
		}
	})
});
//获取操作日志列表
router.get('/management_platform/Operationlog/list/1/5', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": {
			"totalRows": 1,
			"totalPages": 2,
			"pageNum": 1,
			"pageSize": 10,
			"curPageSize": 1,
			"list": [{
				"id": "1",
				"time": '2017/02/02 12:21:45',
				"type": "登录系统1",
				"ip": "210.210.210.210",
				"add": "广东省 深圳市 福田区",
			}, {
				"id": "2",
				"time": '2017/02/02 12:21:45',
				"type": "登录系统2",
				"ip": "210.210.210.210",
				"add": "广东省 深圳市 福田区",
			}, {
				"id": "3",
				"time": '2017/02/02 12:21:45',
				"type": "登录系统3",
				"ip": "210.210.210.210",
				"add": "广东省 深圳市 福田区",
			}, {
				"id": "4",
				"time": '2017/02/02 12:21:45',
				"type": "登录系统4",
				"ip": "210.210.210.210",
				"add": "广东省 深圳市 福田区",
			}, {
				"id": "5",
				"time": '2017/02/02 12:21:45',
				"type": "登录系统5",
				"ip": "210.210.210.210",
				"add": "广东省 深圳市 福田区",
			}, {
                		"id": "6",
                		"time": '2017/02/02 12:21:45',
                		"type": "登录系统6",
                		"ip": "210.210.210.210",
                		"add": "广东省 深圳市 福田区",
			}]
		}
	})
});
//获取短信验证码
router.get('/standard_server/common/getSMSVerifCode', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": "347112"
	})
});
//校验短信验证码
router.get('/management_platform/common/checkSmsCode', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
	})
});
//文件上传
router.post('/mp/file', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": {
			"fileId": "group1/M00/00/05/wKgwMllXWimADq2lAAACRjEL_RY068.png",

			"fullUrl": "http://img.kumi.cn/photo/75/06/16/7506167878647fe8_610x455.jpg?1225",
			//http://i.dimg.cc/3f/90/7a/f7/2d/71/1c/f3/4a/39/37/2f/f1/44/d4/70.jpg
			"fileSize": 582,
			"createTime": "Jul 1, 2017 4:15:38 PM",
			"fileName": "支付成功不跳转更新证书界面.png"
		}
	})
});
//订单列表
router.get('/management_platform/mpEsealOrder/queryOrderList/1/10', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": {
			"totalRows": 1,
			"totalPages": 1,
			"pageNum": 1,
			"pageSize": 5,
			"curPageSize": 1,
			"list": [{
					"id": 100000000,
					"orderNo": "123456789",
					"firmId": "12323",
					"orderOrigin": 12,
					"orderAmount": 10,
					"discountAmount": 0,
					"actualAmount": 10,
					"privilegeScheme": 1,
					"businessType": 0,
					"payType": 2,
					"orderStatus": 1,
					"payTime": "Jul 12, 2017 11:39:58 AM",
					"enterpriseCode": "123456",
					"enterpriseName": "dianziyzhang",
					"transactionId": "125",
					"operateStep": 4,
					"linkMan": "范冰冰",
					"linkManCertificateType": 1,
					"linkManCertificateNumber": "123456",
					"shopName": "安印",
					"shopAddress": "shenzheng",
					"shopTel": "1085656233",
					"shopNo": "1681681",
					"applicationCode": "468524565",
					"isRefund": 100,
					"isDelete": 0,
					"createTime": "Jul 12, 2017 11:39:58 AM",
					"updateTime": "Jul 12, 2017 11:39:58 AM"
				},
				{
					"id": 100000001,
					"orderNo": "123456790",
					"firmId": "12323",
					"orderOrigin": 12,
					"orderAmount": 10,
					"discountAmount": 0,
					"actualAmount": 10,
					"privilegeScheme": 1,
					"businessType": 0,
					"payType": 2,
					"orderStatus": 1,
					"payTime": "Jul 12, 2017 11:39:58 AM",
					"enterpriseCode": "123456",
					"enterpriseName": "dianziyzhang",
					"transactionId": "125",
					"operateStep": 4,
					"linkMan": "范冰冰",
					"linkManCertificateType": 1,
					"linkManCertificateNumber": "123456",
					"shopName": "安印",
					"shopAddress": "shenzheng",
					"shopTel": "1085656233",
					"shopNo": "1681681",
					"applicationCode": "468524565",
					"isRefund": 100,
					"isDelete": 0,
					"createTime": "Jul 12, 2017 11:39:58 AM",
					"updateTime": "Jul 12, 2017 11:39:58 AM"
				}
			]
		}
	})
})
//图片删除
router.get('/mp/file', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "请求成功",
		"data": 0
	})
})
//ukey和phone登录
router.post('/management_platform/sys/login', function(req, res, next) {
	if(req.body) {
		res.json({
			"code": 0,
			"msg": "请求成功",
			"data": "347112"
		})
	} else {
		res.json({
			"code": 1,
			"msg": "请求失败",
			"data": "347112"
		})
	}
});
//ukey登录随机数
router.all('/management_platform/captcha', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "/api/images/login1.png",
		"data": "347112"
	})

});

router.get('/setcookie', function(req, res, next) {
	var postData = 'username=13570852872&password=' + md5('123456');
	//postData = JSON.stringify(postData);

	const options = {
		hostname: '192.168.1.135',
		port: 9282,
		path: '/user?method=weblogin',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};

	const newReq = http.request(options, (newRes) => {
		console.log(`STATUS: ${res.statusCode}`);
		console.log(`HEADERS: ${JSON.stringify(newRes.headers)}`);
		newRes.setEncoding('utf8');
		var allData = '';
		newRes.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
			allData += chunk;
		});
		newRes.on('end', () => {
			console.log('No more data in response.');
			let resJson = JSON.parse(allData);
			res.append("Set-Cookie", 'sealnetSession=' + resJson.data.token + '; Path=/; HttpOnly');
			res.json({ code: 0, msg: 'login success' });
		});
	});

	newReq.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});

	// write data to request body
	newReq.write(postData);
	newReq.end();
});

// router.all('/sealnet/visitorsList', function (req, res, next) {
//     res.json({
//         "msg": "http request success",
//         "code": 0,
//         "data": {
//             "pageNumber": 1,
//             "pageSize": 10,
//             "order": "desc",
//             "list": [
//                 "深圳市安印公司",
//                 "深圳市安印科技公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//                 "深圳市安印科技有限公司",
//             ]
//         }
//     });    //res.render('index', { title: 'Express' });
// });

router.all('/sealnet/visitorsSummary', function(req, res, next) {
	res.json({
		"code": 0,
		"msg": "成功",
		"data": {
			"dataTotal": {
				"total": 76,
				"authenticatorTotal": 76,
				"registerTotal": 0,
				"reportTotal": 0,
				"sevenDayAuthenticateTotal": 76,
				"sevenDayRegisterTotal": 0,
				"sevenDayReportTotal": 0,
				"sevenDayTotal": 76
			},
			"dataTrend": {
				"authenticateTotalTrend": {
					"20170601": "0",
					"20170602": "0",
					"20170603": "0",
					"20170604": "0",
					"20170605": "0",
					"20170606": "0",
					"20170607": "76",
				},
				"registerTotalTrend": {
					"20170601": "0",
					"20170602": "0",
					"20170603": "0",
					"20170604": "0",
					"20170605": "0",
					"20170606": "0",
					"20170607": "0",
				},
				"totalTrend": {
					"20170601": "0",
					"20170602": "0",
					"20170603": "0",
					"20170604": "0",
					"20170605": "0",
					"20170606": "0",
					"20170607": "76",
				},
				"reportTotalTrend": {
					"20170601": "0",
					"20170602": "0",
					"20170603": "0",
					"20170604": "0",
					"20170605": "0",
					"20170606": "0",
					"20170607": "76"
				}
			},
			"visitorCompany": [
				"深圳市安印公司",
				"深圳市安印科技公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
				"深圳市安印科技有限公司",
			],
			"visitorRatio": {
				"authenticatorTotal": 76,
				"guestTotal": 0,
				"registerTotal": 0,
				"total": 76
			},
			"visitorSource": {
				"4403": "64"
			}
		}
	});
});
router.get('/wt/order', function(req, res, next) {
	res.json({ code: 2 });
	//res.render('index', { title: 'Express' });
});

router.get('/sealnet/visitorsList', function(req, res, next) {
	if(req.query.pageNumber && req.query.pageSize) {
		var pageNumber = req.query.pageNumber,
			pageSize = req.query.pageSize
		var list = [{
				"name": "深圳市安印公司1",
				"time": "2017-06-08 16:51"
			},
			{
				"name": "深圳市安印公司2",
				"time": "2017-06-08 16:52"
			},
			{
				"name": "深圳市安印公司3",
				"time": "2017-06-08 16:53"
			},
			{
				"name": "深圳市安印公司4",
				"time": "2017-06-08 16:54"
			},
			{
				"name": "深圳市安印公司5",
				"time": "2017-06-08 16:55"
			},
			{
				"name": "深圳市安印公司6",
				"time": "2017-06-08 16:56"
			},
			{
				"name": "深圳市安印公司7",
				"time": "2017-06-08 16:57"
			},
			{
				"name": "深圳市安印公司8",
				"time": "2017-06-08 16:58"
			},
			{
				"name": "深圳市安印科技公司9",
				"time": "2017-06-08 16:59"
			},
			{
				"name": "深圳市安印科技公司10",
				"time": "2017-06-08 17:00"
			},
			{
				"name": "深圳市安印科技公司11",
				"time": "2017-06-08 17:00"
			}
		];
		var totalList = list.length;
		var sizeNum = Math.ceil((list.length) / pageSize);
		list = list.splice((pageNumber - 1) * pageSize, pageSize) || []
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
		res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
		res.json({
			"code": 0,
			"msg": "成功",
			"data": {
				"list": list,
				"order": "desc",
				"pageNumber": req.query.pageNumber,
				"pageSize": req.query.pageSize,
				"totalNumber": String(totalList)
			}
		});
	}
	//res.render('index', { title: 'Express' });
});

module.exports = router;