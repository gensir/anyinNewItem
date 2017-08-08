var path = require('path'),
    webpack = require('webpack'),
    glob = require('glob');
ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    AssetsPlugin = require('assets-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    entries = '';
var config = {
    entry: entries,
    output: {
        path: path.join(__dirname, 'build/public'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        publicPath: '/public/',
        jsonpFunction: 'ricky'
    },
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
            filename: 'vendor.[chunkhash].js'
        }),
        // https://github.com/webpack/webpack/issues/1315
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: 'manifest.[chunkhash].js',
            chunks: ['vendor']
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     },
        //     mangle: {
        //         screw_ie8: false
        //     }
        // }),
        new webpack.ProvidePlugin({
            Backbone: 'backbone',
            _: 'underscore'
            //'backbone.wreqr': 'backbone.wreqr'
        }),
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new AssetsPlugin({
            prettyPrint: true
        }),
        new CleanWebpackPlugin(
            ['build/public/*.js', 'build/public/*.css', 'build/lib'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose: true,        　　　　　　　　　　//开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        ),
        new CopyWebpackPlugin([{
            from: __dirname + '/asset/lib',
            to: __dirname + '/build/lib'
        }]),
        new CopyWebpackPlugin([{
            from: __dirname + '/asset/vendor.min.js',
            to: __dirname + '/build/'
        }]),
        new CopyWebpackPlugin([{
            from: __dirname + '/asset/basic.min.js',
            to: __dirname + '/build/'
        }]),
        new CopyWebpackPlugin([{
            from: __dirname + '/asset/img',
            to: __dirname + '/build/asset/img/'
        }]),
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
function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;
    if (typeof (globPath) != "object") {
        globPath = [globPath]
    }
    globPath.forEach((itemPath) => {
        glob.sync(itemPath).forEach(function (entry) {
            basename = path.basename(entry, path.extname(entry));
            //if (entry.split('/').length === 5) {
            config.plugins.push(new HtmlWebpackPlugin({
                filename: '../' + basename + '.html',
                template: 'asset/tpl/' + basename + '.html'
            }));
            entries[basename] = [entry];
            //}
        });
    });
    var elseIn = {
        vendor: ['backbone', 'underscore']
    };
    Object.assign(entries, elseIn);
    config.entry = entries;
};
getEntry([__dirname + '/app/page/*/entry/*.js'])
// /* end for multiple pages */


module.exports = config;
