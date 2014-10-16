/*global describe, specify, assert */


var failIfThrows = function (done) {
  'use strict';
  return function (e) { done(e || new Error()); };
};

describe('Promise', function () {
  'use strict';

  specify('sanity check: a fulfilled promise calls its fulfillment handler', function (done) {
    Promise.resolve(5).then(function (value) {
      assert.strictEqual(value, 5);
    }).then(done, failIfThrows(done));
  });

  specify('directly resolving the promise with itself', function (done) {
    var resolvePromise;
    var promise = new Promise(function (resolve) { resolvePromise = resolve; });

    resolvePromise(promise);

    promise.then(
      function () {
        assert(false, 'Should not be fulfilled');
      },
      function (err) {
        assert(err instanceof TypeError);
      }
    ).then(done, failIfThrows(done));
  });

    specify('Stealing a resolver and using it to trigger possible reentrancy bug (#83)', function () {
        var stolenResolver;
        function StealingPromiseConstructor(resolver) {
            stolenResolver = resolver;
            resolver(function () { }, function () { });
        }

        var iterable = {};
        var atAtIterator = '@@iterator'; // on firefox, at least.
        iterable[atAtIterator] = function () {
            stolenResolver(null, null);
            throw 0;
        };

        assert.doesNotThrow(function () {
            Promise.all.call(StealingPromiseConstructor, iterable);
        });
    });
});

