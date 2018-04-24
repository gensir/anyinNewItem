var proxy = {
    //anyinUrl: 'http://183.62.140.54',//开发环境
    // anyinUrl:'http://192.168.1.159:9500',//开发环境
    // anyinUrl:"http://218.17.157.119:3380",//测试环境
    anyinUrl: 'http://10.9.2.116:8080',//麦达剑
    // anyinUrl:'http://10.9.2.82:8080',//陈春亮
    // anyinUrl:'http://10.9.2.157:8080',//lsq
    lsq3: 'http://10.9.2.157:8080',
    unyl:"https://gateway.95516.com",
}
var config = {
    dev: {
        historyApiFallback: true,
        stats: { colors: true },
        hot: true,
        inline: true,
        progress: true,
        disableHostCheck:true,
        //contentBase:"./app/page/index",
        proxy: {
            '/gateway': {
            	target: proxy.unyl, //pathRewrite: {'^/column' : '/column'},            	
                secure: false,
                changeOrigin: true
            },
            '/mp': {
            	target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},            	
	           //  target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/ps': {
            	target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},            	
	           //  target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/mps': {
                target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/common': {
                target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/sys': {
                target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            }
        }
    },
    port: '20086' 

}
module.exports = config;