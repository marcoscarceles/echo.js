'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // configurable paths
  var appConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    jasmine: {
      src: 'src/{,*/}*.js',
      options: {
        specs: 'test/jasmine/*.js'
      }
    },
    casperjs: {
      options: {
        async: {
          parallel: false
        }
      },
      files: ['test/casperjs/*.js']
    },
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: 'src/{,*/}*'
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'src'),
              mountFolder(connect, 'test/casperjs/docroot')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, appConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'dist/*',
            '!dist/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ]
    },
    uglify: {
      dist: {
        files: {
          'dist/scripts/scripts.js': [
            'dist/scripts/scripts.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'jasmine',
    'clean:server',
    'connect:test',
    'casperjs'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test'
  ]);
};
