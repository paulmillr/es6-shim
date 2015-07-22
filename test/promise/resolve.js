/* global describe, it, expect, setTimeout, Promise */

var failIfThrows = function (done) {
  'use strict';

  return function (e) { done(e || new Error()); };
};

describe('Promise.resolve', function () {
  'use strict';

  it('should not be enumerable', function () {
    expect(Promise).ownPropertyDescriptor('resolve').to.have.property('enumerable', false);
  });

  it('should return a resolved promise', function (done) {
    var value = {};
    Promise.resolve(value).then(function (result) {
      expect(result).to.equal(value);
      done();
    }, failIfThrows(done));
  });
});
