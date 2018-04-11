var proxy = {
    seal: 'http://192.168.1.135:9282',
    wx: 'https://api.weixin.qq.com',
}
var config = {
    dev: {
        historyApiFallback: true,
        stats: { colors: true },
        hot: true,
        inline: true,
        progress: true,
        disableHostCheck: true,
        port: 9086,
        //contentBase:"./app/page/index",
        proxy: {
            '/sns': {
                target: proxy.wx, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
        }
    },
    pro: {
        port: 9088
    }

}
module.exports = config;