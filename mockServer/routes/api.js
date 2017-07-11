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
			},{
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
			}
			]
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
router.get('/management_platform/common/checkSmsCode',function(req, res, next){
	res.json({
		"code": 0,
		"msg": "请求成功",
	})
})




router.get('/setcookie', function (req, res, next) {
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

router.all('/sealnet/visitorsSummary', function (req, res, next) {
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
router.get('/wt/order', function (req, res, next) {
    res.json({ code: 2 });
    //res.render('index', { title: 'Express' });
});

router.get('/sealnet/visitorsList', function (req, res, next) {
    if (req.query.pageNumber && req.query.pageSize) {
        var pageNumber = req.query.pageNumber
            , pageSize = req.query.pageSize
        var list = [
            {
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
