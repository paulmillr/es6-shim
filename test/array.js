describe('Array', function() {
  var list = [5, 10, 15, 20];

  describe('Array.from()', function() {
    it('has a length of 1', function() {
      expect(Array.from.length).to.equal(1);
    });

    it('should create correct array from iterable', function() {
      (function() {
        expect(Array.from(arguments)).to.eql([0, 1, 2]);
      })(0, 1, 2);

      expect(Array.from([null, undefined, 0.1248, -0, 0])).to.eql(
        [null, undefined, 0.1248, -0, 0]
      );
    });

    it('should handle empty iterables correctly', function() {
      (function() {
        expect(Array.from(arguments)).to.eql([]);
      })();
    });

    it('should work with other constructors', function() {
      var Foo = function (length, args) {
        this.length = length;
      };
      var args = ['a', 'b', 'c'];
      var expected = new Foo(args.length);
      args.forEach(function (arg, index) {
        expected[index] = arg;
      });
      expect(Array.from.call(Foo, args)).to.eql(expected);
    });

    it('supports a map function', function() {
      var original = [1, 2, 3];
      var mapper = function (item) {
        return item * 2;
      };
      var mapped = Array.from(original, mapper);
      expect(mapped).to.eql([2, 4, 6]);
    });

    it('throws when provided a nonfunction second arg', function() {
      expect(function () { Array.from([], false); }).to.throw(TypeError);
      expect(function () { Array.from([], true); }).to.throw(TypeError);
      expect(function () { Array.from([], /a/g); }).to.throw(TypeError);
      expect(function () { Array.from([], {}); }).to.throw(TypeError);
      expect(function () { Array.from([], []); }).to.throw(TypeError);
      expect(function () { Array.from([], ''); }).to.throw(TypeError);
      expect(function () { Array.from([], 3); }).to.throw(TypeError);
    });

    it('supports a this arg', function() {
      var original = [1, 2, 3];
      var context = {};
      var mapper = function (item) {
        expect(this).to.equal(context);
        return item * 2;
      };
      var mapped = Array.from(original, mapper, context);
      expect(mapped).to.eql([2, 4, 6]);
    });
  });

  describe('Array.of()', function() {
    it('should create correct array from arguments', function() {
      expect(Array.of(1, null, undefined)).to.eql([1, null, undefined]);
    });
  });

  describe('Array#copyWithin', function() {
    it('has the right arity', function() {
      expect(Array.prototype.copyWithin.length).to.equal(2);
    });

    it('works with 2 args', function() {
      expect([1, 2, 3, 4, 5].copyWithin(0, 3)).to.eql([4, 5, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(1, 3)).to.eql([1, 4, 5, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(1, 2)).to.eql([1, 3, 4, 5, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(2, 2)).to.eql([1, 2, 3, 4, 5]);
    });

    it('works with 3 args', function() {
      expect([1, 2, 3, 4, 5].copyWithin(0, 3, 4)).to.eql([4, 2, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(1, 3, 4)).to.eql([1, 4, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(1, 2, 4)).to.eql([1, 3, 4, 4, 5]);
    });

    it('works with negative args', function() {
      expect([1, 2, 3, 4, 5].copyWithin(0, -2)).to.eql([4, 5, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(0, -2, -1)).to.eql([4, 2, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(-4, -3, -2)).to.eql([1, 3, 3, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(-4, -3, -1)).to.eql([1, 3, 4, 4, 5]);
      expect([1, 2, 3, 4, 5].copyWithin(-4, -3)).to.eql([1, 3, 4, 5, 5]);
    });

    it('works with arraylike objects', function() {
      var args = (function () { return arguments; }(1, 2, 3));
      expect(Array.isArray(args)).not.to.be.ok;
      var argsClass = Object.prototype.toString.call(args);
      expect(Array.prototype.slice.call(args)).to.eql([1, 2, 3]);
      Array.prototype.copyWithin.call(args, -2, 0);
      expect(Array.prototype.slice.call(args)).to.eql([1, 1, 2]);
      expect(Object.prototype.toString.call(args)).to.equal(argsClass);
    });
  });

  describe('Array#find', function() {
    it('should have a length of 1', function() {
      expect(Array.prototype.find.length).to.equal(1);
    });

    it('should find item by predicate', function() {
      var result = list.find(function(item) { return item === 15; });
      expect(result).to.equal(15);
    });

    it('should return undefined when nothing matched', function() {
      var result = list.find(function(item) { return item === 'a'; });
      expect(result).to.equal(undefined);
    });

    it('should throw TypeError when function was not passed', function() {
      expect(function() { list.find(); }).to.throw(TypeError);
    });

    it('should receive all three parameters', function() {
      var index = list.find(function(value, index, arr) {
        expect(list[index]).to.equal(value);
        expect(list).to.eql(arr);
        return false;
      });
      expect(index).to.equal(undefined);
    });

    it('should work with the context argument', function() {
      var context = {};
      [1].find(function() { expect(this).to.equal(context); }, context);
    });

    it('should work with an array-like object', function() {
      var obj = { '0': 1, '1': 2, '2': 3, length: 3 };
      var found = Array.prototype.find.call(obj, function(item) { return item === 2; });
      expect(found).to.equal(2);
    });
  });

  describe('Array#findIndex', function() {
    it('should have a length of 1', function() {
      expect(Array.prototype.findIndex.length).to.equal(1);
    });

    it('should find item key by predicate', function() {
      var result = list.findIndex(function(item) { return item === 15; });
      expect(result).to.equal(2);
    });

    it('should return -1 when nothing matched', function() {
      var result = list.findIndex(function(item) { return item === 'a'; });
      expect(result).to.equal(-1);
    });

    it('should throw TypeError when function was not passed', function() {
      expect(function() { list.findIndex(); }).to.throw(TypeError);
    });

    it('should receive all three parameters', function() {
      var index = list.findIndex(function(value, index, arr) {
        expect(list[index]).to.equal(value);
        expect(list).to.eql(arr);
        return false;
      });
      expect(index).to.equal(-1);
    });

    it('should work with the context argument', function() {
      var context = {};
      [1].findIndex(function() { expect(this).to.equal(context); }, context);
    });

    it('should work with an array-like object', function() {
      var obj = { '0': 1, '1': 2, '2': 3, length: 3 };
      var foundIndex = Array.prototype.findIndex.call(obj, function(item) { return item === 2; });
      expect(foundIndex).to.equal(1);
    });
  });

  describe('ArrayIterator', function() {
    var arrayIterator = [1, 2, 3].values();

    describe('ArrayIterator#next', function() {
      it('should work when applied to an ArrayIterator', function() {
        expect(arrayIterator.next.apply(arrayIterator)).to.equal(1);
        expect(arrayIterator.next.apply(arrayIterator)).to.equal(2);
        expect(arrayIterator.next.apply(arrayIterator)).to.equal(3);
        expect(function () { arrayIterator.next.apply(arrayIterator); }).to.throw(Error);
      });

      it('throws when not applied to an ArrayIterator', function() {
        expect(function () { arrayIterator.next.apply({}); }).to.throw(TypeError);
      });
    });
  });

  describe('Array#keys', function() {
    it('should have a length of zero', function() {
      expect(Array.prototype.keys.length).to.equal(0);
    });

    var keys = list.keys();
    it('should return 0 on first object', function() {
      expect(keys.next()).to.equal(0);
    });
    it('should return 1 on first object', function() {
      expect(keys.next()).to.equal(1);
    });
    it('should return 2 on first object', function() {
      expect(keys.next()).to.equal(2);
    });
    it('should return 3 on first object', function() {
      expect(keys.next()).to.equal(3);
    });
    it('should throw Error on completing iteration', function() {
      expect(function() { keys.next(); }).to.throw(Error);
    });

    it('should skip sparse keys', function() {
      var sparse = [1];
      sparse[3] = 4;
      var keys = sparse.keys();
      expect(keys.next()).to.equal(0);
      expect(keys.next()).to.equal(3);
      expect(function() { keys.next(); }).to.throw(Error);
    });
  });

  describe('Array#values', function() {
    it('should have a length of zero', function() {
      expect(Array.prototype.values.length).to.equal(0);
    });

    var values = list.values();
    it('should return 5 on first object', function() {
      expect(values.next()).to.equal(5);
    });
    it('should return 10 on first object', function() {
      expect(values.next()).to.equal(10);
    });
    it('should return 15 on first object', function() {
      expect(values.next()).to.equal(15);
    });
    it('should return 20 on first object', function() {
      expect(values.next()).to.equal(20);
    });
    it('should throw Error on completing iteration', function() {
      expect(function() { values.next(); }).to.throw(Error);
    });

    it('should skip sparse values', function() {
      var sparse = [1];
      sparse[3] = 4;
      var values = sparse.values();
      expect(values.next()).to.equal(1);
      expect(values.next()).to.equal(4);
      expect(function() { values.next(); }).to.throw(Error);
    });
  });

  describe('Array#entries', function() {
    it('should have a length of zero', function() {
      expect(Array.prototype.entries.length).to.equal(0);
    });

    var entries = list.entries();
    it('should return [0, 5] on first object', function() {
      var val = entries.next();
      expect(val).to.eql([0, 5]);
    });
    it('should return [1, 10] on first object', function() {
      var val = entries.next();
      expect(val).to.eql([1, 10]);
    });
    it('should return [2, 15] on first object', function() {
      var val = entries.next();
      expect(val).to.eql([2, 15]);
    });
    it('should return [3, 20] on first object', function() {
      var val = entries.next();
      expect(val).to.eql([3, 20]);
    });
    it('should throw Error on completing iteration', function() {
      expect(function() { entries.next(); }).to.throw(Error);
    });

    it('should skip sparse entries', function() {
      var sparse = [1];
      sparse[3] = 4;
      var entries = sparse.entries();
      expect(entries.next()).to.eql([0, 1]);
      expect(entries.next()).to.eql([3, 4]);
      expect(function() { entries.next(); }).to.throw(Error);
    });
  });

  describe('Array#fill', function() {
    it('has the right length', function() {
      expect(Array.prototype.fill.length).to.equal(1);
    });

    it('works with just a value', function() {
      var original = [1, 2, 3, 4, 5, 6];
      var filled = [-1, -1, -1, -1, -1, -1];

      expect(original.fill(-1)).to.eql(filled);
    });

    it('accepts a positive start index', function() {
      var original = [1, 2, 3, 4, 5, 6];
      var filled = [1, 2, 3, -1, -1, -1];

      expect(original.fill(-1, 3)).to.eql(filled);
    });

    it('accepts a negative start index', function() {
      var original = [1, 2, 3, 4, 5, 6];
      var filled = [1, 2, 3, -1, -1, -1];

      expect(original.fill(-1, -3)).to.eql(filled);
    });

    it('accepts a large start index', function() {
      var original = [1, 2, 3, 4, 5, 6];
      var filled = [1, 2, 3, 4, 5, 6];

      expect(original.fill(-1, 9)).to.eql(filled);
    });
  });
});
