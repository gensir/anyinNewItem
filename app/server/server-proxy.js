var proxy = {
    anyinUrl:'http://183.62.140.54',
    // anyinUrl:'http://192.168.1.159:9500'
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
		}
	},
	pro: {
		port: 10088
	}

}
module.exports = config;