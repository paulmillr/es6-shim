var expect = require('expect.js');
require('../');

describe('Number', function() {
  describe('Number.isInteger()', function() {
    it('should be truthy on integers', function() {
      [5295, -5295, -9007199254740991, 9007199254740991, 0,
        -0].forEach(function(value) {
        expect(Number.isInteger(value)).to.be.ok();
      });
    });

    it('should not be truthy on non-integers', function() {
      ['test', Infinity, -Infinity, -9007199254740992, 9007199254740992,
        5.9, NaN].forEach(function(value) {
        expect(Number.isInteger(value)).to.not.be.ok();
      });
    });
  });

  describe('Number.isNaN()', function() {
    it('should be truthy on NaN', function() {
      expect(Number.isNaN(NaN)).to.be.ok();
    });

    it('should be falsy on everything else', function() {
      [void 0, true, null, {}, 37, [], 'str'].forEach(function(item) {
        expect(Number.isNaN(item)).to.not.be.ok();
      });
    });
  });

  describe('Number.toInteger()', function() {
    it('should convert things to integer value', function() {
      expect(Number.toInteger(4294967297)).to.equal(4294967297);
      expect(Number.toInteger(1.5)).to.equal(1);
      expect(Number.toInteger(-1.5)).to.equal(-1);
      expect(Number.toInteger(1/3)).to.equal(0);
      expect(Number.toInteger(Infinity)).to.equal(Infinity);
      expect(Number.toInteger(Infinity)).to.equal(Infinity);
      expect(Number.toInteger(Infinity)).to.equal(Infinity);
      expect(Number.toInteger(NaN)).to.equal(0);
      expect(Number.toInteger('thing')).to.equal(0);
    });
  });
});
