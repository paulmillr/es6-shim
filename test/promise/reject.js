/* global describe, it, expect, setTimeout, Promise */

var failIfThrows = function (done) {
  'use strict';

  return function (e) { done(e || new Error()); };
};

describe('Promise.reject', function () {
  'use strict';

  it('should not be enumerable', function () {
    expect(Promise).ownPropertyDescriptor('reject').to.have.property('enumerable', false);
  });

  it('should return a rejected promise', function (done) {
    var value = {};
    Promise.reject(value).then(failIfThrows(done), function (result) {
      expect(result).to.equal(value);
      done();
    });
  });
});
