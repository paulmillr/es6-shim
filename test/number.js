/*global describe, it, expect, require */

var exported = require('../');

describe('Number', function (undefined) {
  var integers = [5295, -5295, -9007199254740991, 9007199254740991, 0, -0];
  var nonIntegers = [-9007199254741992, 9007199254741992, 5.9];
  var infinities = [Infinity, -Infinity];
  var nonNumbers = [
    undefined,
    true,
    false,
    null,
    {},
    [],
    'str',
    '',
    { valueOf: function () { return 3; } },
    { valueOf: function () { return 0 / 0; } },
    { valueOf: function () { throw 17; } },
    { toString: function () { throw 17; } },
    {
      valueOf: function () { throw 17; },
      toString: function () { throw 42; }
    },
    /a/g
];
  var expectTrue = function (item) {
    expect(item).to.equal(true);
  };
  var expectFalse = function (item) {
    expect(item).to.equal(false);
  };

  it('is on the exported object', function () {
    expect(exported.Number).to.equal(Number);
  });

  describe('Number constants', function () {
    it('should have max safe integer', function () {
      expect(Number.MAX_SAFE_INTEGER).to.equal(Math.pow(2, 53) - 1);
    });

    it('should have min safe integer', function () {
      expect(Number.MIN_SAFE_INTEGER).to.equal(-Math.pow(2, 53) + 1);
    });

    it('should has epsilon', function () {
      expect(Number.EPSILON).to.equal(2.2204460492503130808472633361816e-16);
    });
  });

  describe('Number.parseInt()', function () {
    it('should work', function () {
      expect(Number.parseInt('601')).to.equal(601);
    });
  });

  describe('Number.parseFloat()', function () {
    it('should work', function () {
      expect(Number.parseFloat('5.5')).to.equal(5.5);
    });
  });

  describe('Number.isFinite()', function () {
    it('should work', function () {
      integers.map(Number.isFinite).forEach(expectTrue);
      infinities.map(Number.isFinite).forEach(expectFalse);
      expect(Number.isFinite(Infinity)).to.equal(false);
      expect(Number.isFinite(-Infinity)).to.equal(false);
      expect(Number.isFinite(NaN)).to.equal(false);
      expect(Number.isFinite(4)).to.equal(true);
      expect(Number.isFinite(4.5)).to.equal(true);
      expect(Number.isFinite('hi')).to.equal(false);
      expect(Number.isFinite('1.3')).to.equal(false);
      expect(Number.isFinite('51')).to.equal(false);
      expect(Number.isFinite(0)).to.equal(true);
      expect(Number.isFinite(-0)).to.equal(true);
      expect(Number.isFinite({
        valueOf: function () { return 3; }
      })).to.equal(false);
      expect(Number.isFinite({
        valueOf: function () { return 0 / 0; }
      })).to.equal(false);
      expect(Number.isFinite({
        valueOf: function () { throw 17; }
      })).to.equal(false);
      expect(Number.isFinite({
        toString: function () { throw 17; }
      })).to.equal(false);
      expect(Number.isFinite({
        valueOf: function () { throw 17; },
        toString: function () { throw 42; }
      })).to.equal(false);
    });

    it('should not be confused by type coercion', function () {
      nonNumbers.map(Number.isFinite).forEach(expectFalse);
    });
  });

  describe('Number.isInteger()', function () {
    it('should be truthy on integers', function () {
      integers.map(Number.isInteger).forEach(expectTrue);
      expect(Number.isInteger(4)).to.equal(true);
      expect(Number.isInteger(4.0)).to.equal(true);
      expect(Number.isInteger(1801439850948)).to.equal(true);
    });

    it('should be false when the type is not number', function () {
      nonNumbers.forEach(function (thing) {
        expect(Number.isInteger(thing)).to.equal(false);
      });
    });

    it('should be false when NaN', function () {
      expect(Number.isInteger(NaN)).to.equal(false);
    });

    it('should be false when ∞', function () {
      expect(Number.isInteger(Infinity)).to.equal(false);
      expect(Number.isInteger(-Infinity)).to.equal(false);
    });

    it('should be false when number is not integer', function () {
      expect(Number.isInteger(3.4)).to.equal(false);
      expect(Number.isInteger(-3.4)).to.equal(false);
    });

    it('should be true when abs(number) is 2^53 or larger', function () {
      expect(Number.isInteger(Math.pow(2, 53))).to.equal(true);
      expect(Number.isInteger(Math.pow(2, 54))).to.equal(true);
      expect(Number.isInteger(-Math.pow(2, 53))).to.equal(true);
      expect(Number.isInteger(-Math.pow(2, 54))).to.equal(true);
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];
      safeIntegers.forEach(function (int) {
        expect(Number.isInteger(int)).to.equal(true);
        expect(Number.isInteger(-int)).to.equal(true);
      });
    });
  });

  describe('Number.isSafeInteger()', function () {
    it('should be truthy on integers', function () {
      integers.map(Number.isSafeInteger).forEach(expectTrue);
      expect(Number.isSafeInteger(4)).to.equal(true);
      expect(Number.isSafeInteger(4.0)).to.equal(true);
      expect(Number.isSafeInteger(1801439850948)).to.equal(true);
    });

    it('should be false when the type is not number', function () {
      nonNumbers.forEach(function (thing) {
        expect(Number.isSafeInteger(thing)).to.equal(false);
      });
    });

    it('should be false when NaN', function () {
      expect(Number.isSafeInteger(NaN)).to.equal(false);
    });

    it('should be false when ∞', function () {
      expect(Number.isSafeInteger(Infinity)).to.equal(false);
      expect(Number.isSafeInteger(-Infinity)).to.equal(false);
    });

    it('should be false when number is not integer', function () {
      expect(Number.isSafeInteger(3.4)).to.equal(false);
      expect(Number.isSafeInteger(-3.4)).to.equal(false);
    });

    it('should be false when abs(number) is 2^53 or larger', function () {
      expect(Number.isSafeInteger(Math.pow(2, 53))).to.equal(false);
      expect(Number.isSafeInteger(Math.pow(2, 54))).to.equal(false);
      expect(Number.isSafeInteger(-Math.pow(2, 53))).to.equal(false);
      expect(Number.isSafeInteger(-Math.pow(2, 54))).to.equal(false);
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];
      safeIntegers.forEach(function (int) {
        expect(Number.isSafeInteger(int)).to.equal(true);
        expect(Number.isSafeInteger(-int)).to.equal(true);
      });
    });
  });

  describe('Number.isNaN()', function () {
    it('should be truthy only on NaN', function () {
      integers.concat(nonIntegers).map(Number.isNaN).forEach(expectFalse);
      nonNumbers.map(Number.isNaN).forEach(expectFalse);
      expect(Number.isNaN(NaN)).to.equal(true);
      expect(Number.isNaN(0 / 0)).to.equal(true);
      expect(Number.isNaN(Number('NaN'))).to.equal(true);
      expect(Number.isNaN(4)).to.equal(false);
      expect(Number.isNaN(4.5)).to.equal(false);
      expect(Number.isNaN('hi')).to.equal(false);
      expect(Number.isNaN('1.3')).to.equal(false);
      expect(Number.isNaN('51')).to.equal(false);
      expect(Number.isNaN(0)).to.equal(false);
      expect(Number.isNaN(-0)).to.equal(false);
      expect(Number.isNaN({valueOf: function () { return 3; }})).to.equal(false);
      expect(Number.isNaN({valueOf: function () { return 0 / 0; }})).to.equal(false);
      expect(Number.isNaN({valueOf: function () { throw 17; } })).to.equal(false);
      expect(Number.isNaN({toString: function () { throw 17; } })).to.equal(false);
      expect(Number.isNaN({
        valueOf: function () { throw 17; },
        toString: function () { throw 42; }
      })).to.equal(false);
    });
  });
});
