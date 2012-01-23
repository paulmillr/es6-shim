var expect = require('expect.js');
require('../');

// Big thanks to V8 folks for test ideas.
// v8/test/mjsunit/harmony/collections.js

describe('Collections', function() {
  var range = function(from, to) {
    var result = [];
    for (var value = from; value < to; value++) {
      result.push(value);
    }
    return result;
  };
  
  var expectNotEnumerable = function(object) {
    expect(Object.keys(object).length).to.equal(0);
  };

  describe('Map', function() {
    var map;
    var testMapping = function(key, value) {
      map.set(key, value);
      expect(map.get(key)).to.equal(value);
    };

    beforeEach(function() {
      map = new Map();
    });
    
    afterEach(function() {
      map = null;
    });

    it('should exist in global namespace', function() {
      expect(Map).to.be.ok();
    });

    it('should has valid getter and setter calls', function() {
      ['get', 'set', 'has', 'delete'].forEach(function(method) {
        expect(function() {
          map[method](new Object);
        }).to.not.throwException();
      })
    });

    it('should map values correctly', function() {      
      range(1, 20).forEach(function(number) {
        testMapping(number, new Object);
        testMapping(number / 100, new Object);
        testMapping('key-' + number, new Object);
      });
      
      [+0, -0, Infinity, -Infinity, true, false, null, undefined].forEach(function(key) {
        testMapping(key, new Object);
      });
    });
    
    it('should has correct querying behavior', function() {
      var key = new Object;
      testMapping(key, 'to-be-present');
      expect(map.has(key)).to.be(true);
      expect(map.has(new Object)).to.be(false);
      // FIXME
      testMapping(key, void 0);
      expect(map.has(key)).to.be(false);
      expect(map.has(new Object)).to.be(false);
    });
    
    it('should allow to be initialized directly', function() {
      expect(Map()).to.be.a(Map);
    });
    
    it('should allow NaN values as keys', function() {
      expect(map.has(NaN)).to.be(false);
      expect(map.has(NaN + 1)).to.be(false);
      expect(map.has(23)).to.be(false);
      map.set(NaN, 'value');
      expect(map.has(NaN)).to.be(true);
      expect(map.has(NaN + 1)).to.be(true);
      expect(map.has(23)).to.be(false);
    });
    
    it('should not have [[Enumerable]] props', function() {
      expectNotEnumerable(Map);
      expectNotEnumerable(Map.prototype);
      expectNotEnumerable(new Map);
    });
    
    it('should allow common ecmascript idioms', function() {
      expect(map).to.be.a(Map);
      expect(Map.prototype.get).to.be.a(Function);
      expect(Map.prototype.set).to.be.a(Function);
      expect(Map.prototype.has).to.be.a(Function);
      expect(Map.prototype['delete']).to.be.a(Function);
    });
    
    it('should has unique constructor', function() {
      expect(Map.prototype).to.not.equal(Object.prototype);
    });
  });

  describe('Set', function() {
    var set;

    beforeEach(function() {
      set = new Set();
    });
    
    afterEach(function() {
      set = null;
    });

    it('should exist in global namespace', function() {
      expect(Set).to.be.ok();
    });
    
    it('should has valid getter and setter calls', function() {
      ['add', 'has', 'delete'].forEach(function(method) {
        expect(function() {
          set[method](new Object);
        }).to.not.throwException();
      })
    });
    
    it('should work as expected', function() {
      var testSet = function(key) {
        expect(set.has(key)).to.be(false);
        set.add(key);
        expect(set.has(key)).to.be(true);
        set.delete(key);
        expect(set.has(key)).to.be(false);
      };
      
      range(1, 20).forEach(function(number) {
        testSet(new Object);
        testSet(number);
        testSet(number / 100);
        testSet('key-' + number);
      });
      
      [+0, -0, Infinity, -Infinity, true, false, null, undefined].forEach(testSet);
    });
    
    it('should allow to be initialized directly', function() {
      expect(Set()).to.be.a(Set);
    });
    
    it('should allow NaN values as keys', function() {
      expect(set.has(NaN)).to.be(false);
      expect(set.has(NaN + 1)).to.be(false);
      expect(set.has(23)).to.be(false);
      set.add(NaN);
      expect(set.has(NaN)).to.be(true);
      expect(set.has(NaN + 1)).to.be(true);
      expect(set.has(23)).to.be(false);
    });
    
    it('should not have [[Enumerable]] props', function() {
      expectNotEnumerable(Set);
      expectNotEnumerable(Set.prototype);
      expectNotEnumerable(new Set);
    });

    it('should allow common ecmascript idioms', function() {
      expect(set).to.be.a(Set);
      expect(Set.prototype.add).to.be.a(Function);
      expect(Set.prototype.has).to.be.a(Function);
      expect(Set.prototype['delete']).to.be.a(Function);
    });
    
    it('should has unique constructor', function() {
      expect(Set.prototype).to.not.equal(Object.prototype);
    });
    
    it('should throw proper errors when user invokes methods with wrong types of receiver',
      function() {
      
    });
  });
});
