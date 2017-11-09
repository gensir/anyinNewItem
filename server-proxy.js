var proxy={
    dev:'http://192.168.48.51:83',
    pro:'http://120.77.151.97:83'
}
var config={
    dev:{
        historyApiFallback: true,
        stats: { colors: true },
        hot: true,
        inline: true,
        progress: true,
        proxy: {	
        '/api/web': {
	          target: proxy.dev,//pathRewrite: {'^/column' : '/column'},
	          changeOrigin: true
	        }            
        }
    },
    port: '20086' 

 };
module.exports=config;