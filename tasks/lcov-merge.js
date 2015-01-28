/*
 * grunt-lcov-merger
 * http://jemonjam.com/
 *
 * Copyright (c) 2015 Jacob Meacham
 * Licensed under the MIT license.
*/
'use strict';

module.exports = function(grunt) {
  var lcovMerger = require('./lib/lcov-merge').init(grunt);
  grunt.registerMultiTask('lcovMerge', 'Merge lcov files using the lcov-result-merger tool.', function() {
    var done = this.async();
    var options = this.options({
      emitters: ['file'],
      outputFile: 'coverage/lcov-merge.info'
    });

    if (!options.emitters || options.emitters.length === 0) {
      grunt.fail.warn('No emitters defined.');
    }

    var filesSrc = this.filesSrc;
    if (filesSrc.length === 0) {
      grunt.fail.warn('No files specified');
    }
    
    grunt.verbose.writeln('Merging lcov files...');
    lcovMerger.merge(filesSrc, options, function() {
      grunt.log.ok(filesSrc.length + ' ' + grunt.util.pluralize(filesSrc.length,'file/files') + ' merged.');
      done();
    });
  });
};