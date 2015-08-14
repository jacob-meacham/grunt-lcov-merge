# grunt-lcov-merge 
[![Build Status](https://travis-ci.org/jacob-meacham/grunt-lcov-merge.svg?branch=master)](https://travis-ci.org/jacob-meacham/grunt-lcov-merge)
[![npm version](https://badge.fury.io/js/grunt-lcov-merge.svg)](http://badge.fury.io/js/grunt-lcov-merge)
[![Coverage Status](https://coveralls.io/repos/jacob-meacham/grunt-lcov-merge/badge.svg?branch=master)](https://coveralls.io/r/jacob-meacham/grunt-lcov-merge?branch=master)
[![Code Climate](https://codeclimate.com/github/jacob-meacham/grunt-lcov-merge/badges/gpa.svg)](https://codeclimate.com/github/jacob-meacham/grunt-lcov-merge)
[![Dependency Status](https://www.versioneye.com/user/projects/54cbfc3cde7924f81a0001e4/badge.svg?style=flat)](https://www.versioneye.com/user/projects/54cbfc3cde7924f81a0001e4)

> Grunt plugin to merge lcov files from multiple test runs, for use with a tool like [coveralls](coveralls.io).

## Getting Started
This plugin requires Grunt `0.4.0`

To install, add grunt-lcov-merge to your package.json. The easiest way to do that is

```shell
npm install grunt-lcov-merge --save-dev
```

Once the plugin has been installed, you'll need to enable it in your Gruntfile by adding

```js
grunt.loadNpmTasks('grunt-lcov-merge');
```

You can then run with
```shell
grunt lcovMerge
```

## Options
#### emitters
Type: `Array`
Default: `['file']`

What emitters to send the merged data to. Supported emitters are 'file', which sends the merged data to a file, and 'event', which sends it out to the 'coverage' event and can be listened to with 

```js
grunt.event.on('coverage', function(lcov, done) {});
```

#### outputFile
Type: `String`
Default `coverage/lcov-merge.info`

If a file emitter is specified, this is the output file to pipe data to.

### Example
```js
    grunt.initConfig({
    jshint: {
        src: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js'],
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
          emitters: ['event', 'file'],
          outputFile: 'mergeLcov.info'
      },
      src: ['build/coverage/*.info', 'build/coverage/**/*.info']
    }
  });

  grunt.event.on('coverage', function(lcov, done) {
    // See below
    done();
  });

  grunt.loadNpmTasks('grunt-lcov-merge');
```

Note that grunt-lcov-merge allows for source files to be specified via any [file format](http://gruntjs.com/configuring-tasks#files).

## Event emitter
One of the most useful ways to consume this plugin is to use the coverage event to send the lcov data to a service like coveralls:

```js
grunt.event.on('coverage', function(lcov, done) {
    require('coveralls').handleInput(lcov, function(err) {
        if (err) {
          return done(err);
        }
        done();
    });
```

Using the coveralls module means that Travis-CI can automatically send your merged LCOV to coveralls.

## Version History
* 0.1.0 - Initial version
* 0.1.1 - Trim down the number of files in the distribution
* 0.1.2. - Update dependencies, work around coveralls issue.
* 0.1.3 - Documentation updates
* 1.0.0 - Official release