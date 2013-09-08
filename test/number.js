describe('Number', function() {
  var undefined;
  var integers = [5295, -5295, -9007199254740991, 9007199254740991, 0, -0];
  var nonIntegers = [-9007199254741992, 9007199254741992, 5.9];
  var infinities = [Infinity, -Infinity];
  var nonNumbers = [undefined, true, null, {}, [], 'str'];
  var expectToBeOk = function(item) {
    expect(item).to.be.ok;
  };
  var expectToNotBeOk = function(item) {
    expect(item).to.not.be.ok;
  };

  describe('Number constants', function() {
    it('should have max safe integer', function() {
      expect(Number.MAX_SAFE_INTEGER).to.equal(Math.pow(2, 53) - 1);
    });

    it('should have min safe integer', function() {
      expect(Number.MIN_SAFE_INTEGER).to.equal(-Math.pow(2, 53) + 1);
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
      expect(Number.isFinite(Infinity)).to.not.be.ok;
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

  describe('Number.isSafeInteger()', function() {
    it('should be truthy on integers', function() {
      integers.map(Number.isSafeInteger).forEach(expectToBeOk);
      expect(Number.isSafeInteger(4)).to.be.ok;
      expect(Number.isSafeInteger(4.0)).to.be.ok;
      expect(Number.isSafeInteger(1801439850948)).to.be.ok;
    });

    it('should be falsy on non-integers', function() {
      expect(Number.isSafeInteger(4.2)).to.not.be.ok;
      expect(Number.isSafeInteger(Infinity)).to.not.be.ok;
      expect(Number.isSafeInteger(-Infinity)).to.not.be.ok;
      expect(Number.isSafeInteger(NaN)).to.not.be.ok;
      expect(Number.isSafeInteger(true)).to.not.be.ok;
      expect(Number.isSafeInteger(false)).to.not.be.ok;
      expect(Number.isSafeInteger('str')).to.not.be.ok;
      expect(Number.isSafeInteger({})).to.not.be.ok;
      expect(Number.isSafeInteger({
        valueOf: function() { return 3; }
      })).to.not.be.ok;
      expect(Number.isSafeInteger({
        valueOf: function() { return 0/0; }
      })).to.not.be.ok;
      expect(Number.isSafeInteger({
        valueOf: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isSafeInteger({
        toString: function() { throw 17; }
      })).to.not.be.ok;
      expect(Number.isSafeInteger({
        valueOf: function() { throw 17; },
        toString: function() { throw 42; }
      })).to.not.be.ok;
   });

    it('should be false when the type is not number', function() {
      var nonNumbers = [
        false,
        true,
        null,
        undefined,
        '',
        function () {},
        { valueOf: function () { return 3; } },
        /a/g,
        {}
      ];
      nonNumbers.forEach(function (thing) {
        expect(Number.isSafeInteger(thing)).to.equal(false);
      });
    });

    it('should be false when NaN', function() {
      expect(Number.isSafeInteger(NaN)).to.equal(false);
    });

    it('should be false when ∞', function() {
      expect(Number.isSafeInteger(Infinity)).to.equal(false);
      expect(Number.isSafeInteger(-Infinity)).to.equal(false);
    });

    it('should be false when number is not integer', function() {
      expect(Number.isSafeInteger(3.4)).to.equal(false);
      expect(Number.isSafeInteger(-3.4)).to.equal(false);
    });

    it('should be false when abs(number) is 2^53 or larger', function() {
      expect(Number.isSafeInteger(Math.pow(2, 53))).to.equal(false);
      expect(Number.isSafeInteger(-Math.pow(2, 53))).to.equal(false);
    });

    it('should be true when abs(number) is less than 2^53', function() {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];
      safeIntegers.forEach(function (int) {
        expect(Number.isSafeInteger(int)).to.equal(true);
        expect(Number.isSafeInteger(-int)).to.equal(true);
      });
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

  describe('#clz()', function() {
    it('should have proper uint32 conversion', function() {
      infinities.forEach(function(item) {
        expect(item.clz()).to.equal(32);
      });
      nonIntegers.forEach(function(item) {
        expect(item.clz()).to.be.within(0, 32);
      });
      expect(NaN.clz()).to.equal(32);
      expect((0x100000000).clz()).to.equal(31);
      expect((-1).clz()).to.equal(0);
    });
  });
});
