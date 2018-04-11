// Generated on 2017-08-09 using
// generator-webapp 1.0.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);
    var uglifyConfig = require('./uglifyConfig')
    // Automatically load required grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    // Configurable paths
    var config = {
        isdebug:true,
        app: 'app',
        dist: 'dist',
        multiPage: [
            '<%= config.app %>/index.html',
            '<%= config.app %>/login.html'
        ]
    };
    //proxy
    var proxy = require("./app/server/proxy")
    var middleware = require('http-proxy-middleware');
    var apiProxy = [];
    for (var i in proxy.dev.proxy) {
        if (proxy.dev.proxy.hasOwnProperty(i)) {
            apiProxy.push(middleware(i, {
                target: proxy.dev.proxy[i].target,
                changeOrigin: true,
                ws: true
            }))
        }
    }
    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            //   bower: {
            //     files: ['bower.json'],
            //     tasks: ['wiredep']
            //   },
            babel: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                tasks: ['babel:dist']
            },
            babelTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['babel:test', 'test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'postcss']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            }
        },

        browserSync: {
            options: {
                notify: false,
                background: true
            },
            livereload: {
                options: {
                    files: [
                        '<%= config.app %>/{,*/}*.html',
                        '<%= config.app %>/{,*/}*.php',
                        '.tmp/styles/{,*/}*.css',
                        '<%= config.app %>/images/{,*/}*',
                        '.tmp/scripts/{,*/}*.js',
                        '!.tmp/scripts/plugin/{,*/}*.js',
                        '!.tmp/styles/plugin/{,*/}*.css'
                    ],
                    port: 9010,
                    weinre: {
                        port: 9090
                    },
                    middleware: apiProxy,
                    server: {
                        baseDir: ['.tmp', config.app],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    open: false,
                    logLevel: 'silent',
                    host: 'localhost',
                    server: {
                        baseDir: ['.tmp', './test', config.app],
                        routes: {
                            '/bower_components': './bower_components'
                        }
                    }
                }
            },
            dist: {
                options: {
                    background: false,
                    server: '<%= config.dist %>'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        eslint: {
            target: [
                'Gruntfile.js',
                '<%= config.app %>/scripts/{,*/}*.js',
                '!<%= config.app %>/scripts/vendor/*',
                '!<%= config.app %>/scripts/plugin/*',
                'test/spec/{,*/}*.js'
            ]
        },

        // Mocha testing framework configuration options
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://<%= browserSync.test.options.host %>:<%= browserSync.test.options.port %>/*.html']
                }
            }
        },

        // Compiles ES6 with Babel
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/scripts',
                    src: ['{,*/}*.js', '!plugin/{,*/}*.js'],
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            concat: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: ['{,*/}*.js', '{,*/}vendor.js', '!plugin/{,*/}*.js'],
                    dest: '.tmp/concat/scripts',
                    ext: '.js'
                }]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        sass: {
            options: {
                sourceMap: true,
                sourceMapEmbed: true,
                sourceMapContents: true,
                includePaths: ['.']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.{scss,sass}'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            },
            server: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles',
                    src: ['*.{scss,sass}'],
                    dest: '.tmp/styles',
                    ext: '.css'
                }]
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixed styles
                    require('autoprefixer-core')({
                        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
                    })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
            // ,
            // distbuild: {
            //     files: [{
            //         expand: true,
            //         cwd: '<%= config.app %>/styles',
            //         src: '{,*/}*.css',
            //         dest: '.tmp/styles/'
            //     }]
            // }
        },

        // Automatically inject Bower components into the HTML file
        wiredep: {
            app: {
                src: ['<%= config.app %>/*.html'],
                ignorePath: /^(\.\.\/)*\.\./
            },
            sass: {
                src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
                ignorePath: /^(\.\.\/)+/
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= config.dist %>/scripts/{,*/}*.js',
                    '!<%= config.dist %>/scripts/plugin/{,*/}*.js',
                    '!<%= config.dist %>/styles/plugin/{,*/}*.css',
                    '<%= config.dist %>/styles/{,*/}*.css',
                    '<%= config.dist %>/images/{,*/}*.*',
                    '<%= config.dist %>/styles/fonts/{,*/}*.*',
                    '<%= config.dist %>/*.{ico,png}'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.app %>/*.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: [
                    '<%= config.dist %>',
                    '<%= config.dist %>/images',
                    '<%= config.dist %>/styles'
                ]
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {

            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    // true would impact styles with attribute selectors
                    removeRedundantAttributes: false,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care
        // of minification. These next options are pre-configured if you do not
        // wish to use the Usemin blocks.
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'styles/{,*/}*.css'
                    ]
                }]
            }
        },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= config.dist %>/scripts/scripts.js': [
        //         '<%= config.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        uglify: {
            options: {
                //可以给压缩文件首行添加注释
                banner: '/* last-uglify <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: '<%= config.isdebug %>',
                ie8: '<%= config.isdebug %>',
                sourceMap: !'<%= config.isdebug %>',
                beautify: !'<%= config.isdebug %>',
                compress: {
                    drop_console: '<%= config.isdebug %>',
                    drop_debugger:'<%= config.isdebug %>'
                }
            },
            biuldAll: {//任务四：合并压缩a.js和b.js
                files: {
                    'app/scripts/plugin/basic.min.js': uglifyConfig
                }
            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        'scripts/custom/{,*/}*.js'
                    ]
                }]
            }
        },
        // concat: {
        //   dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*',
                        'styles/plugin/{,*/}*.*',
                        'img/{,*/}*.*',
                        'scripts/plugin/{,*/}*.*',
                        'js/{,*/}*.*',
                        'css/{,*/}*.*',
                        'images/{,*/}*.*'
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                'babel:dist',
                'sass:server'
            ],
            test: [
                'babel'
            ],
            dist: [
                'babel',
                'sass',
                'imagemin'
                //'svgmin'
            ]
        }
    });


    grunt.registerTask('serve', 'start the server and preview your app', function (target) {

        if (target === 'dist') {
            return grunt.task.run(['build', 'browserSync:dist']);
        }

        grunt.task.run([
            'clean:server',
            //   'wiredep',
            'concurrent:server',
            'postcss',
            'browserSync:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });

    grunt.registerTask('test', function (target) {
        if (target !== 'watch') {
            grunt.task.run([
                'clean:server',
                'concurrent:test',
                'postcss'
            ]);
        }

        grunt.task.run([
            'browserSync:test',
            'mocha'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        //'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'copy:dist',
        'postcss',
        'concat',
        'babel:concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
    ]);

    grunt.registerTask('default', [
        'newer:eslint',
        'build'
    ]);
};
