module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    // show elapsed time at the end
    require('time-grunt')(grunt);

    // load all grunt tasks
    require('load-grunt-tasks')(grunt, {
      pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
              ' * chrome.sockets.tcp.xhr v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= pkg.license %> License\n' +
              ' */\n\n',

        clean: {
            dev: ['dev'],
            dist: ['dist'],
            test: ['test/coverage'],
        },

        uglify: {
            dev: {
                options: {
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },

                files: {
                    'dev/chrome.sockets.tcp.xhr.js': ['src/chrome.sockets.tcp.xhr.js'],
                }
            },

            dist: {
                options: {
                    banner: '<%= banner %>',
                },

                files: {
                    'dist/chrome.sockets.tcp.xhr.min.js': ['src/chrome.sockets.tcp.xhr.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },

            dist: ['src/*.js'],
            test: ['test/*.js', 'test/vendor/chrome.polyfill.js'],
            gruntfile: ['Gruntfile.js'],
        },

        jasmine: {
            dist: {
                src: 'src/*.js',
                options: {
                    specs: 'test/unit.js',
                    vendor: 'test/vendor/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'test/coverage/coverage.json',
                        report: 'test/coverage',
                        /*
                        thresholds: {
                            lines: 75,
                            statements: 75,
                            branches: 75,
                            functions: 90
                        }
                        */
                    }
                }
            }
        },

        jasmine_chromeapp: {
            providers: {
                files: [
                    {src: 'dev/chrome.sockets.tcp.xhr.js', dest: '/'},
                    {src: 'test/integration.js', dest: '/', expand: true},
                ],
                options: {
                    paths: [
                        'dev/chrome.sockets.tcp.xhr.js',
                        'test/integration.js'
                    ],
                    keepRunner: false
                }
            }
        },

        coveralls: {
            all: {
                src: 'test/report/lcov/lcov.info'
            }
        },

        watch: {
            options: {
                spawn: false,
                livereload: true,
            },

            test: {
                files: ['test/unit.js', 'test/vendor/*.js'],
                tasks: ['jshint:test', 'jasmine']
            },

            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },

            js: {
                files: ['src/*.js'],
                tasks: ['jshint:dist', 'uglify', 'jasmine']
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin'
            }
        }
    });

    grunt.registerTask('test', [
        'jshint',
        'clean',
        'uglify',
        'jasmine',
        'jasmine_chromeapp'
    ]);

    grunt.registerTask('default', [
        'test'
    ]);

    grunt.registerTask('release', [
        'test',
        'bump-only',
        'changelog',
        'bump-commit'
    ]);
};
