/* global describe, it, assert, require, __dirname */

var fs = require('fs');
var path = require('path');
var parser = require('test262-parser');
var glob = require('glob');

var BASEDIR = path.resolve(__dirname, '../node_modules/test262/test');
var TESTS = 'built-ins/Promise/**/*.js';

var BLACKLIST = [
  // These tests mutate the global state.
  'built-ins/Promise/all/does-not-invoke-array-setters.js',
  'built-ins/Promise/all/invoke-resolve.js',
  'built-ins/Promise/all/invoke-resolve-get-error.js',
  'built-ins/Promise/all/iter-close.js',
  'built-ins/Promise/race/invoke-resolve.js',
  'built-ins/Promise/race/invoke-resolve-get-error.js',
  // These tests reflect a v8 bug (anonymous functions shouldn't have
  // an 'own' name property).
  'built-ins/Promise/all/resolve-element-function-name.js',
  'built-ins/Promise/executor-function-name.js',
  'built-ins/Promise/reject-function-name.js',
  'built-ins/Promise/resolve-function-name.js',
  // These tests require unshimmable ES6 "construct" semantics.
  'built-ins/Promise/all/resolve-element-function-nonconstructor.js',
  'built-ins/Promise/executor-function-nonconstructor.js',
  'built-ins/Promise/reject-function-nonconstructor.js',
  'built-ins/Promise/resolve-function-nonconstructor.js',
  // The es6-shim package can't assign `catch` as a function name without
  // breaking compatibility with pre-ES5 code.
  'built-ins/Promise/prototype/catch/name.js'
];
// Node 0.10 doesn't set the descriptor correctly for 'name' and 'length'
// properties of functions.  There's not much we can do about it, other
// than skip those tests.
if (!Object.getOwnPropertyDescriptor(function f() {}, 'length').configurable) {
  BLACKLIST.push(
    'built-ins/Promise/all/length.js',
    'built-ins/Promise/all/name.js',
    'built-ins/Promise/all/resolve-element-function-length.js',
    'built-ins/Promise/executor-function-length.js',
    'built-ins/Promise/length.js',
    'built-ins/Promise/name.js',
    'built-ins/Promise/prototype/catch/length.js',
    'built-ins/Promise/prototype/catch/name.js',
    'built-ins/Promise/prototype/then/length.js',
    'built-ins/Promise/prototype/then/name.js',
    'built-ins/Promise/race/length.js',
    'built-ins/Promise/race/name.js',
    'built-ins/Promise/reject-function-length.js',
    'built-ins/Promise/reject/length.js',
    'built-ins/Promise/reject/name.js',
    'built-ins/Promise/resolve-function-length.js',
    'built-ins/Promise/resolve/length.js',
    'built-ins/Promise/resolve/name.js'
  );
  // There are similar bugs with Object.isExtensible
  BLACKLIST.push(
    'built-ins/Promise/all/resolve-element-function-extensible.js',
    'built-ins/Promise/executor-function-extensible.js',
    'built-ins/Promise/reject-function-extensible.js',
    'built-ins/Promise/resolve-function-extensible.js'
  );
}

describe('test262', function () {
  /* jshint evil:true */ // It doesn't like the `eval`s here.
  /* eslint-disable no-new-func */
  'use strict';

  var $ERROR = function (msg) { throw new Error(msg); };
  var test262assert = new Function(
    '$ERROR',
    fs.readFileSync(path.join(BASEDIR, '../harness/assert.js'), 'utf8') +
      '\n return assert;'
  )($ERROR);
  var Test262Error = function Test262Error(msg) {
    var self = new Error(msg);
    Object.setPrototypeOf(self, Test262Error.prototype);
    return self;
  };
  Object.setPrototypeOf(Test262Error, Error);
  Test262Error.prototype = Object.create(Error.prototype);
  Test262Error.prototype.constructor = Test262Error;

  var eachFile = function (filename) {
    var shortName = path.relative(BASEDIR, filename);
    describe(shortName, function () {
      var file = parser.parseFile({
        file: filename,
        contents: fs.readFileSync(filename, 'utf8')
      });
      assert(file.copyright || file.isATest, file);
      var desc = file.attrs.description || '<no description>';
      var includes = file.attrs.includes || [];
      var features = file.attrs.features || [];
      var flags = file.attrs.flags || {};
      var prologue = flags.noStrict ? '' : "'use strict';\n";
      var itit = it;
      if (BLACKLIST.indexOf(shortName) >= 0) { itit = it.skip; }
      if (features.indexOf('class') >= 0) { itit = it.skip; }
      var usesSymbol = features.filter(function (f) {
        return (/^Symbol/).test(f);
      }).length > 0;
      // Node 0.10 compatibility
      if (typeof Symbol === 'undefined' && usesSymbol) { itit = it.skip; }
      // Node doesn't yet have these symbols
      if (features.indexOf('Symbol.species') >= 0) { itit = it.skip; }
      if (features.indexOf('Symbol.toStringTag') >= 0) { itit = it.skip; }
      includes.forEach(function (f) {
        prologue +=
          fs.readFileSync(path.join(BASEDIR, '../harness', f), 'utf8');
      });

      var runOne = function (done) {
        var body = new Function(
          'assert', '$ERROR', 'Test262Error', 'Promise', '$DONE',
          prologue + file.contents
        );
        var P = Promise;
        var res = Promise.resolve;
        var rej = Promise.reject;
        var check = function () {
          // Verify that this test case didn't stomp on the Promise object.
          assert(P === Promise);
          assert(res === Promise.resolve);
          assert(rej === Promise.reject);
        };
        var checkAsync = function (cb) {
          try { check(); } catch (e) { return cb(e); }
          cb();
        };
        if (done) {
          // Execute async test:
          body(test262assert, $ERROR, Test262Error, Promise, function (err) {
            if (err) { done(err); } else { checkAsync(done); }
          });
        } else {
          // Execute sync test:
          body(test262assert, $ERROR, Test262Error, Promise);
          check();
        }
      };
      // Mocha uses the # of declared args of the function to determine
      // whether or not to execute the test async.
      if (file.async) {
        itit(desc, function (done) { runOne(done); });
      } else {
        itit(desc, function () { runOne(); });
      }
    });
  };
  glob.sync(path.join(BASEDIR, TESTS)).forEach(eachFile);
});
