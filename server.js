var proxyhttp = require('express-http-proxy');
var express = require('express');
var app = express();
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
var fs = require('fs');
var proxy = require('./server-proxy');
for (var i in proxy.dev.proxy) {
    if (proxy.dev.proxy.hasOwnProperty(i)) {
        console.log(i, proxy.dev.proxy[i].target)
        app.use(i + '/*', proxyhttp(proxy.dev.proxy[i].target, {
            proxyReqPathResolver: function (req, res) {
                console.log(req.originalUrl);
                return req.originalUrl;
            }
        }));
    }
}

app.use('/app', express.static('app'));
app.use('/static', express.static('static'));
app.use('/vendor', express.static('vendor'));
app.use('/dist', express.static('dist'));
app.use('/index.html', express.static('index.html'));
app.use('*.html', function (req, res, next) {
    res.render(req.baseUrl.substr(1), function(err, html){
        res.send(html);
    });
});

var server = app.listen(proxy.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
