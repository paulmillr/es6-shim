var Assertion = expect().constructor;
Assertion.prototype.almostEqual = function(obj) {
  var allowedDiff = 1e-11;
  return this.within(obj - allowedDiff, obj + allowedDiff);
}

describe('Math', function() {
  describe('#acosh()', function() {
    it('should be correct', function() {
      expect(Math.acosh(1234)).to.almostEqual(7.811163220849231);
      expect(Math.acosh(8.88)).to.almostEqual(2.8737631531629235);
      expect(Number.isNaN(Math.acosh(NaN))).to.be.ok;
      expect(Number.isNaN(Math.acosh(0.9999999999999999))).to.be.ok;
      expect(Math.acosh(1)).to.equal(+ 0);
      expect(Math.acosh(+Infinity)).to.equal(Infinity);
      expect(Math.abs(Math.cosh(Math.acosh(4)) - 4) < 0.00001).to.be.ok;
    });
  });

  describe('#asinh()', function() {
    it('should be correct', function() {
      expect(Math.asinh(1234)).to.almostEqual(7.811163549201245);
      expect(Math.asinh(9.99)).to.almostEqual(2.997227420191335);
      expect(Number.isNaN(Math.asinh(NaN))).to.be.ok;
      expect(1 / Math.asinh(+0)).to.equal(Infinity);
      expect(1 / Math.asinh(-0)).to.equal(-Infinity);
      expect(Math.asinh(+Infinity)).to.equal(Infinity);
      expect(Math.asinh(-Infinity)).to.equal(-Infinity);
      expect(Math.sinh(Math.asinh(3))).to.equal(3);
    });
  });

  describe('#atanh()', function() {
    it('should be correct', function() {
      expect(Math.atanh(0.5)).to.almostEqual(0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(0.444)).to.almostEqual(0.47720201260109457);
      expect(Number.isNaN(Math.atanh(NaN))).to.be.ok;
      expect(Number.isNaN(Math.atanh(-1.00000000001))).to.be.ok;
      expect(Number.isNaN(Math.atanh(+1.00000000001))).to.be.ok;
      expect(Math.atanh(-1)).to.equal(-Infinity);
      expect(Math.atanh(+1)).to.equal(Infinity);
      expect(1 / Math.atanh(-0)).to.equal(-Infinity);
      expect(1 / Math.atanh(+0)).to.equal(Infinity);
      expect((Math.tanh(Math.atanh(0.5)) - 0.5) < Math.pow(2, - 52)).to.be.ok;
    });
  });

  describe('#cosh()', function() {
    it('should be correct', function() {
      expect(Math.cosh(12)).to.almostEqual(81377.39571257407);
      expect(Math.cosh(0)).to.almostEqual(1);
      expect(Math.cosh(-10)).to.almostEqual(11013.232920103323);
      expect(Number.isNaN(Math.cosh(NaN))).to.be.ok;
      expect(Math.cosh(-0)).to.equal(1);
      expect(Math.cosh(+0)).to.equal(1);
      expect(Math.cosh(+Infinity)).to.equal(Infinity);
      expect(Math.cosh(-Infinity)).to.equal(Infinity);
      expect(Math.cosh(2)).to.equal((Math.exp(2) + Math.exp(-2)) / 2);
    });
  });

  describe('#expm1()', function() {
    it('should be correct', function() {
      expect(Math.expm1(10)).to.almostEqual(22025.465794806718);
      expect(Math.expm1(-10)).to.almostEqual(-0.9999546000702375);
      expect(Number.isNaN(Math.expm1(NaN))).to.be.ok;
      expect(1 / Math.expm1(+0)).to.equal(Infinity);
      expect(1 / Math.expm1(-0)).to.equal(-Infinity);
      expect(Math.expm1(+Infinity)).to.equal(Infinity);
      expect(Math.expm1(-Infinity)).to.equal(-1);
      expect(Math.expm1(2)).to.equal(Math.exp(2) -1);
    });
  });

  describe('#hypot()', function() {
    it('should be correct', function() {
      expect(Math.hypot(66, 66)).to.almostEqual(93.33809511662427);
      expect(Math.hypot(0.1, 100)).to.almostEqual(100.0000499999875);
      expect(Number.isNaN(Math.hypot(NaN, 0))).to.be.ok;
      expect(Number.isNaN(Math.hypot(0, NaN))).to.be.ok;
      expect(1 / Math.hypot(+0, - 0)).to.equal(Infinity);
      expect(Math.hypot(+0, 1e300)).to.equal(1e300);
      expect(1 / Math.hypot(-0, - 0)).to.equal(Infinity);
      expect(Math.hypot(-0, 1e300)).to.equal(1e300);
      expect(Math.hypot(+Infinity, 0)).to.equal(Infinity);
      expect(Math.hypot(-Infinity, 0)).to.equal(Infinity);
      expect(Math.hypot(0, -Infinity)).to.equal(Infinity);
      expect(Math.hypot(0, -Infinity)).to.equal(Infinity);
      expect(Math.hypot(3, 4)).to.equal(5);
    });
  });

  describe('#log2()', function() {
    it('should be correct', function() {
      expect(Math.log2(5)).to.almostEqual(2.321928094887362);
      expect(Math.log2(32)).to.almostEqual(5);
    });
  });

  describe('#log10', function() {
    it('should be correct', function() {
      expect(Math.log10(5)).to.almostEqual(0.6989700043360189);
      expect(Math.log10(50)).to.almostEqual(1.6989700043360187);
      expect(Number.isNaN(Math.log10(NaN))).to.be.ok;
      expect(Number.isNaN(Math.log10(-0.1))).to.be.ok;
      expect(Math.log10(+0)).to.equal(-Infinity);
      expect(Math.log10(-0)).to.equal(-Infinity);
      expect(Math.log10(+Infinity)).to.equal(Infinity);
      expect(Math.log10(100)).to.equal(2);
      expect(Math.log10(1e22)).to.equal(22);
    });
  });

  describe('#log1p', function() {
    it('should be correct', function() {
      expect(Math.log1p(5)).to.almostEqual(1.791759469228055);
      expect(Math.log1p(50)).to.almostEqual(3.9318256327243257);
      expect(Number.isNaN(Math.log1p(NaN))).to.be.ok;
      expect(Number.isNaN(Math.log1p(-1.1))).to.be.ok;
      expect(Math.log1p(-1)).to.equal(-Infinity);
      expect(1 / Math.log1p(+0)).to.equal(Infinity);
      expect(1 / Math.log1p(-0)).to.equal(-Infinity);
      expect(Math.log1p(+Infinity)).to.equal(Infinity);
      expect(Math.log1p(1.718281828459045)).to.equal(1);
    });
  });

  describe('#sign()', function() {
    it('should be correct', function() {
      expect(Math.sign(Infinity)).to.equal(1);
      expect(Math.sign(-Infinity)).to.equal(-1);
      expect(Math.sign(1)).to.equal(1);
      expect(Math.sign(-1)).to.equal(-1);
      expect(Math.sign(0)).to.equal(0);
      expect(Math.sign(-0)).to.equal(-0);
      expect(Math.sign(Math.PI)).to.equal(1);
      expect(Number.isNaN(Math.sign(NaN))).to.be.ok;
    });
  });

  describe('#sinh()', function() {
    it('should be correct', function() {
      expect(Math.sinh(-5)).to.almostEqual(-74.20321057778875);
      expect(Math.sinh(2)).to.almostEqual(3.6268604078470186);
      expect(Number.isNaN(Math.sinh(NaN))).to.be.ok;
      expect(1 / Math.sinh(-0)).to.equal(-Infinity);
      expect(1 / Math.sinh(+0)).to.equal(Infinity);
      expect(Math.sinh(+Infinity)).to.equal(Infinity);
      expect(Math.sinh(-Infinity)).to.equal(-Infinity);
      expect(Math.sinh(2)).to.equal((Math.exp(2) - Math.exp(-2)) / 2);
    });
  });

  describe('#tanh()', function() {
    it('should be correct', function() {
      expect(Math.tanh(90)).to.almostEqual(1);
      expect(Math.tanh(10)).to.almostEqual(0.9999999958776927);
      expect(Number.isNaN(Math.tanh(NaN))).to.be.ok;
      expect(1 / Math.tanh(-0)).to.equal(-Infinity);
      expect(1 / Math.tanh(+0)).to.equal(Infinity);
      expect(Math.tanh(+Infinity)).to.equal(+1);
      expect(Math.tanh(-Infinity)).to.equal(-1);
      expect(Math.abs(Math.tanh(2) - (Math.exp(2) - Math.exp(-2)) / (Math.exp(2) + Math.exp(-2))) < Math.pow(2, - 52)).to.be.ok;
    });
  });

  describe('#trunc()', function() {
    it('should be correct', function() {
      expect(Math.trunc(1.01)).to.equal(1);
      expect(Math.trunc(1.99)).to.equal(1);
      expect(Math.trunc(-555.555)).to.equal(-555);
      expect(Math.trunc(-1.99)).to.equal(-1);
      expect(Math.trunc(Math.PI)).to.equal(3);
      expect(Number.isNaN(Math.trunc(NaN))).to.be.ok;
      expect(Object.is(Math.trunc(-0), -0)).to.be.ok;
      expect(Object.is(Math.trunc(0), 0)).to.be.ok;
    });
  });
});
