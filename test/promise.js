/* This file is for testing implementation regressions of Promises. */

describe('Promise', function () {
  it('ignores non-function .then arguments', function () {
    expect(function () {
      Promise.reject(42).then(null,5).then(null, function () {});
    }).not.to.throw();
  });
});

