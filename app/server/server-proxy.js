var proxy={
    dev:'http://192.168.1.135:9282',
    wang:'http://192.168.4.17'
}
var config={
    dev:{
    historyApiFallback: true,
    stats: { colors: true },
    hot: true,
    inline: true,
    progress: true,
    port: 80,
    //contentBase:"./app/page/index",
    proxy: {	
        '/api': {
	          target: proxy.dev,//pathRewrite: {'^/column' : '/column'},
	          changeOrigin: true
	        }            
        }
    },
    pro:{
    port:8080
    }

 }
module.exports=config;