/*global describe, require */

// tests from promises-aplus-tests
"use strict";

describe("Promises/A+ Tests", function () {
  require("promises-aplus-tests").mocha({
    // an adapter from es6 spec to Promises/A+
    deferred: function () {
      var result = {};
      result.promise = new Promise(function (resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      });
      return result;
    },
    resolved: Promise.resolve.bind(Promise),
    rejected: Promise.reject.bind(Promise)
  });
});

