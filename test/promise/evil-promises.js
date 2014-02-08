"use strict";
require('../../'); // import Promise from es6-shim

var assert = require("assert");

describe("Evil promises should not be able to break invariants", function () {
  specify("resolving to a promise that calls onFulfilled twice", function (done) {
    var evilPromise = Promise.resolve();
    evilPromise.then = function (f) {
      f(1);
      f(2);
    };

    var calledAlready = false;
    Promise.resolve(evilPromise).then(function (value) {
      assert.strictEqual(calledAlready, false);
      calledAlready = true;
      assert.strictEqual(value, 1);
    }).then(done, done);
  });
});
