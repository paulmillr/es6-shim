"use strict";
require('../../'); // import Promise from es6-shim

var assert = require("assert");

describe("Promise.all", function () {
  it("fulfills if passed an empty array", function (done) {
    var iterable = [];

    Promise.all(iterable).then(function (value) {
      assert(Array.isArray(value));
      assert.deepEqual(value, []);
      done();
    });
  });

  it("fulfills if passed an array of mixed fulfilled promises and values", function (done) {
    var iterable = [0, Promise.resolve(1), 2, Promise.resolve(3)];

    Promise.all(iterable).then(function (value) {
      assert(Array.isArray(value));
      assert.deepEqual(value, [0, 1, 2, 3]);
      done();
    });
  });

  it("rejects if any passed promise is rejected", function (done) {
    var foreverPending = new Promise(function () { });
    var error = new Error("Rejected");
    var rejected = Promise.reject(error);

    var iterable = [foreverPending, rejected];

    Promise.all(iterable).then(
      function (value) {
        assert(false, "should never get here");
        done();
      },
      function (reason) {
        assert.strictEqual(reason, error);
        done();
      }
    );
  });

  it("resolves foreign thenables", function (done) {
    var normal = Promise.resolve(1);
    var foreign = { then: function (f) { f(2); } };

    var iterable = [normal, foreign];

    Promise.all(iterable).then(function (value) {
      assert.deepEqual(value, [1, 2]);
      done();
    });
  });

  it("fulfills when passed an sparse array, giving `undefined` for the omitted values", function (done) {
    var iterable = [Promise.resolve(0), , , Promise.resolve(1)];

    Promise.all(iterable).then(function (value) {
      assert.deepEqual(value, [0, undefined, undefined, 1]);
      done();
    });
  });

  it("does not modify the input array", function (done) {
    var input = [0, 1];
    var iterable = input;

    Promise.all(iterable).then(function (value) {
      assert.notStrictEqual(input, value);
      done();
    });
  });


  it("should reject with a TypeError if given a non-iterable", function (done) {
    var notIterable = {};

    Promise.all(notIterable).then(
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
