var proxy = {
    wx: 'https://api.weixin.qq.com',
    anyinUrl:'http://192.168.1.159:9500',//开发环境
    //anyinUrl: 'http://183.62.140.54',//开发环境
    // anyinUrl:"http://218.17.157.119:3380",//测试环境
}
var config = {
    dev: {
        historyApiFallback: true,
        stats: { colors: true },
        hot: true,
        inline: true,
        progress: true,
        disableHostCheck: true,
        proxy: {
            '/sns': {
                target: proxy.wx,
                secure: false,
                changeOrigin: true
            },
            '/mp': {
            	target: proxy.anyinUrl,
                secure: false,
                changeOrigin: true
            },
        }
    },
    pro: {
    }

}
module.exports = config;