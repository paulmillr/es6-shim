var expect = require('expect.js');
require('../');

describe('Array', function() {
  describe('Array.from()', function() {
    it('should create correct array from iterable', function() {
      (function() {
        expect(Array.from(arguments)).to.eql([0, 1, 2])
      })(0, 1, 2);
      
      (function() {
        expect(Array.from(arguments)).to.eql([null, undefined, 0.1248, -0, 0]);
      })(null, undefined, 0.1248, -0, 0);
    });

    it('should handle empty iterables correctly', function() {
      (function() {
        expect(Array.from(arguments)).to.eql([]);
      })();
    });
  });
  
  describe('Array.of()', function() {
    it('should create correct array from arguments', function() {
      expect(Array.of(1, null, void 0)).to.eql([1, null, void 0])
    });
  });
});
