/*global describe, it, expect, require */

var exported = require('../');

var Assertion = expect().constructor;
Assertion.prototype.almostEqual = function (obj, precision) {
  var allowedDiff = precision || 1e-11;
  return this.within(obj - allowedDiff, obj + allowedDiff);
};

var isPositiveZero = function (zero) {
  return zero === 0 && 1 / zero === Infinity;
};

var isNegativeZero = function (zero) {
  return zero === 0 && 1 / zero === -Infinity;
};
var valueOfIsNaN = { valueOf: function () { return NaN; } };
var valueOfIsInfinity = { valueOf: function () { return Infinity; } };

describe('Math', function () {
  it('is on the exported object', function () {
    expect(exported.Math).to.equal(Math);
  });

  describe('#acosh()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.acosh(NaN))).to.equal(true);
      expect(Number.isNaN(Math.acosh(0))).to.equal(true);
      expect(Number.isNaN(Math.acosh(0.9999999))).to.equal(true);
      expect(Number.isNaN(Math.acosh(-1e300))).to.equal(true);
      expect(Math.acosh(1e+99)).to.almostEqual(228.64907138697046);
      expect(isPositiveZero(Math.acosh(1))).to.equal(true);
      expect(Math.acosh(Infinity)).to.equal(Infinity);
      expect(Math.acosh(1234)).to.almostEqual(7.811163220849231);
      expect(Math.acosh(8.88)).to.almostEqual(2.8737631531629235);
    });
  });

  describe('#asinh()', function () {
    it('should be correct for NaN', function () {
      expect(Number.isNaN(Math.asinh(NaN))).to.equal(true);
    });

    it('should be correct for zeroes', function () {
      expect(isPositiveZero(Math.asinh(+0))).to.equal(true);
      expect(isNegativeZero(Math.asinh(-0))).to.equal(true);
    });

    it('should be correct for Infinities', function () {
      expect(Math.asinh(Infinity)).to.equal(Infinity);
      expect(Math.asinh(-Infinity)).to.equal(-Infinity);
    });

    it('should be correct', function () {
      expect(Math.asinh(1234)).to.almostEqual(7.811163549201245);
      expect(Math.asinh(9.99)).to.almostEqual(2.997227420191335);
      expect(Math.asinh(1e150)).to.almostEqual(346.0809111296668);
      expect(Math.asinh(1e7)).to.almostEqual(16.811242831518268);
      expect(Math.asinh(-1e7)).to.almostEqual(-16.811242831518268);
    });
  });

  describe('#atanh()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.atanh(NaN))).to.equal(true);
      expect(Number.isNaN(Math.atanh(-1.00000001))).to.equal(true);
      expect(Number.isNaN(Math.atanh(1.00000001))).to.equal(true);
      expect(Number.isNaN(Math.atanh(-1e300))).to.equal(true);
      expect(Number.isNaN(Math.atanh(1e300))).to.equal(true);
      expect(Math.atanh(-1)).to.equal(-Infinity);
      expect(Math.atanh(1)).to.equal(Infinity);
      expect(isPositiveZero(Math.atanh(+0))).to.equal(true);
      expect(isNegativeZero(Math.atanh(-0))).to.equal(true);
      expect(Math.atanh(0.5)).to.almostEqual(0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(0.444)).to.almostEqual(0.47720201260109457);
    });
  });

  describe('#cbrt()', function () {
    it('should be correct', function () {
      expect(isNaN(Math.cbrt(NaN))).to.equal(true);
      expect(isPositiveZero(Math.cbrt(+0))).to.equal(true);
      expect(isNegativeZero(Math.cbrt(-0))).to.equal(true);
      expect(Math.cbrt(Infinity)).to.equal(Infinity);
      expect(Math.cbrt(-Infinity)).to.equal(-Infinity);
      expect(Math.cbrt(-8)).to.almostEqual(-2);
      expect(Math.cbrt(8)).to.almostEqual(2);
      expect(Math.cbrt(-1000)).to.almostEqual(-10);
      expect(Math.cbrt(1000)).to.almostEqual(10);
    });
  });

  describe('.clz32()', function () {
    it('should have proper uint32 conversion', function () {
      var integers = [5295, -5295, -9007199254740991, 9007199254740991, 0, -0];
      var nonNumbers = [undefined, true, null, {}, [], 'str'];
      var nonIntegers = [-9007199254741992, 9007199254741992, 5.9];

      integers.forEach(function (item) {
        expect(Math.clz32(item)).to.be.within(0, 32);
      });
      nonIntegers.forEach(function (item) {
        expect(Math.clz32(item)).to.be.within(0, 32);
      });
      nonNumbers.forEach(function (item) {
        expect(Math.clz32(item)).to.equal(item === true ? 31 : 32);
      });
      expect(Math.clz32(true)).to.equal(Math.clz32(1));
      expect(Math.clz32('')).to.equal(Math.clz32(0));
      expect(Math.clz32('10')).to.equal(Math.clz32(10));
      expect(Math.clz32(0.1)).to.equal(32);
      expect(Math.clz32(-1)).to.equal(0);
      expect(Math.clz32(1)).to.equal(31);
      expect(Math.clz32(0xFFFFFFFF)).to.equal(0);
      expect(Math.clz32(0x1FFFFFFFF)).to.equal(0);
      expect(Math.clz32(0x111111111)).to.equal(3);
      expect(Math.clz32(0x11111111)).to.equal(3);
    });

    it('returns 32 for numbers that coerce to 0', function () {
      var zeroishes = [
        0,
        -0,
        NaN,
        Infinity,
        -Infinity,
        0x100000000,
        undefined,
        null,
        false,
        '',
        'str',
        {},
        [],
        [1, 2]
      ];
      zeroishes.forEach(function (zeroish) {
        expect(Math.clz32(zeroish)).to.equal(32);
      });
    });
  });

  describe('#cosh()', function () {
    it('should be correct for NaN', function () {
      expect(Number.isNaN(Math.cosh(NaN))).to.equal(true);
    });

    it('should be correct for Infinities', function () {
      expect(Math.cosh(Infinity)).to.equal(Infinity);
      expect(Math.cosh(-Infinity)).to.equal(Infinity);
    });

    it('should be correct for zeroes', function () {
      expect(Math.cosh(-0)).to.equal(1);
      expect(Math.cosh(+0)).to.equal(1);
    });

    it('should be correct', function () {
      // Overridden precision values here are for Chrome, as of v25.0.1364.172
      // Broadened slightly for Firefox 31
      expect(Math.cosh(12)).to.almostEqual(81377.39571257407, 9e-11);
      expect(Math.cosh(22)).to.almostEqual(1792456423.065795780980053377, 1e-5);
      expect(Math.cosh(-10)).to.almostEqual(11013.23292010332313972137);
      expect(Math.cosh(-23)).to.almostEqual(4872401723.1244513000, 1e-5);
    });
  });

  describe('#expm1()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.expm1(NaN))).to.equal(true);
      expect(isPositiveZero(Math.expm1(+0))).to.equal(true);
      expect(isNegativeZero(Math.expm1(-0))).to.equal(true);
      expect(Math.expm1(Infinity)).to.equal(Infinity);
      expect(Math.expm1(-Infinity)).to.equal(-1);
      expect(Math.expm1(10)).to.almostEqual(22025.465794806718);
      expect(Math.expm1(-10)).to.almostEqual(-0.9999546000702375);
    });

    it('works with very negative numbers', function () {
      expect(Math.expm1(-38)).to.almostEqual(-1);
      expect(Math.expm1(-8675309)).to.almostEqual(-1);
      expect(Math.expm1(-4815162342)).to.almostEqual(-1);
    });
  });

  describe('#hypot()', function () {
    it('should be correct', function () {
      expect(Math.hypot(Infinity)).to.equal(Infinity);
      expect(Math.hypot(-Infinity)).to.equal(Infinity);
      expect(Math.hypot(Infinity, NaN)).to.equal(Infinity);
      expect(Math.hypot(NaN, Infinity)).to.equal(Infinity);
      expect(Math.hypot(-Infinity, 'Hello')).to.equal(Infinity);
      expect(Math.hypot(1, 2, Infinity)).to.equal(Infinity);
      expect(Number.isNaN(Math.hypot(NaN, 1))).to.equal(true);
      expect(isPositiveZero(Math.hypot())).to.equal(true);
      expect(isPositiveZero(Math.hypot(0, 0, 0))).to.equal(true);
      expect(isPositiveZero(Math.hypot(0, -0, 0))).to.equal(true);
      expect(isPositiveZero(Math.hypot(-0, -0, -0))).to.equal(true);
      expect(Math.hypot(66, 66)).to.almostEqual(93.33809511662427);
      expect(Math.hypot(0.1, 100)).to.almostEqual(100.0000499999875);
    });

    it('should coerce to a number', function () {
      expect(Math.hypot('Infinity', 0)).to.equal(Infinity);
      expect(Math.hypot('3', '3', '3', '3')).to.equal(6);
    });

    it('should take more than 3 arguments', function () {
      expect(Math.hypot(66, 66, 66)).to.almostEqual(114.3153532995459);
      expect(Math.hypot(66, 66, 66, 66)).to.equal(132);
    });

    it('should have the right length', function () {
      expect(Math.hypot.length).to.equal(2);
    });

    it('works for very large or small numbers', function () {
      expect(Math.hypot(1e+300, 1e+300)).to.almostEqual(1.4142135623730952e+300);
      expect(Math.hypot(1e-300, 1e-300)).to.almostEqual(1.4142135623730952e-300);
      expect(Math.hypot(1e+300, 1e+300, 2, 3)).to.almostEqual(1.4142135623730952e+300);
    });
  });

  describe('#log2()', function () {
    it('should be correct for edge cases', function () {
      expect(Number.isNaN(Math.log2(NaN))).to.equal(true);
      expect(Number.isNaN(Math.log2(-1e-50))).to.equal(true);
      expect(Math.log2(+0)).to.equal(-Infinity);
      expect(Math.log2(-0)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log2(1))).to.equal(true);
      expect(Math.log2(Infinity)).to.equal(Infinity);
    });

    it('should have the right precision', function () {
      expect(Math.log2(5)).to.almostEqual(2.321928094887362);
      expect(Math.log2(32)).to.almostEqual(5);
    });
  });

  describe('#log10', function () {
    it('should be correct for edge cases', function () {
      expect(Number.isNaN(Math.log10(NaN))).to.equal(true);
      expect(Number.isNaN(Math.log10(-1e-50))).to.equal(true);
      expect(Math.log10(+0)).to.equal(-Infinity);
      expect(Math.log10(-0)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log10(1))).to.equal(true);
      expect(Math.log10(Infinity)).to.equal(Infinity);
    });

    it('should have the right precision', function () {
      expect(Math.log10(5)).to.almostEqual(0.698970004336018);
      expect(Math.log10(50)).to.almostEqual(1.6989700043360187);
    });
  });

  describe('#log1p', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.log1p(NaN))).to.equal(true);
      expect(Number.isNaN(Math.log1p(-1.000000001))).to.equal(true);
      expect(Math.log1p(-1)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log1p(+0))).to.equal(true);
      expect(isNegativeZero(Math.log1p(-0))).to.equal(true);
      expect(Math.log1p(Infinity)).to.equal(Infinity);

      expect(Math.log1p(5)).to.almostEqual(1.791759469228055);
      expect(Math.log1p(50)).to.almostEqual(3.9318256327243257);
    });
  });

  describe('#sign()', function () {
    it('should be correct', function () {
      // we also verify that [[ToNumber]] is being called
      [Infinity, 1].forEach(function (value) {
        expect(Math.sign(value)).to.equal(1);
        expect(Math.sign(String(value))).to.equal(1);
      });
      expect(Math.sign(true)).to.equal(1);

      [-Infinity, -1].forEach(function (value) {
        expect(Math.sign(value)).to.equal(-1);
        expect(Math.sign(String(value))).to.equal(-1);
      });

      expect(isPositiveZero(Math.sign(+0))).to.equal(true);
      expect(isPositiveZero(Math.sign('0'))).to.equal(true);
      expect(isPositiveZero(Math.sign('+0'))).to.equal(true);
      expect(isPositiveZero(Math.sign(''))).to.equal(true);
      expect(isPositiveZero(Math.sign(' '))).to.equal(true);
      expect(isPositiveZero(Math.sign(null))).to.equal(true);
      expect(isPositiveZero(Math.sign(false))).to.equal(true);
      expect(isNegativeZero(Math.sign(-0))).to.equal(true);
      expect(isNegativeZero(Math.sign('-0'))).to.equal(true);
      expect(Number.isNaN(Math.sign(NaN))).to.equal(true);
      expect(Number.isNaN(Math.sign('NaN'))).to.equal(true);
      expect(Number.isNaN(Math.sign(undefined))).to.equal(true);
    });
  });

  describe('#sinh()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.sinh(NaN))).to.equal(true);
      expect(isPositiveZero(Math.sinh(+0))).to.equal(true);
      expect(isNegativeZero(Math.sinh(-0))).to.equal(true);
      expect(Math.sinh(Infinity)).to.equal(Infinity);
      expect(Math.sinh(-Infinity)).to.equal(-Infinity);
      expect(Math.sinh(-5)).to.almostEqual(-74.20321057778875);
      expect(Math.sinh(2)).to.almostEqual(3.6268604078470186);
    });
  });

  describe('#tanh()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.tanh(NaN))).to.equal(true);
      expect(isPositiveZero(Math.tanh(+0))).to.equal(true);
      expect(isNegativeZero(Math.tanh(-0))).to.equal(true);
      expect(Math.tanh(Infinity)).to.equal(1);
      expect(Math.tanh(-Infinity)).to.equal(-1);
      expect(Math.tanh(90)).to.almostEqual(1);
      expect(Math.tanh(10)).to.almostEqual(0.9999999958776927);
    });
  });

  describe('#trunc()', function () {
    it('should be correct', function () {
      expect(Number.isNaN(Math.trunc(NaN))).to.equal(true);
      expect(isNegativeZero(Math.trunc(-0))).to.equal(true);
      expect(isPositiveZero(Math.trunc(+0))).to.equal(true);
      expect(Math.trunc(Infinity)).to.equal(Infinity);
      expect(Math.trunc(-Infinity)).to.equal(-Infinity);
      expect(Math.trunc(1.01)).to.equal(1);
      expect(Math.trunc(1.99)).to.equal(1);
      expect(Math.trunc(-555.555)).to.equal(-555);
      expect(Math.trunc(-1.99)).to.equal(-1);
    });

    it('should coerce to a number immediately', function () {
      expect(Math.trunc(valueOfIsInfinity)).to.equal(Infinity);
      expect(Number.isNaN(Math.trunc(valueOfIsNaN))).to.equal(true);
    });
  });

  describe('#imul()', function () {
    var str = 'str';
    var obj = {};
    var arr = [];

    it('should be correct for non-numbers', function () {
      expect(Math.imul(false, 7)).to.equal(0);
      expect(Math.imul(7, false)).to.equal(0);
      expect(Math.imul(false, false)).to.equal(0);
      expect(Math.imul(true, 7)).to.equal(7);
      expect(Math.imul(7, true)).to.equal(7);
      expect(Math.imul(true, true)).to.equal(1);
      expect(Math.imul(undefined, 7)).to.equal(0);
      expect(Math.imul(7, undefined)).to.equal(0);
      expect(Math.imul(undefined, undefined)).to.equal(0);
      expect(Math.imul(str, 7)).to.equal(0);
      expect(Math.imul(7, str)).to.equal(0);
      expect(Math.imul(obj, 7)).to.equal(0);
      expect(Math.imul(7, obj)).to.equal(0);
      expect(Math.imul(arr, 7)).to.equal(0);
      expect(Math.imul(7, arr)).to.equal(0);
    });

    it('should be correct for hex values', function () {
      expect(Math.imul(0xffffffff, 5)).to.equal(-5);
      expect(Math.imul(0xfffffffe, 5)).to.equal(-10);
    });

    it('should be correct', function () {
      expect(Math.imul(2, 4)).to.equal(8);
      expect(Math.imul(-1, 8)).to.equal(-8);
      expect(Math.imul(-2, -2)).to.equal(4);
      expect(Math.imul(-0, 7)).to.equal(0);
      expect(Math.imul(7, -0)).to.equal(0);
      expect(Math.imul(0.1, 7)).to.equal(0);
      expect(Math.imul(7, 0.1)).to.equal(0);
      expect(Math.imul(0.9, 7)).to.equal(0);
      expect(Math.imul(7, 0.9)).to.equal(0);
      expect(Math.imul(1.1, 7)).to.equal(7);
      expect(Math.imul(7, 1.1)).to.equal(7);
      expect(Math.imul(1.9, 7)).to.equal(7);
      expect(Math.imul(7, 1.9)).to.equal(7);
    });

    it('should be correct for objects with valueOf', function () {
     var x = {
       x: 0,
       valueOf: function () { return ++this.x; }
     };
     expect(Math.imul(x, 1)).to.equal(1);
     expect(Math.imul(1, x)).to.equal(2);
     expect(Math.imul(x, 1)).to.equal(3);
     expect(Math.imul(1, x)).to.equal(4);
     expect(Math.imul(x, 1)).to.equal(5);
    });
  });

  describe('Math.fround', function () {
    // Mozilla's reference tests: https://bug900125.bugzilla.mozilla.org/attachment.cgi?id=793163
    it('returns NaN for undefined', function () {
      expect(Number.isNaN(Math.fround())).to.equal(true);
    });

    it('returns NaN for NaN', function () {
      expect(Number.isNaN(Math.fround(NaN))).to.equal(true);
    });

    it('works for zeroes and infinities', function () {
      expect(isPositiveZero(Math.fround(0))).to.equal(true);
      expect(isNegativeZero(Math.fround(-0))).to.equal(true);
      expect(Math.fround(Infinity)).to.equal(Infinity);
      expect(Math.fround(-Infinity)).to.equal(-Infinity);
    });

    it('returns infinity for large numbers', function () {
      expect(Math.fround(1.7976931348623157e+308)).to.equal(Infinity);
      expect(Math.fround(-1.7976931348623157e+308)).to.equal(-Infinity);
      expect(Math.fround(3.4028235677973366e+38)).to.equal(Infinity);
    });

    it('returns zero for really small numbers', function () {
      expect(Number.MIN_VALUE).to.equal(Math.pow(2, -1074)); // sanity check
      expect(Math.fround(Number.MIN_VALUE)).to.equal(0);
      expect(Math.fround(-Number.MIN_VALUE)).to.equal(0);
    });

    it('rounds properly', function () {
      expect(Math.fround(3)).to.equal(3);
      expect(Math.fround(-3)).to.equal(-3);
    });

    it('rounds properly with the max float 32', function () {
      var maxFloat32 = 3.4028234663852886e+38;
      expect(Math.fround(maxFloat32)).to.equal(maxFloat32);
      expect(Math.fround(-maxFloat32)).to.equal(-maxFloat32);
      expect(Math.fround(maxFloat32 + Math.pow(2, Math.pow(2, 8 - 1) - 1 - 23 - 2))).to.equal(maxFloat32); // round-nearest rounds down to maxFloat32
    });

    it('rounds properly with the min float 32', function () {
      var minFloat32 = 1.401298464324817e-45;
      expect(Math.fround(minFloat32)).to.equal(minFloat32);
      expect(Math.fround(-minFloat32)).to.equal(-minFloat32);
      expect(Math.fround(minFloat32 / 2)).to.equal(0);
      expect(Math.fround(-minFloat32 / 2)).to.equal(0);
      expect(Math.fround(minFloat32 / 2 + Math.pow(2, -202))).to.equal(minFloat32);
      expect(Math.fround(-minFloat32 / 2 - Math.pow(2, -202))).to.equal(-minFloat32);
    });
  });
});
