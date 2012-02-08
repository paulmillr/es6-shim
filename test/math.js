describe('Math', function() {
  describe('#acosh()', function() {
    it('should be correct', function() {
      expect(Math.acosh(12378)).to.equal(10.116823161227558);
      expect(Math.acosh(1.16)).to.equal(0.5584022165800473);
    });
  });

  describe('#asinh()', function() {
    it('should be correct', function() {
      expect(Math.asinh(12327)).to.equal(10.11269443975669);
      expect(Math.asinh(88.1)).to.equal(5.171651921758122);
    });
  });

  describe('#atanh()', function() {
    it('should be correct', function() {
      expect(Math.atanh(0.5)).to.equal(0.5493061443340549);
      expect(Math.atanh(-0.9999999)).to.equal(-8.40562139102231);
    });
  });

  describe('#cosh()', function() {
    it('should be correct', function() {
      expect(Math.cosh(0.5)).to.equal(1.1276259652063807);
      expect(Math.cosh(0)).to.equal(1);
      expect(Math.cosh(10)).to.equal(11013.232920103323);
    });
  });

  describe('#expm1()', function() {
    it('should be correct', function() {
      expect(Math.expm1(10)).to.equal(22025.465794806718);
      expect(Math.expm1(5.55)).to.equal(256.23755590577474);
    });
  });

  describe('#hypot()', function() {
    it('should be correct', function() {
      expect(Math.hypot(66, 66)).to.equal(93.33809511662427);
      expect(Math.hypot(0.1, 100)).to.equal(100.0000499999875);
    });
  });

  describe('#log2()', function() {
    it('should be correct', function() {
      expect(Math.log2(0.66)).to.equal(-0.5994620704162712);
      expect(Math.log2(32)).to.equal(5);
    });
  });

  describe('#log10', function() {
    it('should be correct', function() {
      expect(Math.log10(148)).to.equal(2.1702617153949575);
      expect(Math.log10(0.01)).to.equal(-2.0);
      expect(Math.log10(2349)).to.equal(3.370883016777606);
    });
  });

  describe('#log1p', function() {
    it('should be correct', function() {
      expect(Math.log1p(0.5)).to.equal(0.4054651081081644);
      expect(Math.log1p(0.55)).to.equal(0.4382549309311553);
      expect(Math.log1p(55.55)).to.equal(4.03512520256213);
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
      expect(Number.isNaN(Math.sign(NaN))).to.be.ok();
    });
  });

  describe('#sinh()', function() {
    it('should be correct', function() {
      expect(Math.sinh(90)).to.equal(6.102016471589204e+38);
      expect(Math.sinh(0.16)).to.equal(0.16068354101279944);
    });
  });

  describe('#tanh()', function() {
    it('should be correct', function() {
      expect(Math.tanh(90)).to.equal(1);
      expect(Math.tanh(0.16)).to.equal(0.1586485042974989);
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
