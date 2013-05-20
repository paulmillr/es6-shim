describe('Object', function() {
  describe('Object.is()', function() {
    it('should compare regular objects correctly', function() {
      [null, void 0, [0], 5, 'str', {a: null}].map(function(item) {
        return Object.is(item, item)
      }).forEach(function(result) {
        expect(result).to.be.ok;
      });
    });

    it('should compare 0 and -0 correctly', function() {
      expect(Object.is(0, -0)).to.not.be.ok;
    });

    it('should compare NaNs correctly', function() {
      expect(Object.is(NaN, NaN)).to.be.ok;
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
      expect(Object.getPropertyNames(Object.create(null))).to.eql([]);
      var obj = {};
      expect(Object.getPropertyNames(Object.create(obj))).to.eql(
        Object.getOwnPropertyNames(obj).concat(
          Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
        )
      );
    });
  });

  describe('Object.assign()', function() {
    it('should merge two objects', function() {
      expect(Object.assign({a: 1}, {b: 2})).to.eql({a: 1, b: 2});
    });
  });

  describe('Object.mixin()', function() {
    it('should merge descriptors of two objects', function() {
      expect(Object.mixin({a: 1}, {b: 2})).to.eql({a: 1, b: 2});
    });
  });

  describe('Object.setPrototypeOf()', function() {
    describe('argument checking', function() {
      it('should throw TypeError if first arg is not object', function() {
        var nonObjects = [null, true, false, 1, 3, 'foo'];
        nonObjects.forEach(function(value) {
          expect(function() { Object.setPrototypeOf(value); }).to.throw(TypeError);
        });
      });

      it('should throw TypeError if second arg is not object or null', function() {
        expect(function() { Object.setPrototypeOf({}, null); }).not.to.throw(TypeError);
        var invalidPrototypes = [true, false, 1, 3, 'foo'];
        invalidPrototypes.forEach(function(proto) {
          expect(function() { Object.setPrototypeOf({}, proto); }).to.throw(TypeError);
        });
      });
    });

    describe('set prototype', function() {
      var Foo = function() {};
      var Bar = {};
      var foo = new Foo();
      expect(Object.getPrototypeOf(foo)).to.equal(Foo.prototype);

      var fooBar = Object.setPrototypeOf(foo, Bar);
      expect(fooBar).to.equal(foo);
      expect(Object.getPrototypeOf(foo)).to.equal(Bar);

      var fooNull = Object.setPrototypeOf(foo, null);
      expect(fooNull).to.equal(foo);
      expect(Object.getPrototypeOf(foo)).to.equal(null);
    });
  });
});
