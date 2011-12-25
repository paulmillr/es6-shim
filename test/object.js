var expect = require('expect.js');
require('../');

describe('Object', function() {
  describe('Object.is()', function() {
    it('should compare regular objects correctly', function() {
      expect(Object.is(null, null)).to.be.ok();
      expect(Object.is(void 0, void 0)).to.be.ok();
      expect(Object.is([0], [0])).to.not.be.ok();
      expect(Object.is(5, 5)).to.be.ok();
      expect(Object.is('str', 'str')).to.be.ok();
      var obj = {a: null};
      expect(Object.is(obj, obj)).to.be.ok();
    });

    it('should compare 0 and -0 correctly', function() {
      expect(Object.is(0, -0)).to.not.be.ok();
    });

    it('should compare NaNs correctly', function() {
      expect(Object.is(NaN, NaN)).to.be.ok();
    });
  });
  
  describe('Object.getOwnPropertyDescriptors()', function() {
    it('should produce an array of properties', function() {
      expect(Object.getOwnPropertyDescriptors({a: 1, b: 2, c: 3})).to.eql({
        a: {configurable: true, enumerable: true, value: 1, writable: true},
        b: {configurable: true, enumerable: true, value: 2, writable: true},
        c: {configurable: true, enumerable: true, value: 3, writable: true}
      });
    });
  });
  
  describe('Object.getPropertyDescriptor()', function() {
    it('should produce an array of properties including inherited ones',
      function() {
      expect(Object.getPropertyDescriptor([1], 'length')).to.eql({
        configurable: false, enumerable: false, value: 1, writable: true
      });

      expect(Object.getPropertyDescriptor([1, 5], 'length')).to.eql({
        configurable: false, enumerable: false, value: 2, writable: true
      });

      expect(Object.getPropertyDescriptor(function(a) {}, 'length')).to.eql({
        configurable: false, enumerable: false, value: 1, writable: false
      });
    });
  });

  describe('Object.getPropertyNames()', function() {
    it('should produce an array of property names including inherited ones',
      function() {
      expect(false).to.be.ok();
    });
  });
});