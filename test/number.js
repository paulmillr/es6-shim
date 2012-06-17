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
      expect(Number.MAX_INTEGER).to.equal(9007199254740992);
    });
    
    it('should has epsilon', function() {
      expect(Number.EPSILON).to.equal(2.220446049250313e-16);
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
    });
    
    it('should not be confused by type coercion', function() {
      nonNumbers.map(Number.isFinite).forEach(expectToNotBeOk);
    });
  });

  describe('Number.isInteger()', function() {
    it('should be truthy on integers', function() {
      integers.map(Number.isInteger).forEach(expectToBeOk);
    });

    it('should not be confused by type coercion', function() {
      nonIntegers.concat(
        infinities, nonNumbers
      ).map(Number.isInteger).forEach(expectToNotBeOk);
    });
  });

  describe('Number.isNaN()', function() {
    it('should be truthy only on NaN', function() {
      expect(Number.isNaN(NaN)).to.be.ok;
      integers.concat(nonIntegers).map(Number.isNaN).forEach(expectToNotBeOk);
    });

    it('should not be confused by type coercion', function() {
      nonNumbers.map(Number.isNaN).forEach(expectToNotBeOk);
    });
  });

  describe('Number.toInteger()', function() {
    it('should convert things to integer value', function() {
      integers.concat(infinities).forEach(function(item) {
        expect(Number.toInteger(item)).to.equal(item);
      });
      [[1.5, 1], [-1.5, -1], [1/3, 0], [NaN, 0], ['str', 0]
        ].forEach(function(item) {
        expect(Number.toInteger(item[0])).to.equal(item[1]);
      });
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
