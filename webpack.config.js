var path = require('path'),
    webpack = require('webpack'),
    proxy = require('./app/server/server-proxy').dev,
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    glob = require('glob'),//add
    HtmlWebpackPlugin = require('html-webpack-plugin')//add
var config = {
    entry: {
         vendor: ['backbone', 'underscore','backbone.wreqr']
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: '/dist/',
        jsonpFunction: 'ricky'
    },
    devServer: proxy,
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.html$/,
                loader: 'art-template-loader'
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!autoprefixer?{browsers:["last 2 versions", "> 5%","ie <= 9","Firefox <= 20"]}!sass'
            },
            {
                test: /\.js$/,
                loader: 'es3ify-loader!babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件
                /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/

            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js'
        }),
        // https://github.com/webpack/webpack/issues/1315
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: 'manifest.js',
            chunks: ['vendor']
        }),
        new webpack.ProvidePlugin({
            Backbone: 'backbone',
            _: 'underscore',
            'backbone.wreqr': 'backbone.wreqr'
        }),
        new ExtractTextPlugin('[name].css')
    ]
};
// var entry={
//     html:["index","login","register","logs","order","admin"],
//     init:function(){
//         var htmlurl={};arr=this.html
//         for(var i=0;i<this.html.length;i++){
//             config.entry[arr[i]]=path.join(__dirname, 'app/entry/'+arr[i])
//         }
//     }
// }
// entry.init();
getEntry([__dirname + '/app/page/*/entry/*.js']);
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    if (typeof (globPath) != "object") {
        globPath = [globPath]
    }
        for (var i in globPath) {
            var itemPath=globPath[i];
            if (globPath.hasOwnProperty(i)) {
                for (var i = 0; i < (glob.sync(itemPath)).length; i++) {
                    var entry = (glob.sync(itemPath))[i];
                    basename = path.basename(entry, path.extname(entry));
                    config.entry[basename] = [entry];
                };
                //config.entry["vendor"] = ['backbone', 'underscore', 'backbone.wreqr']
            }
        }
}


module.exports = config;
