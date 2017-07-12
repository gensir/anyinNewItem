var proxy = {
	dev: 'http://192.168.1.135:9282',
	wang: 'http://192.168.4.17',
	jsl: 'http://192.168.4.94:8086',
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
				target: proxy.dev, //pathRewrite: {'^/column' : '/column'},
				changeOrigin: true
			},
			'/api': {
				target: proxy.jsl, //pathRewrite: {'^/column' : '/column'},
				changeOrigin: true
			}
		}
	},
	pro: {
		port: 10088
	}

}
module.exports = config;