/*global describe, it, expect, require, Reflect */

var exported = require('../');

describe('Reflect', function () {
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

      var iter = Reflect.enumerate(a);

      expect(iter.next()).to.deep.equal({
        value: 'b',
        done: false
      });

      expect(iter.next()).to.deep.equal({
        value: undefined,
        done: true
      });
    });

    it('includes all enumerable properties of prototypes', function () {
      var a = { prop: true };
      var b = Object.create(a);

      var iter = Reflect.enumerate(b);

      expect(iter.next()).to.deep.equal({
        value: 'prop',
        done: false
      });

      expect(iter.next()).to.deep.equal({
        value: undefined,
        done: true
      });
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
