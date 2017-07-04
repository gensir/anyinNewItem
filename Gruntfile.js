var uglifyConfig = [
    'asset/lib/jquery/jquery.min.js',
    'asset/lib/bootstrap/js/bootstrap.min.js',
    'asset/lib/bootbox/bootbox.min.js',
]
module.exports = function(grunt){

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                //可以给压缩文件首行添加注释
                banner: '/* last-uglify <%= grunt.template.today("yyyy-mm-dd") %> */\n', 
                mangle: false,
                ie8:true
            },
            biuldAll: {//任务四：合并压缩a.js和b.js
                files: {
                    'asset/basic.min.js': uglifyConfig,
                    'asset/vendor.min.js':'asset/lib/vendor/vendor.min.js'
                }
            }
        }
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 默认任务
    grunt.registerTask('default', ['uglify:biuldAll']);
}