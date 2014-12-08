/*global describe, it, expect, require, Promise */

/* This file is for testing implementation regressions of Promises. */
var exported = require('../');
var hasOwn = Object.prototype.hasOwnProperty;

describe('Promise', function () {
  it('is on the exported object', function () {
    expect(exported.Promise).to.equal(Promise);
  });

  it('ignores non-function .then arguments', function () {
    expect(function () {
      Promise.reject(42).then(null, 5).then(null, function () {});
    }).not.to['throw']();
  });

  it('does not have extra methods (bad Chrome!)', function () {
    expect(hasOwn.call(Promise, 'accept')).to.equal(false);
    expect(hasOwn.call(Promise, 'defer')).to.equal(false);
    expect(hasOwn.call(Promise.prototype, 'accept')).to.equal(false);
  });
});

