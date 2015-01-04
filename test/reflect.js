/*global describe, it, expect, require, Reflect */

var exported = require('../');

describe('Reflect', function () {
  var object = {
    something: 1,
    _value: 0
  };

  Object.defineProperties(object, {
    value: {
      get: function () {
        return this._value;
      }
    },

    setter: {
      set: function (val) {
        this._value = val;
      }
    },

    bool: {
      value: true
    }
  });

  it('is on the exported object', function () {
    expect(exported.Reflect).to.equal(Reflect);
  });

  describe('Reflect.apply()', function () {
    it('is a function', function () {
      expect(typeof Reflect.apply).to.equal('function');
    });

    expect(Reflect.apply(Array.prototype.push, [1, 2], [3, 4, 5])).to.equal(5);
  });

  describe('Reflect.construct()', function () {
    it('is a function', function () {
      expect(typeof Reflect.construct).to.equal('function');
    });

    expect(Reflect.construct(function (a, b, c) {
      this.qux = a + b + c;
    }, ['foo', 'bar', 'baz']).qux).to.equal('foobarbaz');
  });

  describe('Reflect.get()', function () {
    it('is a function', function () {
      expect(typeof Reflect.get).to.equal('function');
    });

    it('throws on null and undefined', function () {
      [null, undefined].forEach(function (item) {
        expect(function () {
          return Reflect.get(item, 'property');
        }).to['throw'](TypeError);
      });
    });

    it('can retrieve a simple value, from the target', function () {
      var p = { something: 2, bool: false };

      expect(Reflect.get(object, 'something')).to.equal(1);
      // p has no effect
      expect(Reflect.get(object, 'something', p)).to.equal(1);

      // Value-defined properties take the target's value,
      // and ignore that of the receiver.
      expect(Reflect.get(object, 'bool', p)).to.equal(true);

      // Undefined values
      expect(Reflect.get(object, 'undefined_property')).to.equal(undefined);
    });

    it('will invoke getters on the receiver rather than target', function () {
      var other = { _value: 1337 };

      expect(Reflect.get(object, 'value', other)).to.equal(1337);

      // No getter for setter property
      expect(Reflect.get(object, 'setter', other)).to.equal(undefined);
    });

    it('will search the prototype chain', function () {
      var other = Object.create(object);
      other._value = 17;

      var yet_another = { _value: 4711 };

      expect(Reflect.get(other, 'value', yet_another)).to.equal(4711);

      expect(Reflect.get(other, 'bool', yet_another)).to.equal(true);
    });
  });

  describe('Reflect.set()', function () {
    it('is a function', function () {
      expect(typeof Reflect.set).to.equal('function');
    });

    it('throws on null and undefined', function () {
      [null, undefined].forEach(function (item) {
        expect(function () {
          return Reflect.set(item, 'property', 'value');
        }).to['throw'](TypeError);
      });
    });
  });

  describe('Reflect.has()', function () {
    it('is a function', function () {
      expect(typeof Reflect.has).to.equal('function');
    });

    it('throws on primitives', function () {
      [null, undefined, 1, 'string', true].forEach(function (item) {
        expect(function () {
          return Reflect.has(item, 'property', 'value');
        }).to['throw'](TypeError);
      });
    });

    it('will detect own properties', function () {
      var target = Object.create(null);

      expect(Reflect.has(target, 'prop')).to.equal(false);

      target.prop = undefined;
      expect(Reflect.has(target, 'prop')).to.equal(true);

      delete target.prop;
      expect(Reflect.has(target, 'prop')).to.equal(false);

      Object.defineProperty(target, 'accessor', {
        set: function () {}
      });

      expect(Reflect.has(target, 'accessor')).to.equal(true);

      expect(Reflect.has(Reflect.has, 'length')).to.equal(true);
    });

    it('will search the prototype chain', function () {
      var intermediate = Object.create(object),
        target = Object.create(intermediate);

      intermediate.some_property = undefined;

      expect(Reflect.has(target, 'bool')).to.equal(true);
      expect(Reflect.has(target, 'some_property')).to.equal(true);
      expect(Reflect.has(target, 'undefined_property')).to.equal(false);
    });
  });

  describe('Reflect.deleteProperty()', function () {
    it('is a function', function () {
      expect(typeof Reflect.deleteProperty).to.equal('function');
    });

    it('returns true for success and false for failure', function () {
      var o = { a: 1 };

      Object.defineProperty(o, 'b', { value: 2 });

      expect(o).to.have.property('a');
      expect(o).to.have.property('b');
      expect(o.a).to.equal(1);
      expect(o.b).to.equal(2);

      expect(Reflect.deleteProperty(o, 'a')).to.equal(true);

      expect(o).not.to.have.property('a');
      expect(o.b).to.equal(2);

      expect(Reflect.deleteProperty(o, 'b')).to.equal(false);

      expect(o).to.have.property('b');
      expect(o.b).to.equal(2);

      expect(Reflect.deleteProperty(o, 'a')).to.equal(true);
    });

    it('cannot delete a function\'s name property', function () {
      expect(Reflect.deleteProperty(function a() {}, 'name')).to.equal(false);
    });
  });

  describe('Reflect.getOwnPropertyDescriptor()', function () {
    it('is a function', function () {
      expect(typeof Reflect.getOwnPropertyDescriptor).to.equal('function');
    });

  });

  describe('Reflect.defineProperty()', function () {
    it('is a function', function () {
      expect(typeof Reflect.defineProperty).to.equal('function');
    });

  });

  describe('Reflect.getPrototypeOf()', function () {
    it('is a function', function () {
      expect(typeof Reflect.getPrototypeOf).to.equal('function');
    });

    it('is the same as Object.getPrototypeOf()', function () {
      expect(Reflect.getPrototypeOf).to.equal(Object.getPrototypeOf);
    });

    it('can get prototypes', function () {

    });
  });

  describe('Reflect.setPrototypeOf()', function () {
    it('is a function', function () {
      expect(typeof Reflect.setPrototypeOf).to.equal('function');
    });

    it('is the same as Object.setPrototypeOf()', function () {
      expect(Reflect.setPrototypeOf).to.equal(Object.setPrototypeOf);
    });

    it('can set prototypes', function () {
      var obj = {};
      Reflect.setPrototypeOf(obj, Array.prototype);
      expect(obj).to.be.an.instanceOf(Array);

      expect(obj.toString).not.to.equal(undefined);
      Reflect.setPrototypeOf(obj, null);
      expect(obj.toString).to.equal(undefined);
    });
  });

  describe('Reflect.isExtensible()', function () {
    it('is a function', function () {
      expect(typeof Reflect.isExtensible).to.equal('function');
    });

    it('is the same as Object.isExtensible()', function () {
      expect(Reflect.isExtensible).to.equal(Object.isExtensible);
    });

    it('returns true for plain objects', function () {
      expect(Reflect.isExtensible({})).to.equal(true);
      expect(Reflect.isExtensible(Object.preventExtensions({}))).to.equal(false);
    });
  });

  describe('Reflect.preventExtensions()', function () {
    it('is a function', function () {
      expect(typeof Reflect.preventExtensions).to.equal('function');
    });

    it('is the same as Object.preventExtensions()', function () {
      expect(Reflect.preventExtensions).to.equal(Object.preventExtensions);
    });

    it('prevents extensions on objects', function () {
      var obj = {};
      Reflect.preventExtensions(obj);
      expect(Object.isExtensible(obj)).to.equal(false);
    });
  });

  describe('Reflect.enumerate()', function () {
    it('is a function', function () {
      expect(typeof Reflect.enumerate).to.equal('function');
    });

    it('only includes enumerable properties', function () {
      var a = Object.create(null, {
        // Non-enumerable per default.
        a: { value: 1 }
      });

      a.b = 2;

      expect(Array.from(Reflect.enumerate(a))).to.deep.equal(['b']);
    });

    it('includes all enumerable properties of prototypes', function () {
      var a = { prop: true };
      var b = Object.create(a);

      expect(Array.from(Reflect.enumerate(b))).to.deep.equal(['prop']);
    });

    it('yields keys determined at first next() call', function () {
      var obj = { a: 1, b: 2 },
        iter = Reflect.enumerate(obj);

      expect(iter.next()).to.deep.equal({ value: 'a', done: false });

      obj.c = 3;
      expect(iter.next()).to.deep.equal({ value: 'b', done: false });
      expect(iter.next()).to.deep.equal({ value: undefined, done: true });

      obj = { a: 1, b: 2 };
      iter = Reflect.enumerate(obj);

      obj.c = 3;
      expect(iter.next()).to.deep.equal({ value: 'a', done: false });
      expect(iter.next()).to.deep.equal({ value: 'b', done: false });
      expect(iter.next()).to.deep.equal({ value: 'c', done: false });
      expect(iter.next()).to.deep.equal({ value: undefined, done: true });

      obj = { a: 1, b: 2 };
      iter = Reflect.enumerate(obj);

      expect(iter.next()).to.deep.equal({ value: 'a', done: false });
      delete obj.b;
      expect(iter.next()).to.deep.equal({ value: undefined, done: true });
    });
  });

  describe('Reflect.ownKeys()', function () {
    it('is a function', function () {
      expect(typeof Reflect.ownKeys).to.equal('function');
    });

    it('should return the same result as Object.keys()', function () {
      var obj = { foo: 1, bar: 2};

      expect(Reflect.ownKeys(obj)).to.deep.equal(Object.keys(obj));
    });
  });
});
