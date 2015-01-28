/*
 * grunt-lcov-merger
 * http://jemonjam.com/
 *
 * Copyright (c) 2015 Jacob Meacham
 * Licensed under the MIT license.
*/
'use strict';

module.exports = function(grunt) {
  var done = this.async();
  var lcovMerger = require('./lib/lcov-result-merger').init(grunt);
  grunt.registerMultiTask('lcov-merge', 'Merge lcov files with lcov-result-merger.', function() {
    var options = this.option({
      emitters: ['file'],
      outputFile: 'coverage/lcov-merge.info'
    });

    if (!options.emitters || options.emitters.length === 0) {
      grunt.fail.warn('No emitters defined.');
    }

    grunt.verbose.write('Merging lcov files...');
    lcovMerger.merge(this.filesSrc, options, function() {
      grunt.log.ok(this.filesSrc.length + ' ' + grunt.util.pluralize(this.filesSrc.length,'file/files') + ' merged.');
      done();
    });
  });
};