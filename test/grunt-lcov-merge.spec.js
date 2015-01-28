'use strict';

var grunt = require('grunt');
var lcovMerge = require('../tasks/lib/lcov-merge').init(grunt);
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.should();
var expect = chai.expect;

describe('grunt-lcov-merge', function() {
  var eventCallback = function(file, callback) {
    callback();
  };

  var sandbox;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should fail if no emitters are specified', function(done) {
    lcovMerge.merge(['lcov.info'], {}, function(results, err) {
      expect(err).to.exist();
      expect(results).to.not.exist();
      done();
    });
  });

  it('should emit a file', function(done) {
    var writeStub = sandbox.stub(grunt.file, 'write');

    lcovMerge.merge(['lcov.info'], {emitters: ['file'], outputFile: 'test/result/merge.info'}, function(results, err) {
      expect(err).to.not.exist();
      writeStub.should.have.been.calledWith('test/result/merge.info');
      done();
    });
  });

  it('should emit an event', function(done) {
    var eventSpy = sandbox.spy(eventCallback);
    grunt.event.once('coverage', eventSpy);

    lcovMerge.merge(['lcov.info'], {emitters: ['event']}, function(results, err) {
      expect(err).to.not.exist();
      eventSpy.should.have.callCount(1);
      done();
    });
  });

  it('should fail if the event emit fails', function(done) {
    grunt.event.once('coverage', function(file, callback) {
      callback('Error');
    });

    lcovMerge.merge(['lcov.info'], {emitters: ['event']}, function(results, err) {
      expect(err).to.exist();
      done();
    });
  });

  it('should not fail if an emitter is unknown', function(done) {
    var warnSpy = sandbox.spy(grunt.log, 'warn');
    var eventSpy = sandbox.spy(eventCallback);
    grunt.event.once('coverage', eventSpy);

    lcovMerge.merge(['lcov.info'], {emitters: ['event', 'foo']}, function(results, err) {
      expect(err).to.not.exist();
      warnSpy.should.have.callCount(1);
      eventSpy.should.have.callCount(1);
      done();
    });
  });

  it('should only use a single emitter when multiple copies are present', function(done) {
    var eventSpy = sandbox.spy(eventCallback);
    grunt.event.once('coverage', eventSpy);

    lcovMerge.merge(['lcov.info'], {emitters: ['event', 'event']}, function(results, err) {
      expect(err).to.not.exist();
      eventSpy.should.have.callCount(1);
      done();
    });
  });

  it('should emit to multiple emitters', function(done) {
    var eventSpy = sandbox.spy(eventCallback);
    grunt.event.once('coverage', eventSpy);

    var writeStub = sandbox.stub(grunt.file, 'write');

    lcovMerge.merge(['lcov.info'], {emitters: ['file', 'event'], outputFile: 'test/result/merge.info'}, function(results, err) {
      expect(err).to.not.exist();
      writeStub.should.have.callCount(1);
      writeStub.should.have.been.calledWith('test/result/merge.info');
      
      eventSpy.should.have.callCount(1);
      done();
    });
  });

  it('should error when no output file is present', function(done) {
    lcovMerge.merge(['lcov.info'], {emitters: ['file']}, function(results, err) {
      expect(err).to.exist();
      done();
    });
  });
});