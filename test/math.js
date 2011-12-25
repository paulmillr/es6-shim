var expect = require('expect.js');
require('../');

describe('Math', function() {
  describe('Math.sign()', function() {
    it('should be 1 on positive values', function() {
      [Infinity, 1].forEach(function(value) {
        expect(Math.sign(value)).to.equal(1);
      });
    });

    it('should be -1 on negative values', function() {
      [-Infinity, -1].forEach(function(value) {
        expect(Math.sign(value)).to.equal(-1);
      });
    });
    
    it('should be 0 on 0', function() {
      expect(Math.sign(0)).to.equal(0);
    });
    
    it('should be NaN on NaN', function() {
      expect(isNaN(Math.sign(NaN))).to.be.ok();
    });
  });
});
