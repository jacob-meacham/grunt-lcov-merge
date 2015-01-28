/*
 * grunt-contrib-jshint
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
        files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
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
      ci: {
        options: {
            emitters: ['event']
        }
      },
      files: ['build/coverage/**/*.info']
    }
  });

  grunt.event.on('coverage', function(lcov, done) {
      console.log('Coverage event!');
      done();
      // require('coveralls').handleInput(lcov, function(err) {
      //     if (err) {
      //         return done(err);
      //     }
      //     done();
      // });
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('ci', ['jshint', 'mocha_istanbul', 'lcovMerge:ci']);
  grunt.registerTask('default', ['jshint', 'mocha_istanbul']);

};