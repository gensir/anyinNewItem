var proxyhttp = require('express-http-proxy');
var express = require('express');
var app = express();
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
var fs = require('fs');
var proxy = require('./app/server/proxy');
for (var i in proxy.dev.proxy) {
    if (proxy.dev.proxy.hasOwnProperty(i)) {
        app.use(i, proxyhttp(proxy.dev.proxy[i].target, {
            proxyReqPathResolver: function (req, res) {
                return req.originalUrl 
            }
        }));
    }
}
app.use(express.static('dist', { maxAge: 36000000 }));
app.use('*.html', function (req, res, next) {
    res.render(req.baseUrl.substr(1), function(err, html){
        res.send(html);
    });
});



var server = app.listen(3838, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
// var server=httpServer.listen(9000, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//     console.log('Example app listening at http://%s:%s', host, port);
// })