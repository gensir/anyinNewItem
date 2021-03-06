module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        // Wipe out previous builds and test reporting.
        clean: {
            init: ["dist/", "test/reports"],
            after: ["dist/app/asset/img/bg-all.psd",
                "dist/vendor/bower/almond",
                "dist/vendor/bower/mocha",
                "dist/vendor/bower/sinon",
                "dist/vendor/bower/chai",
                "dist/vendor/bower/html5-boilerplate",
                "dist/vendor/bower/qunit",
                "dist/vendor/bower/requireCss",
                "dist/vendor/bower/vendor"
            ]
        },

        // Run your source code through JSHint's defaults.
        jshint: ["app/**/*.js"],

        // This task uses James Burke's excellent r.js AMD builder to take all
        // modules and concatenate them into a single file.
        requirejs: {
            release: {
                options: {
                    mainConfigFile: "app/config.js",
                    generateSourceMaps: true,
                    include: ["main"],
                    insertRequire: ["main"],
                    out: "dist/source.min.js",
                    optimize: "uglify2",

                    // Since we bootstrap with nested `require` calls this option allows
                    // R.js to find them.
                    findNestedDependencies: true,

                    // Include a minimal AMD implementation shim.
                    name: "almond",

                    // Setting the base url to the distribution directory allows the
                    // Uglify minification process to correctly map paths for Source
                    // Maps.
                    baseUrl: "dist/app",

                    // Wrap everything in an IIFE.
                    wrap: true,

                    // Do not preserve any license comments when working with source
                    // maps.  These options are incompatible.
                    preserveLicenseComments: false
                }
            }
        },

        // This task simplifies working with CSS inside Backbone Boilerplate
        // projects.  Instead of manually specifying your stylesheets inside the
        // HTML, you can use `@imports` and this task will concatenate only those
        // paths.
        styles: {
            // Out the concatenated contents of the following styles into the below
            // development file path.
            "dist/styles.css": {
                // Point this to where your `index.css` file is location.
                src: "app/styles/index.css",

                // The relative path to use for the @imports.
                paths: ["app/styles"],

                // Rewrite image paths during release to be relative to the `img`
                // directory.
                forceRelative: "/app/asset/img/"
            }
        },

        // Minfiy the distribution CSS.
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1,
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            minify: {
                expand: true,
                cwd: 'app/',
                src: ['app/styles/css/*.css'],
                dest: 'dist/app/styles/css'
            }
        },

        server: {
            options: {
                host: "0.0.0.0",
                port: 8123
            },

            development: {},

            release: {
                options: {
                    prefix: "dist"
                }
            },

            test: {
                options: {
                    forever: false,
                    port: 8001
                }
            }
        },

        processhtml: {
            release: {
                files: {
                    "dist/index.html": ["index.html"]
                }
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                beautify: false,
                mangle: false,
                ie8: true,
                compress: {
                    drop_console: true
                }
            },
            buildall: { //任务三：按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand: true,
                    cwd: 'app/lib', //js目录下
                    src: '**/*.js', //所有js文件
                    dest: 'dist/app/lib' //输出到此目录下
                }]
            },
            drop: {
                files: [{
                    expand: true,
                    cwd: 'dist', //js目录下
                    src: ['app/*.js', 'app/{lib,view}/*.js', 'app/{model,routers}/**/*.js', 'vendor/bower/{,*/,**/*/,**/**/*/}*.js', '!vendor/bower/jquery/src/*.js', '!vendor/bower/sinon/test/sinon/util/*.js'], //所有js文件
                    dest: 'dist' //输出到此目录下
                }]
            }
        },
        // Move vendor and app logic during a build.
        copy: {
            release: {
                files: [{
                        src: ["app/**"],
                        dest: "dist/"
                    },
                    {
                        src: "vendor/**",
                        dest: "dist/"
                    },
                    {
                        src: ["*.html", 'favicon.ico'],
                        dest: "dist/"
                    }
                ]
            }
        },

        compress: {
            release: {
                options: {
                    archive: "dist/source.min.js.gz"
                },

                files: ["dist/source.min.js"]
            }
        },

        // Unit testing is provided by Karma.  Change the two commented locations
        // below to either: mocha, jasmine, or qunit.
        karma: {
            options: {
                basePath: process.cwd(),
                singleRun: true,
                captureTimeout: 7000,
                autoWatch: true,

                reporters: ["progress", "coverage"],
                browsers: ["PhantomJS"],

                // Change this to the framework you want to use.
                frameworks: ["jasmine"],

                plugins: [
                    "karma-jasmine",
                    "karma-mocha",
                    "karma-qunit",
                    "karma-phantomjs-launcher",
                    "karma-coverage"
                ],

                preprocessors: {
                    "app/**/*.js": "coverage"
                },

                coverageReporter: {
                    type: "lcov",
                    dir: "test/coverage"
                },

                files: [
                    // You can optionally remove this or swap out for a different expect.
                    "vendor/bower/chai/chai.js",
                    "vendor/bower/requirejs/require.js",
                    "test/runner.js",

                    {
                        pattern: "app/**/*.*",
                        included: false
                    },
                    // Derives test framework from Karma configuration.
                    {
                        pattern: "test/<%= karma.options.frameworks[0] %>/**/*.spec.js",
                        included: false
                    },
                    {
                        pattern: "vendor/**/*.js",
                        included: false
                    }
                ]
            },

            // This creates a server that will automatically run your tests when you
            // save a file and display results in the terminal.
            daemon: {
                options: {
                    singleRun: false
                }
            },

            // This is useful for running the tests just once.
            run: {
                options: {
                    singleRun: true
                }
            }
        },

        coveralls: {
            options: {
                coverage_dir: "test/coverage/PhantomJS 1.9.2 (Linux)/"
            }
        },
        watch: {
            scripts: {
                files: ['app/styles/css/*.css'],
                tasks: ['concat'],
                options: {
                    spawn: false
                }
            }
        },
        concat: {
            options: {

            },
            dist: {
                src: ['app/styles/css/*.css'],
                dest: 'app/styles/index.css'
            }
        }

    });

    // Grunt contribution tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    // // Third-party tasks.
    // grunt.loadNpmTasks("grunt-karma");
    // grunt.loadNpmTasks("grunt-karma-coveralls");
    grunt.loadNpmTasks("grunt-processhtml");

    // Grunt BBB tasks.
    grunt.loadNpmTasks("grunt-bbb-server");
    grunt.loadNpmTasks("grunt-bbb-requirejs");
    grunt.loadNpmTasks("grunt-bbb-styles");

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-concat');
    // Create an aliased test task.
    // grunt.registerTask("test", ["karma:run"]);


    grunt.registerTask("old", [
        "clean:init",
        // "jshint",
        "processhtml",
        "uglify:buildall",
        "copy",
        // "requirejs",
        "cssmin"
        // "uglify:buildall"
        // "clean:after"
        // "styles",
        // "concat",
        // "watch"
    ]);

    grunt.registerTask("dev", [
        "concat",
        "watch"
    ]);

    grunt.registerTask("test", [
        "clean:init",
        "uglify:buildall"
    ]);

    grunt.registerTask("build", [
        "clean:init",
        "copy",
        "uglify:buildall",
        "clean:after"
    ]);

    // When running the default Grunt command, just lint the code.    
    grunt.registerTask("default", [
        "clean:init",
        "copy",
        "uglify:buildall",
        "clean:after"
    ]);

};