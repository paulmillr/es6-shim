// Big thanks to V8 folks for test ideas.
// v8/test/mjsunit/harmony/collections.js

var Assertion = expect().constructor;
Assertion.addMethod('theSameSet', function (otherArray) {
    var array = this._obj;

    expect(Array.isArray(array)).to.equal(true);
    expect(Array.isArray(otherArray)).to.equal(true);

    var diff = array.filter(function (value) {
        return !otherArray.some(function (otherValue) {
            var areBothNaN = typeof value === 'number' && typeof otherValue === 'number' && value !== value && otherValue !== otherValue;
            return areBothNaN || value === otherValue;
        });
    });

    this.assert(
        diff.length === 0,
        "expected #{this} to be equal to #{exp} (as sets, i.e. no order)",
        array,
        otherArray
    );
});

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
      expect(Map).to.be.ok;
    });

    it('should has valid getter and setter calls', function() {
      ['get', 'set', 'has', 'delete'].forEach(function(method) {
        expect(function() {
          map[method]({});
        }).to.not.throw();
      });
    });

    it('should map values correctly', function() {
      range(1, 20).forEach(function(number) {
        testMapping(number, {});
        testMapping(number / 100, {});
        testMapping('key-' + number, {});
      });

      [+0, -0, Infinity, -Infinity, true, false, null, undefined].forEach(function(key) {
        testMapping(key, {});
      });
    });

    it('should map empty values correctly', function() {
      testMapping({}, true);
      testMapping(null, true);
      testMapping(undefined, true);
      testMapping('', true);
      testMapping(NaN, true);
      testMapping(0, true);
    });

    it('should has correct querying behavior', function() {
      var key = {};
      testMapping(key, 'to-be-present');
      expect(map.has(key)).to.be.true;
      expect(map.has({})).to.be.false;
      testMapping(key, void 0);
      expect(map.has(key)).to.be.true;
      expect(map.has({})).to.be.false;
    });

    it('should allow to be initialized directly', function() {
      expect(Map()).to.be.an.instanceof(Map);
    });

    it('should allow NaN values as keys', function() {
      expect(map.has(NaN)).to.be.false;
      expect(map.has(NaN + 1)).to.be.false;
      expect(map.has(23)).to.be.false;
      map.set(NaN, 'value');
      expect(map.has(NaN)).to.be.true;
      expect(map.has(NaN + 1)).to.be.true;
      expect(map.has(23)).to.be.false;
    });

    it('should not have [[Enumerable]] props', function() {
      expectNotEnumerable(Map);
      expectNotEnumerable(Map.prototype);
      expectNotEnumerable(new Map());
    });

    it('should allow common ecmascript idioms', function() {
      expect(map).to.be.an.instanceof(Map);
      expect(Map.prototype.get).to.be.an.instanceof(Function);
      expect(Map.prototype.set).to.be.an.instanceof(Function);
      expect(Map.prototype.has).to.be.an.instanceof(Function);
      expect(Map.prototype['delete']).to.be.an.instanceof(Function);
    });

    it('should has unique constructor', function() {
      expect(Map.prototype).to.not.equal(Object.prototype);
    });

    it('should have keys, values and size props', function() {
      map.set('a', 1);
      map.set('b', 2);
      map.set('c', 3);
      expect(map.keys).to.be.an.instanceof(Function);
      expect(map.values).to.be.an.instanceof(Function);
      expect(map.size).to.equal(3);
      map['delete']('a');
      expect(map.size).to.equal(2);
    });

    describe('#forEach', function() {
      beforeEach(function() {
        map.set('a', 1);
        map.set('b', 2);
        map.set('c', 3);
      });

      it('should be iterable via forEach', function() {
        var expectedMap = {
          a: 1,
          b: 2,
          c: 3
        };
        var foundMap = {};
        map.forEach(function (value, key, entireMap) {
          expect(entireMap).to.equal(map);
          foundMap[key] = value;
        });
        expect(foundMap).to.eql(expectedMap);
      });

      it('should iterate over empty keys', function() {
        map.clear();
        var expectedKeys = [{}, null, undefined, '', NaN, 0];
        expectedKeys.forEach(function (key) {
          map.set(key, true);
        });
        var foundKeys = [];
        map.forEach(function (value, key, entireMap) {
          expect(entireMap.get(key)).to.equal(value);
          foundKeys.push(key);
        });
        expect(foundKeys).to.be.theSameSet(expectedKeys);
      });

      it('should support the thisArg', function() {
        var context = function () {};
        map.forEach(function (value, key, entireMap) {
          expect(this).to.equal(context);
        }, context);
      });

      it('should have a length of 1', function() {
        expect(Map.prototype.forEach.length).to.equal(1);
      });

      it('should not revisit modified keys', function() {
        var hasModifiedA = false;
        map.forEach(function (value, key) {
          if (!hasModifiedA && key === 'a') {
            map.set('a', 4);
            hasModifiedA = true;
          } else {
            expect(key).not.to.equal('a');
          }
        });
      });

      it('visits keys added in the iterator', function() {
        var hasAdded = false;
        var hasFoundD = false;
        map.forEach(function (value, key) {
          if (!hasAdded) {
            map.set('d', 5);
            hasAdded = true;
          } else if (key === 'd') {
            hasFoundD = true;
          }
        });
        expect(hasFoundD).to.equal(true);
      });

      it('does not visit keys deleted before a visit', function() {
        var hasVisitedC = false;
        map.forEach(function (value, key) {
          if (key === 'c') {
            hasVisitedC = true;
          }
          if (!hasVisitedC) {
            map['delete']('c');
          }
        });
        expect(hasVisitedC).to.equal(false);
      });

      it('should work after deletion of the current key', function() {
        var expectedMap = {
          a: 1,
          b: 2,
          c: 3
        };
        var foundMap = {};
        map.forEach(function (value, key) {
          foundMap[key] = value;
          map['delete'](key);
        });
        expect(foundMap).to.eql(expectedMap);
      });
    });
  });

  it('iteration', function () {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    map.set('d', 4);

    var keys = [];
    var iterator = map.keys();
    keys.push(iterator.next());
    map["delete"]('a');
    map["delete"]('b');
    map["delete"]('c');
    map.set('e');
    keys.push(iterator.next());
    keys.push(iterator.next());

    expect(keys).to.eql(['a', 'd', 'e']);
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
      expect(Set).to.be.ok;
    });

    it('should has valid getter and setter calls', function() {
      ['add', 'has', 'delete'].forEach(function(method) {
        expect(function() {
          set[method]({});
        }).to.not.throw();
      });
    });

    it('should work as expected', function() {
      var testSet = function(key) {
        expect(set.has(key)).to.be.false;
        set.add(key);
        expect(set.has(key)).to.be.true;
        set['delete'](key);
        expect(set.has(key)).to.be.false;
      };

      range(1, 20).forEach(function(number) {
        testSet({});
        testSet(number);
        testSet(number / 100);
        testSet('key-' + number);
      });

      [+0, -0, Infinity, -Infinity, true, false, null, undefined].forEach(testSet);
    });

    it('should has #size', function() {
      set.add(1);
      set.add(5);
      expect(set.size).to.equal(2);
    });

    it('should has #clear method', function() {
      set.add(1);
      set.add(5);
      expect(set.size).to.equal(2);
      expect(set.has(5)).to.be.true;
      set.clear();
      expect(set.size).to.equal(0);
      expect(set.has(5)).to.be.false;
    });

    it('should allow to be initialized directly', function() {
      expect(Set()).to.be.an.instanceof(Set);
    });

    it('should allow NaN values as keys', function() {
      expect(set.has(NaN)).to.be.false;
      expect(set.has(NaN + 1)).to.be.false;
      expect(set.has(23)).to.be.false;
      set.add(NaN);
      expect(set.has(NaN)).to.be.true;
      expect(set.has(NaN + 1)).to.be.true;
      expect(set.has(23)).to.be.false;
    });

    it('should not have [[Enumerable]] props', function() {
      expectNotEnumerable(Set);
      expectNotEnumerable(Set.prototype);
      expectNotEnumerable(new Set());
    });

    it('should allow common ecmascript idioms', function() {
      expect(set).to.be.an.instanceof(Set);
      expect(Set.prototype.add).to.be.an.instanceof(Function);
      expect(Set.prototype.has).to.be.an.instanceof(Function);
      expect(Set.prototype['delete']).to.be.an.instanceof(Function);
    });

    it('should has unique constructor', function() {
      expect(Set.prototype).to.not.equal(Object.prototype);
    });

    describe('#forEach', function() {
      beforeEach(function() {
        set.add('a');
        set.add('b');
        set.add('c');
      });

      it('should be iterable via forEach', function() {
        var expectedSet = ['a', 'b', 'c'];
        var foundSet = [];
        set.forEach(function (value, alsoValue, entireSet) {
          expect(entireSet).to.equal(set);
          expect(value).to.equal(alsoValue);
          foundSet.push(value);
        });
        expect(foundSet).to.eql(expectedSet);
      });

      it('should support the thisArg', function() {
        var context = function () {};
        set.forEach(function (value, alsoValue, entireMap) {
          expect(this).to.equal(context);
        }, context);
      });

      it('should have a length of 1', function() {
        expect(Set.prototype.forEach.length).to.equal(1);
      });
    });

    it.skip('should throw proper errors when user invokes methods with wrong types of receiver', function() {

    });
  });
});
