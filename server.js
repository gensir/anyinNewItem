var proxyhttp = require('express-http-proxy');
var express = require('express');
var app = express();
var fs = require('fs');
var proxy = require('./app/server/server-proxy');
for (var i in proxy.dev.proxy) {
    if (proxy.dev.proxy.hasOwnProperty(i)) {
        app.use(i + '/*', proxyhttp(proxy.dev.proxy[i].target, {
            proxyReqPathResolver: function (req, res) {
                return req.baseUrl
            }
        }));
    }
}
app.use(express.static('build', { maxAge: 36000000 }));
app.get('/', function (req, res) {
    fs.readFile('build/index.html', function (err, data) {
        if (err) {
            res.end('404');
        }
        else {
            res.end(data.toString());
        }
    })
})

var server = app.listen(proxy.pro.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
