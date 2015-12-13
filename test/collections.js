/* global describe, it, xit, expect, require, beforeEach, afterEach */

// Big thanks to V8 folks for test ideas.
// v8/test/mjsunit/harmony/collections.js

var Assertion = expect().constructor;
Assertion.addMethod('theSameSet', function (otherArray) {
  var array = this._obj;

  expect(Array.isArray(array)).to.equal(true);
  expect(Array.isArray(otherArray)).to.equal(true);

  var diff = array.filter(function (value) {
    return otherArray.every(function (otherValue) {
      var areBothNaN = typeof value === 'number' && typeof otherValue === 'number' && value !== value && otherValue !== otherValue;
      return !areBothNaN && value !== otherValue;
    });
  });

  this.assert(
    diff.length === 0,
    'expected #{this} to be equal to #{exp} (as sets, i.e. no order)',
    array,
    otherArray
  );
});

Assertion.addMethod('entries', function (expected) {
  var collection = this._obj;

  expect(Array.isArray(expected)).to.equal(true);
  var expectedEntries = expected.slice();

  var iterator = collection.entries();
  var result;
  do {
    result = iterator.next();
    expect(result.value).to.be.eql(expectedEntries.shift());
  } while (!result.done);
});

describe('Collections', function () {
  var functionsHaveNames = (function foo() {}).name === 'foo';
  var ifFunctionsHaveNamesIt = functionsHaveNames ? it : xit;
  var ifShimIt = (typeof process !== 'undefined' && process.env.NO_ES6_SHIM) ? it.skip : it;

  var range = function (from, to) {
    var result = [];
    for (var value = from; value < to; value++) {
      result.push(value);
    }
    return result;
  };

  var prototypePropIsEnumerable = (function () {}).propertyIsEnumerable('prototype');
  var expectNotEnumerable = function (object) {
    if (prototypePropIsEnumerable && typeof object === 'function') {
      expect(Object.keys(object)).to.eql(['prototype']);
    } else {
      expect(Object.keys(object)).to.eql([]);
    }
  };

  var Sym = typeof Symbol === 'undefined' ? {} : Symbol;
  var isSymbol = function (sym) {
    return typeof Sym === 'function' && typeof sym === 'symbol';
  };
  var ifSymbolIteratorIt = isSymbol(Sym.iterator) ? it : xit;

  var testMapping = function (map, key, value) {
    expect(map.has(key)).to.equal(false);
    expect(map.get(key)).to.equal(undefined);
    expect(map.set(key, value)).to.equal(map);
    expect(map.get(key)).to.equal(value);
    expect(map.has(key)).to.equal(true);
  };

  describe('Map', function () {
    if (typeof Map === 'undefined') {
      return it('exists', function () {
        expect(typeof Map).to.equal('function');
      });
    }

    var map;
    beforeEach(function () {
      map = new Map();
    });

    afterEach(function () {
      map = null;
    });

    ifShimIt('is on the exported object', function () {
      var exported = require('../');
      expect(exported.Map).to.equal(Map);
    });

    it('should exist in global namespace', function () {
      expect(typeof Map).to.equal('function');
    });

    it('should have the right arity', function () {
      expect(Map).to.have.property('length', 0);
    });

    it('should has valid getter and setter calls', function () {
      ['get', 'set', 'has', 'delete'].forEach(function (method) {
        expect(function () {
          map[method]({});
        }).to.not['throw']();
      });
    });

    it('should accept an iterable as argument', function () {
      testMapping(map, 'a', 'b');
      testMapping(map, 'c', 'd');
      var map2;
      expect(function () { map2 = new Map(map); }).not.to['throw'](Error);
      expect(map2).to.be.an.instanceOf(Map);
      expect(map2.has('a')).to.equal(true);
      expect(map2.has('c')).to.equal(true);
      expect(map2).to.have.entries([['a', 'b'], ['c', 'd']]);
    });

    it('should throw with iterables that return primitives', function () {
      expect(function () { return new Map('123'); }).to['throw'](TypeError);
      expect(function () { return new Map([1, 2, 3]); }).to['throw'](TypeError);
      expect(function () { return new Map(['1', '2', '3']); }).to['throw'](TypeError);
      expect(function () { return new Map([true]); }).to['throw'](TypeError);
    });

    it('should not be callable without "new"', function () {
      expect(Map).to['throw'](TypeError);
    });

    it('should be subclassable', function () {
      if (!Object.setPrototypeOf) { return; } // skip test if on IE < 11
      var MyMap = function MyMap() {
        var testMap = new Map([['a', 'b']]);
        Object.setPrototypeOf(testMap, MyMap.prototype);
        return testMap;
      };
      Object.setPrototypeOf(MyMap, Map);
      MyMap.prototype = Object.create(Map.prototype, {
        constructor: { value: MyMap }
      });

      var myMap = new MyMap();
      testMapping(myMap, 'c', 'd');
      expect(myMap).to.have.entries([['a', 'b'], ['c', 'd']]);
    });

    it('uses SameValueZero even on a Map of size > 4', function () {
      // Chrome 38-42, node 0.11/0.12, iojs 1/2 have a bug when the Map has a size > 4
      var firstFour = [[1, 0], [2, 0], [3, 0], [4, 0]];
      var fourMap = new Map(firstFour);
      expect(fourMap.size).to.equal(4);
      expect(fourMap.has(-0)).to.equal(false);
      expect(fourMap.has(0)).to.equal(false);

      fourMap.set(-0, fourMap);

      expect(fourMap.has(0)).to.equal(true);
      expect(fourMap.has(-0)).to.equal(true);
    });

    it('treats positive and negative zero the same', function () {
      var value1 = {};
      var value2 = {};
      testMapping(map, +0, value1);
      expect(map.has(-0)).to.equal(true);
      expect(map.get(-0)).to.equal(value1);
      expect(map.set(-0, value2)).to.equal(map);
      expect(map.get(-0)).to.equal(value2);
      expect(map.get(+0)).to.equal(value2);
    });

    it('should map values correctly', function () {
      // Run this test twice, one with the "fast" implementation (which only
      // allows string and numeric keys) and once with the "slow" impl.
      [true, false].forEach(function (slowkeys) {
        map = new Map();

        range(1, 20).forEach(function (number) {
          if (slowkeys) { testMapping(map, number, {}); }
          testMapping(map, number / 100, {});
          testMapping(map, 'key-' + number, {});
          testMapping(map, String(number), {});
          if (slowkeys) { testMapping(map, Object(String(number)), {}); }
        });

        var testkeys = [Infinity, -Infinity, NaN];
        if (slowkeys) {
          testkeys.push(true, false, null, undefined);
        }
        testkeys.forEach(function (key) {
          testMapping(map, key, {});
          testMapping(map, String(key), {});
        });
        testMapping(map, '', {});

        // verify that properties of Object don't peek through.
        [
          'hasOwnProperty',
          'constructor',
          'toString',
          'isPrototypeOf',
         '__proto__',
          '__parent__',
          '__count__'
         ].forEach(function (key) {
           testMapping(map, key, {});
         });
      });
    });

    it('should map empty values correctly', function () {
      testMapping(map, {}, true);
      testMapping(map, null, true);
      testMapping(map, undefined, true);
      testMapping(map, '', true);
      testMapping(map, NaN, true);
      testMapping(map, 0, true);
    });

    it('should has correct querying behavior', function () {
      var key = {};
      testMapping(map, key, 'to-be-present');
      expect(map.has(key)).to.equal(true);
      expect(map.has({})).to.equal(false);
      expect(map.set(key, void 0)).to.equal(map);
      expect(map.get(key)).to.equal(undefined);
      expect(map.has(key)).to.equal(true);
      expect(map.has({})).to.equal(false);
    });

    it('should allow NaN values as keys', function () {
      expect(map.has(NaN)).to.equal(false);
      expect(map.has(NaN + 1)).to.equal(false);
      expect(map.has(23)).to.equal(false);
      expect(map.set(NaN, 'value')).to.equal(map);
      expect(map.has(NaN)).to.equal(true);
      expect(map.has(NaN + 1)).to.equal(true);
      expect(map.has(23)).to.equal(false);
    });

    it('should not have [[Enumerable]] props', function () {
      expectNotEnumerable(Map);
      expectNotEnumerable(Map.prototype);
      expectNotEnumerable(new Map());
    });

    it('should not have an own constructor', function () {
      var m = new Map();
      expect(m).not.to.haveOwnPropertyDescriptor('constructor');
      expect(m.constructor).to.equal(Map);
    });

    it('should allow common ecmascript idioms', function () {
      expect(map).to.be.an.instanceOf(Map);
      expect(typeof Map.prototype.get).to.equal('function');
      expect(typeof Map.prototype.set).to.equal('function');
      expect(typeof Map.prototype.has).to.equal('function');
      expect(typeof Map.prototype['delete']).to.equal('function');
    });

    it('should have a unique constructor', function () {
      expect(Map.prototype).to.not.equal(Object.prototype);
    });

    describe('#clear()', function () {
      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Map.prototype.clear).to.have.property('name', 'clear');
      });

      it('is not enumerable', function () {
        expect(Map.prototype).ownPropertyDescriptor('clear').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Map.prototype.clear).to.have.property('length', 0);
      });

      it('should have #clear method', function () {
        expect(map.set(1, 2)).to.equal(map);
        expect(map.set(5, 2)).to.equal(map);
        expect(map.size).to.equal(2);
        expect(map.has(5)).to.equal(true);
        map.clear();
        expect(map.size).to.equal(0);
        expect(map.has(5)).to.equal(false);
      });
    });

    describe('#keys()', function () {
      if (!Map.prototype.hasOwnProperty('keys')) {
        return it('exists', function () {
          expect(Map.prototype).to.have.property('keys');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Map.prototype.keys).to.have.property('name', 'keys');
      });

      it('is not enumerable', function () {
        expect(Map.prototype).ownPropertyDescriptor('keys').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Map.prototype.keys).to.have.property('length', 0);
      });
    });

    describe('#values()', function () {
      if (!Map.prototype.hasOwnProperty('values')) {
        return it('exists', function () {
          expect(Map.prototype).to.have.property('values');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Map.prototype.values).to.have.property('name', 'values');
      });

      it('is not enumerable', function () {
        expect(Map.prototype).ownPropertyDescriptor('values').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Map.prototype.values).to.have.property('length', 0);
      });
    });

    describe('#entries()', function () {
      if (!Map.prototype.hasOwnProperty('entries')) {
        return it('exists', function () {
          expect(Map.prototype).to.have.property('entries');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Map.prototype.entries).to.have.property('name', 'entries');
      });

      it('is not enumerable', function () {
        expect(Map.prototype).ownPropertyDescriptor('entries').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Map.prototype.entries).to.have.property('length', 0);
      });

      it('throws when called on a non-Map', function () {
        var expectedMessage = /^(Method )?Map.prototype.entries called on incompatible receiver |^entries method called on incompatible |^Cannot create a Map entry iterator for a non-Map object.|^Map\.prototype\.entries: 'this' is not a Map object$/;
        var nonMaps = [true, false, 'abc', NaN, new Set([1, 2]), { a: true }, [1], Object('abc'), Object(NaN)];
        nonMaps.forEach(function (nonMap) {
          expect(function () { return Map.prototype.entries.call(nonMap); }).to['throw'](TypeError, expectedMessage);
        });
      });
    });

    describe('#size', function () {
      it('throws TypeError when accessed directly', function () {
        // see https://github.com/paulmillr/es6-shim/issues/176
        expect(function () { return Map.prototype.size; }).to['throw'](TypeError);
        expect(function () { return Map.prototype.size; }).to['throw'](TypeError);
      });

      it('is an accessor function on the prototype', function () {
        expect(Map.prototype).ownPropertyDescriptor('size').to.have.property('get');
        expect(typeof Object.getOwnPropertyDescriptor(Map.prototype, 'size').get).to.equal('function');
        expect(new Map()).not.to.haveOwnPropertyDescriptor('size');
      });
    });

    it('should return false when deleting a nonexistent key', function () {
      expect(map.has('a')).to.equal(false);
      expect(map['delete']('a')).to.equal(false);
    });

    it('should have keys, values and size props', function () {
      expect(map.set('a', 1)).to.equal(map);
      expect(map.set('b', 2)).to.equal(map);
      expect(map.set('c', 3)).to.equal(map);
      expect(typeof map.keys).to.equal('function');
      expect(typeof map.values).to.equal('function');
      expect(map.size).to.equal(3);
      expect(map['delete']('a')).to.equal(true);
      expect(map.size).to.equal(2);
    });

    it('should have an iterator that works with Array.from', function () {
      expect(Array).to.have.property('from');

      expect(map.set('a', 1)).to.equal(map);
      expect(map.set('b', NaN)).to.equal(map);
      expect(map.set('c', false)).to.equal(map);
      expect(Array.from(map)).to.eql([['a', 1], ['b', NaN], ['c', false]]);
      expect(Array.from(map.keys())).to.eql(['a', 'b', 'c']);
      expect(Array.from(map.values())).to.eql([1, NaN, false]);
      expect(map).to.have.entries(Array.from(map.entries()));
    });

    ifSymbolIteratorIt('has the right default iteration function', function () {
      // fixed in Webkit https://bugs.webkit.org/show_bug.cgi?id=143838
      expect(Map.prototype).to.have.property(Sym.iterator, Map.prototype.entries);
    });

    describe('#forEach', function () {
      var mapToIterate;

      beforeEach(function () {
        mapToIterate = new Map();
        expect(mapToIterate.set('a', 1)).to.equal(mapToIterate);
        expect(mapToIterate.set('b', 2)).to.equal(mapToIterate);
        expect(mapToIterate.set('c', 3)).to.equal(mapToIterate);
      });

      afterEach(function () {
        mapToIterate = null;
      });

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Map.prototype.forEach).to.have.property('name', 'forEach');
      });

      it('is not enumerable', function () {
        expect(Map.prototype).ownPropertyDescriptor('forEach').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Map.prototype.forEach).to.have.property('length', 1);
      });

      it('should be iterable via forEach', function () {
        var expectedMap = {
          a: 1,
          b: 2,
          c: 3
        };
        var foundMap = {};
        mapToIterate.forEach(function (value, key, entireMap) {
          expect(entireMap).to.equal(mapToIterate);
          foundMap[key] = value;
        });
        expect(foundMap).to.eql(expectedMap);
      });

      it('should iterate over empty keys', function () {
        var mapWithEmptyKeys = new Map();
        var expectedKeys = [{}, null, undefined, '', NaN, 0];
        expectedKeys.forEach(function (key) {
          expect(mapWithEmptyKeys.set(key, true)).to.equal(mapWithEmptyKeys);
        });
        var foundKeys = [];
        mapWithEmptyKeys.forEach(function (value, key, entireMap) {
          expect(entireMap.get(key)).to.equal(value);
          foundKeys.push(key);
        });
        expect(foundKeys).to.be.theSameSet(expectedKeys);
      });

      it('should support the thisArg', function () {
        var context = function () {};
        mapToIterate.forEach(function () {
          expect(this).to.equal(context);
        }, context);
      });

      it('should have a length of 1', function () {
        expect(Map.prototype.forEach.length).to.equal(1);
      });

      it('should not revisit modified keys', function () {
        var hasModifiedA = false;
        mapToIterate.forEach(function (value, key) {
          if (!hasModifiedA && key === 'a') {
            expect(mapToIterate.set('a', 4)).to.equal(mapToIterate);
            hasModifiedA = true;
          } else {
            expect(key).not.to.equal('a');
          }
        });
      });

      it('returns the map from #set() for chaining', function () {
        expect(mapToIterate.set({}, {})).to.equal(mapToIterate);
        expect(mapToIterate.set(42, {})).to.equal(mapToIterate);
        expect(mapToIterate.set(0, {})).to.equal(mapToIterate);
        expect(mapToIterate.set(NaN, {})).to.equal(mapToIterate);
        expect(mapToIterate.set(-0, {})).to.equal(mapToIterate);
      });

      it('visits keys added in the iterator', function () {
        var hasAdded = false;
        var hasFoundD = false;
        mapToIterate.forEach(function (value, key) {
          if (!hasAdded) {
            mapToIterate.set('d', 5);
            hasAdded = true;
          } else if (key === 'd') {
            hasFoundD = true;
          }
        });
        expect(hasFoundD).to.equal(true);
      });

      it('visits keys added in the iterator when there is a deletion', function () {
        var hasSeenFour = false;
        var mapToMutate = new Map();
        mapToMutate.set('0', 42);
        mapToMutate.forEach(function (value, key) {
          if (key === '0') {
            expect(mapToMutate['delete']('0')).to.equal(true);
            mapToMutate.set('4', 'a value');
          } else if (key === '4') {
            hasSeenFour = true;
          }
        });
        expect(hasSeenFour).to.equal(true);
      });

      it('does not visit keys deleted before a visit', function () {
        var hasVisitedC = false;
        var hasDeletedC = false;
        mapToIterate.forEach(function (value, key) {
          if (key === 'c') {
            hasVisitedC = true;
          }
          if (!hasVisitedC && !hasDeletedC) {
            hasDeletedC = mapToIterate['delete']('c');
            expect(hasDeletedC).to.equal(true);
          }
        });
        expect(hasVisitedC).to.equal(false);
      });

      it('should work after deletion of the current key', function () {
        var expectedMap = {
          a: 1,
          b: 2,
          c: 3
        };
        var foundMap = {};
        mapToIterate.forEach(function (value, key) {
          foundMap[key] = value;
          expect(mapToIterate['delete'](key)).to.equal(true);
        });
        expect(foundMap).to.eql(expectedMap);
      });

      it('should convert key -0 to +0', function () {
        var zeroMap = new Map();
        var result = [];
        zeroMap.set(-0, 'a');
        zeroMap.forEach(function (value, key) {
          result.push(String(1 / key) + ' ' + value);
        });
        zeroMap.set(1, 'b');
        zeroMap.set(0, 'c'); // shouldn't cause reordering
        zeroMap.forEach(function (value, key) {
          result.push(String(1 / key) + ' ' + value);
        });
        expect(result.join(', ')).to.equal(
          'Infinity a, Infinity c, 1 b'
        );
      });
    });

    it('should preserve insertion order', function () {
      var convertToPairs = function (item) { return [item, true]; };
      var arr1 = ['d', 'a', 'b'];
      var arr2 = [3, 2, 'z', 'a', 1];
      var arr3 = [3, 2, 'z', {}, 'a', 1];

      [arr1, arr2, arr3].forEach(function (array) {
        var entries = array.map(convertToPairs);
        expect(new Map(entries)).to.have.entries(entries);
      });
    });
  });

  it('map iteration', function () {
    var map = new Map();
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);
    map.set('d', 4);

    var keys = [];
    var iterator = map.keys();
    keys.push(iterator.next().value);
    expect(map['delete']('a')).to.equal(true);
    expect(map['delete']('b')).to.equal(true);
    expect(map['delete']('c')).to.equal(true);
    map.set('e');
    keys.push(iterator.next().value);
    keys.push(iterator.next().value);

    expect(iterator.next().done).to.equal(true);
    map.set('f');
    expect(iterator.next().done).to.equal(true);
    expect(keys).to.eql(['a', 'd', 'e']);
  });

  it('set iteration', function () {
    var set = new Set();
    expect(set.add('a')).to.equal(set);
    expect(set.add('b')).to.equal(set);
    expect(set.add('c')).to.equal(set);
    expect(set.add('d')).to.equal(set);

    var keys = [];
    var iterator = set.keys();
    keys.push(iterator.next().value);
    expect(set['delete']('a')).to.equal(true);
    expect(set['delete']('b')).to.equal(true);
    expect(set['delete']('c')).to.equal(true);
    expect(set.add('e')).to.equal(set);
    keys.push(iterator.next().value);
    keys.push(iterator.next().value);

    expect(iterator.next().done).to.equal(true);
    expect(set.add('f')).to.equal(set);
    expect(iterator.next().done).to.equal(true);
    expect(keys).to.eql(['a', 'd', 'e']);
  });

  var testSet = function (set, key) {
    expect(set.has(key)).to.equal(false);
    expect(set['delete'](key)).to.equal(false);
    expect(set.add(key)).to.equal(set);
    expect(set.has(key)).to.equal(true);
    expect(set['delete'](key)).to.equal(true);
    expect(set.has(key)).to.equal(false);
    expect(set.add(key)).to.equal(set); // add it back
  };

  describe('Set', function () {
    if (typeof Set === 'undefined') {
      return it('exists', function () {
        expect(typeof Set).to.equal('function');
      });
    }

    var set;
    beforeEach(function () {
      set = new Set();
    });

    afterEach(function () {
      set = null;
    });

    ifShimIt('is on the exported object', function () {
      var exported = require('../');
      expect(exported.Set).to.equal(Set);
    });

    it('should exist in global namespace', function () {
      expect(typeof Set).to.equal('function');
    });

    it('has the right arity', function () {
      expect(Set).to.have.property('length', 0);
    });

    it('returns the set from #add() for chaining', function () {
      expect(set.add({})).to.equal(set);
    });

    it('should return false when deleting an item not in the set', function () {
      expect(set.has('a')).to.equal(false);
      expect(set['delete']('a')).to.equal(false);
    });

    it('should accept an iterable as argument', function () {
      testSet(set, 'a');
      testSet(set, 'b');
      var set2 = new Set(set);
      expect(set2.has('a')).to.equal(true);
      expect(set2.has('b')).to.equal(true);
      expect(set2).to.have.entries([['a', 'a'], ['b', 'b']]);
    });

    it('accepts an array as an argument', function () {
      var arr = ['a', 'b', 'c'];
      var setFromArray = new Set(arr);
      expect(setFromArray).to.have.entries([['a', 'a'], ['b', 'b'], ['c', 'c']]);
    });

    it('should not be callable without "new"', function () {
      expect(Set).to['throw'](TypeError);
    });

    it('should be subclassable', function () {
      if (!Object.setPrototypeOf) { return; } // skip test if on IE < 11
      var MySet = function MySet() {
        var actualSet = new Set(['a', 'b']);
        Object.setPrototypeOf(actualSet, MySet.prototype);
        return actualSet;
      };
      Object.setPrototypeOf(MySet, Set);
      MySet.prototype = Object.create(Set.prototype, {
        constructor: { value: MySet }
      });

      var mySet = new MySet();
      testSet(mySet, 'c');
      testSet(mySet, 'd');
      expect(mySet).to.have.entries([['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd']]);
    });

    it('should has valid getter and setter calls', function () {
      ['add', 'has', 'delete'].forEach(function (method) {
        expect(function () {
          set[method]({});
        }).to.not['throw']();
      });
    });

    it('uses SameValueZero even on a Set of size > 4', function () {
      var firstFour = [1, 2, 3, 4];
      var fourSet = new Set(firstFour);
      expect(fourSet.size).to.equal(4);
      expect(fourSet.has(-0)).to.equal(false);
      expect(fourSet.has(0)).to.equal(false);

      fourSet.add(-0);

      expect(fourSet.size).to.equal(5);
      expect(fourSet.has(0)).to.equal(true);
      expect(fourSet.has(-0)).to.equal(true);
    });

    it('should work as expected', function () {
      // Run this test twice, one with the "fast" implementation (which only
      // allows string and numeric keys) and once with the "slow" impl.
      [true, false].forEach(function (slowkeys) {
        set = new Set();

        range(1, 20).forEach(function (number) {
          if (slowkeys) { testSet(set, {}); }
          testSet(set, number);
          testSet(set, number / 100);
          testSet(set, 'key-' + number);
          testSet(set, String(number));
          if (slowkeys) { testSet(set, Object(String(number))); }
        });

        var testkeys = [+0, Infinity, -Infinity, NaN];
        if (slowkeys) {
          testkeys.push(true, false, null, undefined);
        }
        testkeys.forEach(function (number) {
          testSet(set, number);
          testSet(set, String(number));
        });
        testSet(set, '');

        // -0 and +0 should be the same key (Set uses SameValueZero)
        expect(set.has(-0)).to.equal(true);
        expect(set['delete'](+0)).to.equal(true);
        testSet(set, -0);
        expect(set.has(+0)).to.equal(true);

        // verify that properties of Object don't peek through.
        [
          'hasOwnProperty',
          'constructor',
          'toString',
          'isPrototypeOf',
          '__proto__',
          '__parent__',
          '__count__'
        ].forEach(function (prop) { testSet(set, prop); });
      });
    });

    describe('#size', function () {
      it('returns the expected size', function () {
        expect(set.add(1)).to.equal(set);
        expect(set.add(5)).to.equal(set);
        expect(set.size).to.equal(2);
      });
    });

    describe('#clear()', function () {
      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.clear).to.have.property('name', 'clear');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('clear').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.clear).to.have.property('length', 0);
      });

      it('should have #clear method', function () {
        expect(set.add(1)).to.equal(set);
        expect(set.add(5)).to.equal(set);
        expect(set.size).to.equal(2);
        expect(set.has(5)).to.equal(true);
        set.clear();
        expect(set.size).to.equal(0);
        expect(set.has(5)).to.equal(false);
      });
    });

    describe('#keys()', function () {
      if (!Set.prototype.hasOwnProperty('keys')) {
        return it('exists', function () {
          expect(Set.prototype).to.have.property('keys');
        });
      }

      it('is the same object as #values()', function () {
        expect(Set.prototype.keys).to.equal(Set.prototype.values);
      });

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.keys).to.have.property('name', 'values');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('keys').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.keys).to.have.property('length', 0);
      });
    });

    describe('#values()', function () {
      if (!Set.prototype.hasOwnProperty('values')) {
        return it('exists', function () {
          expect(Set.prototype).to.have.property('values');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.values).to.have.property('name', 'values');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('values').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.values).to.have.property('length', 0);
      });

      it('throws when called on a non-Set', function () {
        var expectedMessage = /^(Method )?Set.prototype.values called on incompatible receiver |^values method called on incompatible |^Cannot create a Set value iterator for a non-Set object.$|^Set.prototype.values: 'this' is not a Set object$/;
        var nonSets = [true, false, 'abc', NaN, new Map([[1, 2]]), { a: true }, [1], Object('abc'), Object(NaN)];
        nonSets.forEach(function (nonSet) {
          expect(function () { return Set.prototype.values.call(nonSet); }).to['throw'](TypeError, expectedMessage);
        });
      });
    });

    describe('#entries()', function () {
      if (!Set.prototype.hasOwnProperty('entries')) {
        return it('exists', function () {
          expect(Set.prototype).to.have.property('entries');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.entries).to.have.property('name', 'entries');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('entries').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.entries).to.have.property('length', 0);
      });
    });

    describe('#has()', function () {
      if (!Set.prototype.hasOwnProperty('has')) {
        return it('exists', function () {
          expect(Set.prototype).to.have.property('has');
        });
      }

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.has).to.have.property('name', 'has');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('has').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.has).to.have.property('length', 1);
      });
    });

    it('should allow NaN values as keys', function () {
      expect(set.has(NaN)).to.equal(false);
      expect(set.has(NaN + 1)).to.equal(false);
      expect(set.has(23)).to.equal(false);
      expect(set.add(NaN)).to.equal(set);
      expect(set.has(NaN)).to.equal(true);
      expect(set.has(NaN + 1)).to.equal(true);
      expect(set.has(23)).to.equal(false);
    });

    it('should not have [[Enumerable]] props', function () {
      expectNotEnumerable(Set);
      expectNotEnumerable(Set.prototype);
      expectNotEnumerable(new Set());
    });

    it('should not have an own constructor', function () {
      var s = new Set();
      expect(s).not.to.haveOwnPropertyDescriptor('constructor');
      expect(s.constructor).to.equal(Set);
    });

    it('should allow common ecmascript idioms', function () {
      expect(set instanceof Set).to.equal(true);
      expect(typeof Set.prototype.add).to.equal('function');
      expect(typeof Set.prototype.has).to.equal('function');
      expect(typeof Set.prototype['delete']).to.equal('function');
    });

    it('should have a unique constructor', function () {
      expect(Set.prototype).to.not.equal(Object.prototype);
    });

    describe('has an iterator that works with Array.from', function () {
      if (!Array.hasOwnProperty('from')) {
        return it('requires Array.from to exist', function () {
          expect(Array).to.have.property('from');
        });
      }

      var setToIterate;
      beforeEach(function () {
        setToIterate = new Set([1, NaN, false, true, null, undefined, 'a']);
      });

      afterEach(function () {
        setToIterate = null;
      });

      it('works with the full set', function () {
        expect(Array.from(setToIterate)).to.eql([1, NaN, false, true, null, undefined, 'a']);
      });

      it('works with Set#keys()', function () {
        expect(Array.from(setToIterate.keys())).to.eql(Array.from(setToIterate));
      });

      it('works with Set#values()', function () {
        expect(Array.from(setToIterate.values())).to.eql(Array.from(setToIterate));
      });

      it('works with Set#entries()', function () {
        expect(Array.from(setToIterate.entries())).to.eql([
          [1, 1],
          [NaN, NaN],
          [false, false],
          [true, true],
          [null, null],
          [undefined, undefined],
          ['a', 'a']
        ]);
      });
    });

    ifSymbolIteratorIt('has the right default iteration function', function () {
      // fixed in Webkit https://bugs.webkit.org/show_bug.cgi?id=143838
      expect(Set.prototype).to.have.property(Sym.iterator, Set.prototype.values);
    });

    it('should preserve insertion order', function () {
      var arr1 = ['d', 'a', 'b'];
      var arr2 = [3, 2, 'z', 'a', 1];
      var arr3 = [3, 2, 'z', {}, 'a', 1];

      var makeEntries = function (n) { return [n, n]; };
      [arr1, arr2, arr3].forEach(function (array) {
        var entries = array.map(makeEntries);
        expect(new Set(array)).to.have.entries(entries);
      });
    });

    describe('#forEach', function () {
      var setToIterate;
      beforeEach(function () {
        setToIterate = new Set();
        expect(setToIterate.add('a')).to.equal(setToIterate);
        expect(setToIterate.add('b')).to.equal(setToIterate);
        expect(setToIterate.add('c')).to.equal(setToIterate);
      });

      afterEach(function () {
        setToIterate = null;
      });

      ifFunctionsHaveNamesIt('has the right name', function () {
        expect(Set.prototype.forEach).to.have.property('name', 'forEach');
      });

      it('is not enumerable', function () {
        expect(Set.prototype).ownPropertyDescriptor('forEach').to.have.property('enumerable', false);
      });

      it('has the right arity', function () {
        expect(Set.prototype.forEach).to.have.property('length', 1);
      });

      it('should be iterable via forEach', function () {
        var expectedSet = ['a', 'b', 'c'];
        var foundSet = [];
        setToIterate.forEach(function (value, alsoValue, entireSet) {
          expect(entireSet).to.equal(setToIterate);
          expect(value).to.equal(alsoValue);
          foundSet.push(value);
        });
        expect(foundSet).to.eql(expectedSet);
      });

      it('should iterate over empty keys', function () {
        var setWithEmptyKeys = new Set();
        var expectedKeys = [{}, null, undefined, '', NaN, 0];
        expectedKeys.forEach(function (key) {
          expect(setWithEmptyKeys.add(key)).to.equal(setWithEmptyKeys);
        });
        var foundKeys = [];
        setWithEmptyKeys.forEach(function (value, key, entireSet) {
          expect([key]).to.be.theSameSet([value]); // handles NaN correctly
          expect(entireSet.has(key)).to.equal(true);
          foundKeys.push(key);
        });
        expect(foundKeys).to.be.theSameSet(expectedKeys);
      });

      it('should support the thisArg', function () {
        var context = function () {};
        setToIterate.forEach(function () {
          expect(this).to.equal(context);
        }, context);
      });

      it('should have a length of 1', function () {
        expect(Set.prototype.forEach.length).to.equal(1);
      });

      it('should not revisit modified keys', function () {
        var hasModifiedA = false;
        setToIterate.forEach(function (value, key) {
          if (!hasModifiedA && key === 'a') {
            expect(setToIterate.add('a')).to.equal(setToIterate);
            hasModifiedA = true;
          } else {
            expect(key).not.to.equal('a');
          }
        });
      });

      it('visits keys added in the iterator', function () {
        var hasAdded = false;
        var hasFoundD = false;
        setToIterate.forEach(function (value, key) {
          if (!hasAdded) {
            expect(setToIterate.add('d')).to.equal(setToIterate);
            hasAdded = true;
          } else if (key === 'd') {
            hasFoundD = true;
          }
        });
        expect(hasFoundD).to.equal(true);
      });

      it('visits keys added in the iterator when there is a deletion (slow path)', function () {
        var hasSeenFour = false;
        var setToMutate = new Set();
        expect(setToMutate.add({})).to.equal(setToMutate); // force use of the slow O(N) implementation
        expect(setToMutate.add('0')).to.equal(setToMutate);
        setToMutate.forEach(function (value, key) {
          if (key === '0') {
            expect(setToMutate['delete']('0')).to.equal(true);
            expect(setToMutate.add('4')).to.equal(setToMutate);
          } else if (key === '4') {
            hasSeenFour = true;
          }
        });
        expect(hasSeenFour).to.equal(true);
      });

      it('visits keys added in the iterator when there is a deletion (fast path)', function () {
        var hasSeenFour = false;
        var setToMutate = new Set();
        expect(setToMutate.add('0')).to.equal(setToMutate);
        setToMutate.forEach(function (value, key) {
          if (key === '0') {
            expect(setToMutate['delete']('0')).to.equal(true);
            expect(setToMutate.add('4')).to.equal(setToMutate);
          } else if (key === '4') {
            hasSeenFour = true;
          }
        });
        expect(hasSeenFour).to.equal(true);
      });

      it('does not visit keys deleted before a visit', function () {
        var hasVisitedC = false;
        var hasDeletedC = false;
        setToIterate.forEach(function (value, key) {
          if (key === 'c') {
            hasVisitedC = true;
          }
          if (!hasVisitedC && !hasDeletedC) {
            hasDeletedC = setToIterate['delete']('c');
            expect(hasDeletedC).to.equal(true);
          }
        });
        expect(hasVisitedC).to.equal(false);
      });

      it('should work after deletion of the current key', function () {
        var expectedSet = {
          a: 'a',
          b: 'b',
          c: 'c'
        };
        var foundSet = {};
        setToIterate.forEach(function (value, key) {
          foundSet[key] = value;
          expect(setToIterate['delete'](key)).to.equal(true);
        });
        expect(foundSet).to.eql(expectedSet);
      });

      it('should convert key -0 to +0', function () {
        var zeroSet = new Set();
        var result = [];
        expect(zeroSet.add(-0)).to.equal(zeroSet);
        zeroSet.forEach(function (key) {
          result.push(String(1 / key));
        });
        expect(zeroSet.add(1)).to.equal(zeroSet);
        expect(zeroSet.add(0)).to.equal(zeroSet); // shouldn't cause reordering
        zeroSet.forEach(function (key) {
          result.push(String(1 / key));
        });
        expect(result.join(', ')).to.equal(
          'Infinity, Infinity, 1'
        );
      });
    });

    it('Set.prototype.size should throw TypeError', function () {
      // see https://github.com/paulmillr/es6-shim/issues/176
      expect(function () { return Set.prototype.size; }).to['throw'](TypeError);
      expect(function () { return Set.prototype.size; }).to['throw'](TypeError);
    });

    it.skip('should throw proper errors when user invokes methods with wrong types of receiver', function () {

    });
  });
});
