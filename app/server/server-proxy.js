var proxy = {
	dev: 'http://192.168.1.135:9282',
	wang: 'http://192.168.4.17',
    jsl: 'http://192.168.4.94:8086',
    local:'http://192.168.1.136',
    anyinUrl:'http://183.62.140.54',
    sealShop:'http://192.168.48.50:9133',
    logs:'http://192.168.4.60:8080',
}
var config = {
	dev: {
		historyApiFallback: true,
		stats: { colors: true },
		hot: true,
		inline: true,
		progress: true,
		port: 10086,
		//contentBase:"./app/page/index",
		proxy: {
            '/api/sealnet': {
                target: proxy.local, //pathRewrite: {'^/column' : '/column'},
                secure: false,
				changeOrigin: true
			},
			'/api/sealShops':{
                target: proxy.sealShop, //pathRewrite: {'^/column' : '/column'},
                secure: false,
				changeOrigin: true
			},
			'/api': {
                target: proxy.sealShop, //pathRewrite: {'^/column' : '/column'},
                secure: false,
				changeOrigin: true
			},
			'/mp/':{
				target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
				changeOrigin: true
			},
			'/mps':{
				target: proxy.anyinUrl, //pathRewrite: {'^/column' : '/column'},
                secure: false,
				changeOrigin: true
			},			
			// '/mp/commSignetLog':{
			// 	target: proxy.logs, //pathRewrite: {'^/column' : '/column'},
            //     secure: false,
			// 	changeOrigin: true
			// }
		}
	},
	pro: {
		port: 10088
	}

}
module.exports = config;