var proxy = {
    anyinUrl: 'http://183.62.140.54',
    test: 'http://192.168.4.95:8080',
    // anyinUrl:'http://192.168.1.159:9500'
    lsq: 'http://192.168.4.69:8080',
    lsq1: 'http://192.168.4.99:8080',
    lsq2: 'http://10.9.33.115:8080',  
    se159: 'http://192.168.1.159:9500',
    unyl:"https://gateway.95516.com"
    
}
var config = {
    dev: {
        historyApiFallback: true,
        stats: { colors: true },
        hot: true,
        inline: true,
        progress: true,
        disableHostCheck:true,
        port: 10086,
        //contentBase:"./app/page/index",
        proxy: {
             '/gateway': {
            	target: proxy.unyl, //pathRewrite: {'^/column' : '/column'},            	
                secure: false,
                changeOrigin: true
            },        	       	
            '/mp': {
            	//target: proxy.lsq2, //pathRewrite: {'^/column' : '/column'},            	
	            target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/mps': {
                target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/common': {
                target: proxy.test, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            },
            '/sys': {
                target: proxy.test, //pathRewrite: {'^/column' : '/column'},
                secure: false,
                changeOrigin: true
            }
        }
    },
    pro: {
        port: 10088
    }

}
module.exports = config;