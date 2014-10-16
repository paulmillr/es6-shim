/*global describe, specify, assert */

describe('Evil promises should not be able to break invariants', function () {
  'use strict';
  specify('resolving to a promise that calls onFulfilled twice', function (done) {
    // note that we have to create a trivial subclass, as otherwise the
    // Promise.resolve(evilPromise) is just the identity function.
    var EvilPromise = function (executor) { Promise.call(this, executor); };
    if (!Object.setPrototypeOf) { return done(); } // skip test if on IE < 11
    Object.setPrototypeOf(EvilPromise, Promise);
    EvilPromise.prototype = Object.create(Promise.prototype, {
      constructor: { value: EvilPromise }
    });

    var evilPromise = EvilPromise.resolve();
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

