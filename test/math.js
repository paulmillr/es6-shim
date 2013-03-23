var Assertion = expect().constructor;
Assertion.prototype.almostEqual = function(obj, precision) {
  var allowedDiff = precision || 1e-11;
  return this.within(obj - allowedDiff, obj + allowedDiff);
};

var isPositiveZero = function (zero) {
  return zero === 0 && 1 / zero === Infinity;
};

var isNegativeZero = function (zero) {
  return zero === 0 && 1 / zero === -Infinity;
};

describe('Math', function() {
  describe('#acosh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.acosh(NaN))).to.be.ok;
      expect(Number.isNaN(Math.acosh(0))).to.be.ok;
      expect(Number.isNaN(Math.acosh(0.9999999))).to.be.ok;
      expect(isPositiveZero(Math.acosh(1))).to.be.ok;
      expect(Math.acosh(Infinity)).to.equal(Infinity);
      expect(Math.acosh(1234)).to.almostEqual(7.811163220849231);
      expect(Math.acosh(8.88)).to.almostEqual(2.8737631531629235);
    });
  });

  describe('#asinh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.asinh(NaN))).to.be.ok;
      expect(isPositiveZero(Math.asinh(+0))).to.be.ok;
      expect(isNegativeZero(Math.asinh(-0))).to.be.ok;
      expect(Math.asinh(Infinity)).to.equal(Infinity);
      expect(Math.asinh(-Infinity)).to.equal(-Infinity);
      expect(Math.asinh(1234)).to.almostEqual(7.811163549201245);
      expect(Math.asinh(9.99)).to.almostEqual(2.997227420191335);
    });
  });

  describe('#atanh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.atanh(NaN))).to.be.ok;
      expect(Number.isNaN(Math.atanh(-1.00000001))).to.be.ok;
      expect(Number.isNaN(Math.atanh(1.00000001))).to.be.ok;
      expect(Math.atanh(-1)).to.equal(-Infinity);
      expect(Math.atanh(1)).to.equal(Infinity);
      expect(isPositiveZero(Math.atanh(+0))).to.be.ok;
      expect(isNegativeZero(Math.atanh(-0))).to.be.ok;
      expect(Math.atanh(0.5)).to.almostEqual(0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(0.444)).to.almostEqual(0.47720201260109457);
    });
  });
  
  describe('#cbrt()', function() {
    it('should be correct', function () {
      expect(isNaN(Math.cbrt(NaN))).to.be.ok;
      expect(isPositiveZero(Math.cbrt(+0))).to.be.ok;
      expect(isNegativeZero(Math.cbrt(-0))).to.be.ok;
      expect(Math.cbrt(Infinity)).to.equal(Infinity);
      expect(Math.cbrt(-Infinity)).to.equal(-Infinity);
      expect(Math.cbrt(-8)).to.almostEqual(-2);
      expect(Math.cbrt(8)).to.almostEqual(2);
      expect(Math.cbrt(-1000)).to.almostEqual(-10);
      expect(Math.cbrt(1000)).to.almostEqual(10);
    });
  });

  describe('#cosh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.cosh(NaN))).to.be.ok;
      expect(Math.cosh(-0)).to.equal(1);
      expect(Math.cosh(+0)).to.equal(1);
      expect(Math.cosh(Infinity)).to.equal(Infinity);
      expect(Math.cosh(-Infinity)).to.equal(-Infinity);
      // Overridden precision values here are for Chrome, as of v25.0.1364.172
      expect(Math.cosh(12)).to.almostEqual(81377.39571257407, 3e-11);
      expect(Math.cosh(22)).to.almostEqual(1792456423.065795780980053377, 1e-5);
      expect(Math.cosh(-10)).to.almostEqual(11013.23292010332313972137);
      expect(Math.cosh(-23)).to.almostEqual(4872401723.1244513000, 1e-5);
    });
  });

  describe('#expm1()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.expm1(NaN))).to.be.ok;
      expect(isPositiveZero(Math.expm1(+0))).to.be.ok;
      expect(isNegativeZero(Math.expm1(-0))).to.be.ok;
      expect(Math.expm1(Infinity)).to.equal(Infinity);
      expect(Math.expm1(-Infinity)).to.equal(-1);
      expect(Math.expm1(10)).to.almostEqual(22025.465794806718);
      expect(Math.expm1(-10)).to.almostEqual(-0.9999546000702375);
    });
  });

  describe('#hypot()', function() {
    it('should be correct', function() {
      expect(Math.hypot(Infinity)).to.equal(Infinity);
      expect(Math.hypot(-Infinity)).to.equal(Infinity);
      expect(Math.hypot(Infinity, NaN)).to.equal(Infinity);
      expect(Math.hypot(-Infinity, 'Hello')).to.equal(Infinity);
      expect(Math.hypot(1, 2, Infinity)).to.equal(Infinity);
      expect(Number.isNaN(Math.hypot(NaN, 1))).to.be.ok;
      expect(isPositiveZero(Math.hypot())).to.be.ok;
      expect(isPositiveZero(Math.hypot(0, 0, 0))).to.be.ok;
      expect(isPositiveZero(Math.hypot(0, -0, 0))).to.be.ok;
      expect(isPositiveZero(Math.hypot(-0, -0, -0))).to.be.ok;
      expect(Math.hypot(66, 66)).to.almostEqual(93.33809511662427);
      expect(Math.hypot(0.1, 100)).to.almostEqual(100.0000499999875);
      });
  });
  
  describe('#log2()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.log2(NaN))).to.be.ok;
      expect(Number.isNaN(Math.log2(-1e-50))).to.be.ok;
      expect(Math.log2(+0)).to.equal(-Infinity);
      expect(Math.log2(-0)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log2(1))).to.be.ok;
      expect(Math.log2(Infinity)).to.equal(Infinity);

      expect(Math.log2(5)).to.almostEqual(2.321928094887362);
      expect(Math.log2(32)).to.almostEqual(5);
    });
  });

  describe('#log10', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.log10(NaN))).to.be.ok;
      expect(Number.isNaN(Math.log10(-1e-50))).to.be.ok;
      expect(Math.log10(+0)).to.equal(-Infinity);
      expect(Math.log10(-0)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log10(1))).to.be.ok;
      expect(Math.log10(Infinity)).to.equal(Infinity);

      expect(Math.log10(5)).to.almostEqual(0.6989700043360189);
      expect(Math.log10(50)).to.almostEqual(1.6989700043360187);
    });
  });

  describe('#log1p', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.log1p(NaN))).to.be.ok;
      expect(Number.isNaN(Math.log1p(-1.000000001))).to.be.ok;
      expect(Math.log1p(-1)).to.equal(-Infinity);
      expect(isPositiveZero(Math.log1p(+0))).to.be.ok;
      expect(isNegativeZero(Math.log1p(-0))).to.be.ok;
      expect(Math.log1p(Infinity)).to.equal(Infinity);

      expect(Math.log1p(5)).to.almostEqual(1.791759469228055);
      expect(Math.log1p(50)).to.almostEqual(3.9318256327243257);
    });
  });

  describe('#sign()', function() {
    it('should be correct', function() {
      [Infinity, 1].forEach(function(value) {
        expect(Math.sign(value)).to.equal(1);
      });

      [-Infinity, -1].forEach(function(value) {
        expect(Math.sign(value)).to.equal(-1);
      });

      expect(isPositiveZero(Math.sign(+0))).to.be.ok;
      expect(isNegativeZero(Math.sign(-0))).to.be.ok;
      expect(Number.isNaN(Math.sign(NaN))).to.be.ok;
    });
  });

  describe('#sinh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.sinh(NaN))).to.be.ok;
      expect(isPositiveZero(Math.sinh(+0))).to.be.ok;
      expect(isNegativeZero(Math.sinh(-0))).to.be.ok;
      expect(Math.sinh(Infinity)).to.equal(Infinity);
      expect(Math.sinh(-Infinity)).to.equal(-Infinity);
      expect(Math.sinh(-5)).to.almostEqual(-74.20321057778875);
      expect(Math.sinh(2)).to.almostEqual(3.6268604078470186);
    });
  });

  describe('#tanh()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.tanh(NaN))).to.be.ok;
      expect(isPositiveZero(Math.tanh(+0))).to.be.ok;
      expect(isNegativeZero(Math.tanh(-0))).to.be.ok;
      expect(Math.tanh(Infinity)).to.equal(1);
      expect(Math.tanh(-Infinity)).to.equal(-1);
      expect(Math.tanh(90)).to.almostEqual(1);
      expect(Math.tanh(10)).to.almostEqual(0.9999999958776927);
    });
  });

  describe('#trunc()', function() {
    it('should be correct', function() {
      expect(Number.isNaN(Math.trunc(NaN))).to.be.ok;
      expect(isNegativeZero(Math.trunc(-0))).to.be.ok;
      expect(isPositiveZero(Math.trunc(+0))).to.be.ok;
      expect(Math.trunc(Infinity)).to.equal(Infinity);
      expect(Math.trunc(-Infinity)).to.equal(-Infinity);
      expect(Math.trunc(1.01)).to.equal(1);
      expect(Math.trunc(1.99)).to.equal(1);
      expect(Math.trunc(-555.555)).to.equal(-555);
      expect(Math.trunc(-1.99)).to.equal(-1);
    });
  });
});
