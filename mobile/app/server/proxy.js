var proxy = {
    seal: 'http://192.168.1.135:9282',
    wx: 'https://api.weixin.qq.com',
    qq:"https://map.qq.com",
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
            '/nav': {
                target: proxy.qq, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/weixin': {
                target: proxy.seal, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            }
        }
    },
    pro: {
        port: 9088
    }

}
module.exports = config;