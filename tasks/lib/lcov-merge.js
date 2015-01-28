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
  async = require('async'),
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
      done(err);
    }
  };

  var emitEvent = function(file, options, done) {
    return grunt.event.emit('coverage', file.contents.toString(), function(err) {
      grunt.verbose.writeln('Coverage event emitted');
      if (err) {
        grunt.log.warn('Coverage event listener failed.');
      }
      done(err);
    });
  };

  var toSet = function(arr) {
    var objectSet = {};
    for (var i in arr) {
      objectSet[arr[i]] = true;
    }

    var set = [];
    for (var val in objectSet) {
      set.push(val);
    }

    return set;
  };

  var emitters = {'file': emitFile, 'event': emitEvent};

  exports.merge = function(files, options, done) {
    // Very similar to code by Michael Weibel in lcov-result-merger
    vfs.src(files)
      .pipe(lcovResultMerger())
      .pipe(through.obj(function (file) {
        // Remove dupes
        var emitterSet = toSet(options.emitters);
        if (emitterSet.length === 0) {
          return done(null, 'No emitters specified');
        }

        async.each(emitterSet, function(emitter, callback) {
          if (emitters[emitter]) {
            emitters[emitter](file, options, callback);
          } else {
            grunt.log.warn('Emitter ' + emitter + ' not known. Skipping');
            callback();
          }
        }, function(err) {
          done(null, err);
        });
      }));
  };

  return exports;
};