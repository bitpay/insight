'use strict';

module.exports = function(grunt) {

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-markdown');

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      readme: {
        files: ['README.md'],
        tasks: ['markdown']
      },
      js: {
        files: ['Gruntfile.js', 'insight.js', 'app/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        },
      },
        // we monitor only app/models/* because we have test for models only now
//      test: {
//        files: ['test/**/*.js', 'test/*.js','app/models/*.js'],
//        tasks: ['test'],
//      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'insight.js', 'app/**/*.js', 'lib/*.js', 'config/*.js'],
        options: {
          jshintrc: true
        }
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
      },
      src: ['test/**/*.js'],
    },
    nodemon: {
      dev: {
        script: 'insight.js',
        options: {
          args: [],
          ignore: ['test/**/*', 'util/**/*', 'dev-util/**/*'],
          // nodeArgs: ['--debug'],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    },
    markdown: {
      all: {
        files: [
         {
           expand: true,
           src: 'README.md',
           dest: '.',
           ext: '.html'
         }
        ]
      }
    }
  });

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);
};
