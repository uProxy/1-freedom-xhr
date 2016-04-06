module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('jit-grunt')(grunt, {});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: ['build'],
      test: ['test/coverage'],
    },

    browserify: {
      dist: {
        src: [],
        dest: 'build/index.js',
        options: {
          require: [ './src/index.js:freedom-xhr' ]
        }
      },
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      src: ['src/**/*.js'],
      test: ['test/*.js', 'test/vendor/freedom.js', 'test/vendor/chrome.polyfill.js'],
      gruntfile: ['Gruntfile.js'],
    },

    jasmine: {
      unit: {
        src: 'src/chunkreassembler.js',
        options: {
          specs: 'test/unit.js',
          vendor: [ 'test/vendor/*.js', 'node_modules/es6-promise/dist/es6-promise.js' ],
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
          },
          keepRunner: false
        }
      }
    },

    jasmine_chromeapp: {
      providers: {
        files: [
          { src: 'node_modules/freedom-for-chrome/freedom-for-chrome.js', dest: '/' },
          { src: 'build/index.js', dest: '/' },
          { src: 'test/integration.js', dest: '/' },
          { src: 'test/demo.js*', dest: '/' },
        ],
        options: {
          paths: [
            'node_modules/freedom-for-chrome/freedom-for-chrome.js',
            'test/integration.js'
          ],
          outfile: '.build_chrome',  // The default ('.build') collides with jasmine_firefoxaddon
          keepRunner: false
        }
      }
    },

    jasmine_firefoxaddon: {
      tests: ['test/integration_firefox.js'],
      resources: ['build/index.js', 'test/demo.js*'],
      helpers: ['node_modules/freedom-for-firefox/freedom-for-firefox.jsm']
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin'
      }
    }
  });

  grunt.registerTask('build', [
    'browserify:dist'
  ]);

  grunt.registerTask('test', [
    'jshint',
    'jasmine',
    'jasmine_chromeapp',
    'jasmine_firefoxaddon'
  ]);

  grunt.registerTask('default', [
    'build',
    'test'
  ]);

  grunt.registerTask('release', [
    'test',
    'bump-only',
    'changelog',
    'bump-commit'
  ]);
};
