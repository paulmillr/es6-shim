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
    });
  });

  describe('#asinh()', function() {
    it('should be correct', function() {
      expect(Math.asinh(1234)).to.almostEqual(7.811163549201245);
      expect(Math.asinh(9.99)).to.almostEqual(2.997227420191335);
    });
  });

  describe('#atanh()', function() {
    it('should be correct', function() {
      expect(Math.atanh(0.5)).to.almostEqual(0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(-0.5)).to.almostEqual(-0.5493061443340549);
      expect(Math.atanh(0.444)).to.almostEqual(0.47720201260109457);
    });
  });

  describe('#cosh()', function() {
    it('should be correct', function() {
      expect(Math.cosh(12)).to.almostEqual(81377.39571257407);
      expect(Math.cosh(0)).to.almostEqual(1);
      expect(Math.cosh(-10)).to.almostEqual(11013.232920103323);
    });
  });

  describe('#expm1()', function() {
    it('should be correct', function() {
      expect(Math.expm1(10)).to.almostEqual(22025.465794806718);
      expect(Math.expm1(-10)).to.almostEqual(-0.9999546000702375);
    });
  });

  describe('#hypot()', function() {
    it('should be correct', function() {
      expect(Math.hypot(66, 66)).to.almostEqual(93.33809511662427);
      expect(Math.hypot(0.1, 100)).to.almostEqual(100.0000499999875);
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
    });
  });

  describe('#log1p', function() {
    it('should be correct', function() {
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

      expect(Math.sign(0)).to.equal(0);
      expect(Math.sign(-0)).to.equal(-0);
      expect(Number.isNaN(Math.sign(NaN))).to.be.ok();
    });
  });

  describe('#sinh()', function() {
    it('should be correct', function() {
      expect(Math.sinh(-5)).to.almostEqual(-74.20321057778875);
      expect(Math.sinh(2)).to.almostEqual(3.6268604078470186);
    });
  });

  describe('#tanh()', function() {
    it('should be correct', function() {
      expect(Math.tanh(90)).to.almostEqual(1);
      expect(Math.tanh(10)).to.almostEqual(0.9999999958776927);
    });
  });

  describe('#trunc()', function() {
    it('should be correct', function() {
      expect(Math.trunc(1.01)).to.equal(1);
      expect(Math.trunc(1.99)).to.equal(1);
      expect(Math.trunc(-555.555)).to.equal(-555);
      expect(Math.trunc(-1.99)).to.equal(-1);
    });
  });
});
