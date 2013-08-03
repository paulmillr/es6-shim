describe('Array', function() {
  var list = [5, 10, 15, 20];

  describe('Array.from()', function() {
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
  });

  describe('Array.of()', function() {
    it('should create correct array from arguments', function() {
      expect(Array.of(1, null, undefined)).to.eql([1, null, undefined]);
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

  describe('Array#keys', function() {
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
  });

  describe('Array#values', function() {
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
  });

  describe('Array#entries', function() {
    var entries = list.entries();
    it('should return [0, 5] on first object', function() {
      var val = entries.next();
      expect(val[0]).to.equal(0);
      expect(val[1]).to.equal(5);
    });
    it('should return [1, 10] on first object', function() {
      var val = entries.next();
      expect(val[0]).to.equal(1);
      expect(val[1]).to.equal(10);
    });
    it('should return [2, 15] on first object', function() {
      var val = entries.next();
      expect(val[0]).to.equal(2);
      expect(val[1]).to.equal(15);
    });
    it('should return [3, 20] on first object', function() {
      var val = entries.next();
      expect(val[0]).to.equal(3);
      expect(val[1]).to.equal(20);
    });
    it('should throw Error on completing iteration', function() {
      expect(function() { entries.next(); }).to.throw(Error);
    });
  });
});
