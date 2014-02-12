"use strict";
require('../../'); // import Promise from es6-shim

var assert = require("assert");

var delayPromise = function (value, ms) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
};

describe("Promise.race", function () {
  it("should fulfill if all promises are settled and the ordinally-first is fulfilled", function (done) {
    var iterable = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)];

    Promise.race(iterable).then(function (value) {
      assert.strictEqual(value, 1);
      done();
    });
  });

  it("should reject if all promises are settled and the ordinally-first is rejected", function (done) {
    var iterable = [Promise.reject(1), Promise.reject(2), Promise.resolve(3)];

    Promise.race(iterable).then(
      function () {
        assert(false, "should never get here");
        done();
      },
      function (reason) {
        assert.strictEqual(reason, 1);
        done();
      }
    );
  });

  it("should settle in the same way as the first promise to settle", function () {
    var iterable = [delayPromise(1, 1000), delayPromise(2, 200), delayPromise(3, 500)];

    Promise.race(iterable).then(function (value) {
      assert.strictEqual(value, 2);
      done();
    });
  });

  // see https://github.com/domenic/promises-unwrapping/issues/75
  it("should never settle when given an empty iterable", function (done) {
    var iterable = [];
    var settled = false;

    Promise.race(iterable).then(
      function () { settled = true; },
      function () { settled = true; }
    );

    setTimeout(function () {
      assert.strictEqual(settled, false);
      done();
    }, 300);
  });

  it("should reject with a TypeError if given a non-iterable", function (done) {
    var notIterable = {};

    Promise.race(notIterable).then(
      function () {
        assert(false, "should never get here");
        done();
      },
      function (reason) {
        assert(reason instanceof TypeError);
        done();
      }
    );
  });
});
