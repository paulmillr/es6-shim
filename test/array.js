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
  });

  describe('Array.of()', function() {
    it('should create correct array from arguments', function() {
      expect(Array.of(1, null, void 0)).to.eql([1, null, void 0]);
    });
  });

  describe('Array#find', function() {
    it('should find item by predicate', function() {
      var result = list.find(function(item) {return item === 15;});
      expect(result).to.equal(15);
    });

    it('should return undefined when nothing matched', function() {
      var result = list.find(function(item) {return item === 'a';});
      expect(result).to.equal(undefined);
    });

    it('should throw TypeError when function was not passed', function() {
      expect(function() {list.find();}).to.throw(TypeError);
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
  });

  describe('Array#findIndex', function() {
    it('should find item key by predicate', function() {
      var result = list.findIndex(function(item) {return item === 15;});
      expect(result).to.equal(2);
    });

    it('should return -1 when nothing matched', function() {
      var result = list.findIndex(function(item) {return item === 'a';});
      expect(result).to.equal(-1);
    });

    it('should throw TypeError when function was not passed', function() {
      expect(function() {list.findIndex();}).to.throw(TypeError);
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
  });
});

