describe('Number', function() {
  var integers = [5295, -5295, -9007199254740991, 9007199254740991, 0, -0];
  var nonIntegers = [-9007199254741992, 9007199254741992, 5.9];
  var infinities = [Infinity, -Infinity];
  var nonNumbers = [void 0, true, null, {}, [], 'str'];
  var expectToBeOk = function(item) {
    expect(item).to.be.ok;
  };
  var expectToNotBeOk = function(item) {
    expect(item).to.not.be.ok;
  };

  describe('Number constants', function() {
    it('should has max integer', function() {
      expect(Number.MAX_INTEGER).to.equal(9007199254740991);
    });

    it('should has epsilon', function() {
      expect(Number.EPSILON).to.equal(2.2204460492503130808472633361816e-16);
    });
  });

  describe('Number.parseInt()', function() {
    it('should work', function() {
      expect(Number.parseInt('601')).to.equal(601);
    });
  });

  describe('Number.parseFloat()', function() {
    it('should work', function() {
      expect(Number.parseFloat('5.5')).to.equal(5.5);
    });
  });

  describe('Number.isFinite()', function() {
    it('should work', function() {
      integers.map(Number.isFinite).forEach(expectToBeOk);
      infinities.map(Number.isFinite).forEach(expectToNotBeOk);
      expect(Number.isFinite(Infinity)).to.not.be.ok
      expect(Number.isFinite(-Infinity)).to.not.be.ok;
      expect(Number.isFinite(NaN)).to.not.be.ok;
      expect(Number.isFinite(4)).to.be.ok;
      expect(Number.isFinite(4.5)).to.be.ok;
      expect(Number.isFinite('hi')).to.not.be.ok;
      expect(Number.isFinite('1.3')).to.not.be.ok;
      expect(Number.isFinite('51')).to.not.be.ok;
      expect(Number.isFinite(0)).to.be.ok;
      expect(Number.isFinite(-0)).to.be.ok;
      expect(Number.isFinite({
        valueOf: function() { return 3; }
      })).to.not.be.ok;
      expect(Number.isFinite({
        valueOf: function() { return 0/0; }
      })).to.not.be.ok;
      expect(Number.isFinite({
        valueOf: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isFinite({
        toString: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isFinite({
        valueOf: function() { throw 17; },
        toString: function() { throw 42; }
      })).to.not.be.ok;
    });

    it('should not be confused by type coercion', function() {
      nonNumbers.map(Number.isFinite).forEach(expectToNotBeOk);
    });
  });

  describe('Number.isInteger()', function() {
    it('should be truthy on integers', function() {
      integers.map(Number.isInteger).forEach(expectToBeOk);
      expect(Number.isInteger(4)).to.be.ok;
      expect(Number.isInteger(4.)).to.be.ok;
      expect(Number.isInteger(4.2)).to.not.be.ok;
      expect(Number.isInteger(0.)).to.be.ok;
      expect(Number.isInteger(-0.)).to.be.ok;
      expect(Number.isInteger(Infinity)).to.not.be.ok;
      expect(Number.isInteger(-Infinity)).to.not.be.ok;
      expect(Number.isInteger(NaN)).to.not.be.ok;
      expect(Number.isInteger(true)).to.not.be.ok;
      expect(Number.isInteger(false)).to.not.be.ok;
      expect(Number.isInteger('str')).to.not.be.ok;
      expect(Number.isInteger({})).to.not.be.ok;
      expect(Number.isInteger({
        valueOf: function() { return 3; }
      })).to.not.be.ok;
      expect(Number.isInteger({
        valueOf: function() { return 0/0; }
      })).to.not.be.ok;
      expect(Number.isInteger({
        valueOf: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isInteger({
        toString: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isInteger({
        valueOf: function() { throw 17; },
        toString: function() { throw 42; }
      })).to.not.be.ok;
    });
  });

  describe('Number.isNaN()', function() {
    it('should be truthy only on NaN', function() {
      integers.concat(nonIntegers).map(Number.isNaN).forEach(expectToNotBeOk);
      nonNumbers.map(Number.isNaN).forEach(expectToNotBeOk);
      expect(Number.isNaN(NaN)).to.be.ok;
      expect(Number.isNaN(0/0)).to.be.ok;
      expect(Number.isNaN(Number('NaN'))).to.be.ok;
      expect(Number.isNaN(4)).to.not.be.ok;
      expect(Number.isNaN(4.5)).to.not.be.ok;
      expect(Number.isNaN('hi')).to.not.be.ok;
      expect(Number.isNaN('1.3')).to.not.be.ok;
      expect(Number.isNaN('51')).to.not.be.ok;
      expect(Number.isNaN(0)).to.not.be.ok;
      expect(Number.isNaN(-0)).to.not.be.ok;
      expect(Number.isNaN({valueOf: function() { return 3; }})).to.not.be.ok;
      expect(Number.isNaN({valueOf: function() { return 0/0; }})).to.not.be.ok;
      expect(Number.isNaN({valueOf: function() { throw 17; } })).to.not.be.ok;
      expect(Number.isNaN({toString: function() { throw 17; } })).to.not.be.ok;
      expect(Number.isNaN({
        valueOf: function() { throw 17; },
        toString: function() { throw 42; }
      })).to.not.be.ok;
    });
  });

  describe('Number.toInteger()', function() {
    it('should convert things to integer value', function() {
      expect(Number.toInteger(4)).to.equal(4);
      expect(Number.toInteger(4.)).to.equal(4);
      expect(Number.toInteger(4.3)).to.equal(4);
      expect(Number.toInteger(-4)).to.equal(-4);
      expect(Number.toInteger(-4.)).to.equal(-4);
      expect(Number.toInteger(-4.3)).to.equal(-4);
      expect(Number.toInteger(0.)).to.equal(0.);
      expect(Number.toInteger(-0.)).to.equal(-0.);
      expect(Number.toInteger(Infinity)).to.equal(Infinity);
      expect(Number.toInteger(-Infinity)).to.equal(-Infinity);
      expect(Number.toInteger(NaN)).to.equal(0);
      expect(Number.toInteger(null)).to.equal(0);
      expect(Number.toInteger(undefined)).to.equal(0);
      expect(Number.toInteger(true)).to.equal(1);
      expect(Number.toInteger(false)).to.equal(0);
      expect(Number.toInteger({
        valueOf: function() { return 4; }
      })).to.equal(4);
      expect(Number.toInteger({
        valueOf: function() { return 4.3; }
      })).to.equal(4);
      expect(Number.toInteger({
        valueOf: function() { return '4'; }
      })).to.equal(4);
      expect(Number.toInteger({
        valueOf: function() { return {};}
      })).to.equal(0);
      expect(Number.toInteger()).to.equal(0);
    });
  });

  describe('#clz()', function() {
    it('should have proper uint32 conversion', function() {
      infinities.forEach(function(item) {
        expect(item.clz()).to.equal(32);
      });
      nonIntegers.forEach(function(item) {
        expect(item.clz()).to.be.within(0, 32);
      });
      expect(NaN.clz()).to.equal(32);
      expect(0x100000000.clz()).to.equal(31);
      expect((-1).clz()).to.equal(0);
    });
  });
});
