/*
 * grunt-lcov-merger
 * http://jemonjam.com/
 *
 * Copyright (c) 2015 Jacob Meacham
 * Licensed under the MIT license.
*/
'use strict';

var vfs = require('vinyl-fs'),
  through = require('through2'),
  chalk = require('chalk'),
  lcovResultMerger = require('lcov-result-merger');

exports.init = function(grunt) {
  var exports = {};

  var emitFile = function(file, options, done) {
    try {
     grunt.file.write(options.outputFile, file.contents);
     grunt.verbose.writeln('Output generated in ' + chalk.cyan(options.outputFile) + '.');
     done();
    } catch (err) {
      grunt.log.warn('Writing output to ' + chalk.cyan(options.outputFile) + ' failed.');
      grunt.fail.warn(err);
    }
  };

  var emitEvent = function(file, options, done) {
    grunt.event.emit('coverage', file.contents, function(d) {
      grunt.log.ok('Coverage event emitted');
      done(d);
    });
  };

  var emitters = {'file': emitFile, 'event': emitEvent};

  exports.merge = function(files, options, done) {
    // Very similar to code by Michael Weibel in lcov-result-merger
    vfs.src(files)
      .pipe(lcovResultMerger())
      .pipe(through.obj(function (file) {
        // Remove dupes
        var emitter_set = {};
        for (var i in options.emitters) {
          emitter_set[options.emitters[i]] = true;
        }

        for (var emitter in emitter_set) {
          if (emitters[emitter]) {
            emitters[emitter](file, options, done);
          } else {
            grunt.fail.warn('Emitter ' + emitter + ' not known.');
          }
        }
      }));
  };

  return exports;
};