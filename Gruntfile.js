'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
        files: {
            src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
        },
        options: {
            jshintrc: true
        }
    },

    mocha_istanbul: {
      coverage: {
          src: 'test/**/*.spec.js',
          options: {
              coverageFolder: 'build/coverage',
              reportFormats: ['lcov'],
          }
      }
    },

    lcovMerge: {
      options: {
          emitters: ['file', 'event'],
          outputFile: 'out.lcov'
      },
      files: ['build/coverage/*.info', 'build/coverage/**/*.info']
    }
  });

  grunt.event.on('coverage', function(lcov, done) {
    // Coveralls uses argv to set the basePath
    var oldArgv = process.argv[2];
    process.argv[2] = '';
    require('coveralls').handleInput(lcov, function(err) {
      process.argv[2] = oldArgv;
      if (err) {
        return done(err);
      }
      done();
    });
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('ci', ['jshint', 'mocha_istanbul', 'lcovMerge']);
  grunt.registerTask('default', ['jshint', 'mocha_istanbul']);

};
