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

  it('throws when receiver is a primitive', function () {
    expect(function () { Promise.resolve.call(); }).to['throw']();
    expect(function () { Promise.resolve.call(null); }).to['throw']();
    expect(function () { Promise.resolve.call(''); }).to['throw']();
    expect(function () { Promise.resolve.call(42); }).to['throw']();
    expect(function () { Promise.resolve.call(false); }).to['throw']();
    expect(function () { Promise.resolve.call(true); }).to['throw']();
  });
});
