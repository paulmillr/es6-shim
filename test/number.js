/* global describe, it, expect, require */

describe('Number', function () {
  var functionsHaveNames = (function foo() {}).name === 'foo';
  var ifFunctionsHaveNamesIt = functionsHaveNames ? it : xit;

  var integers = [5295, -5295, -9007199254740991, 9007199254740991, 0, -0];
  var nonIntegers = [-9007199254741992, 9007199254741992, 5.9];
  var infinities = [Infinity, -Infinity];

  var valueOfThree = { valueOf: function () { return 3; } };
  var valueOfNaN = { valueOf: function () { return NaN; } };
  var valueOfThrows = { valueOf: function () { throw Object(17); } };
  var toStringThrows = { toString: function () { throw Object(42); } };
  var toPrimitiveThrows = {
    valueOf: function () { throw Object(17); },
    toString: function () { throw Object(42); }
  };

  var nonNumbers = [
    undefined,
    true,
    false,
    null,
    {},
    [],
    'str',
    '',
    valueOfThree,
    valueOfNaN,
    valueOfThrows,
    toStringThrows,
    toPrimitiveThrows,
    /a/g
  ];
  var expectTrue = function (item) {
    expect(item).to.equal(true);
  };
  var expectFalse = function (item) {
    expect(item).to.equal(false);
  };

  (typeof process !== 'undefined' && process.env.NO_ES6_SHIM ? it.skip : it)('is on the exported object', function () {
    var exported = require('../');
    expect(exported.Number).to.equal(Number);
  });

  describe('Number constants', function () {
    it('should have max safe integer', function () {
      expect(Number).to.have.property('MAX_SAFE_INTEGER');
      expect(Number.propertyIsEnumerable('MAX_SAFE_INTEGER')).to.equal(false);
      expect(Number.MAX_SAFE_INTEGER).to.equal(Math.pow(2, 53) - 1);
    });

    it('should have min safe integer', function () {
      expect(Number).to.have.property('MIN_SAFE_INTEGER');
      expect(Number.propertyIsEnumerable('MIN_SAFE_INTEGER')).to.equal(false);
      expect(Number.MIN_SAFE_INTEGER).to.equal(-Math.pow(2, 53) + 1);
    });

    it('should have epsilon', function () {
      expect(Number).to.have.property('EPSILON');
      expect(Number.propertyIsEnumerable('EPSILON')).to.equal(false);
      expect(Number.EPSILON).to.equal(2.2204460492503130808472633361816e-16);
    });
  });

  describe('.parseInt()', function () {
    if (!Number.hasOwnProperty('parseInt')) {
      return it('exists', function () {
        expect(Number).to.have.property('parseInt');
      });
    }

    it('should work', function () {
      expect(Number.parseInt('601')).to.equal(601);
    });

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.parseInt).to.have.property('name', 'parseInt');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('parseInt').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      // WebKit nightly had the wrong length; fixed in https://bugs.webkit.org/show_bug.cgi?id=143657
      expect(Number.parseInt).to.have.property('length', 2);
    });

    it('is the same object as the global parseInt', function () {
      // fixed in WebKit nightly in https://bugs.webkit.org/show_bug.cgi?id=143799#add_comment
      expect(Number.parseInt).to.equal(parseInt);
    });
  });

  describe('.parseFloat()', function () {
    if (!Number.hasOwnProperty('parseFloat')) {
      return it('exists', function () {
        expect(Number).to.have.property('parseFloat');
      });
    }

    it('should work', function () {
      expect(Number.parseFloat('5.5')).to.equal(5.5);
    });

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.parseFloat).to.have.property('name', 'parseFloat');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('parseFloat').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      expect(Number.parseFloat).to.have.property('length', 1);
    });
  });

  describe('.isFinite()', function () {
    if (!Number.hasOwnProperty('isFinite')) {
      return it('exists', function () {
        expect(Number).to.have.property('isFinite');
      });
    }

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.isFinite).to.have.property('name', 'isFinite');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('isFinite').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      expect(Number.isFinite).to.have.property('length', 1);
    });

    it('should work', function () {
      integers.map(Number.isFinite).forEach(expectTrue);
      infinities.map(Number.isFinite).forEach(expectFalse);
      expect(Number.isFinite(Infinity)).to.equal(false);
      expect(Number.isFinite(-Infinity)).to.equal(false);
      expect(Number.isFinite(NaN)).to.equal(false);
      expect(Number.isFinite(4)).to.equal(true);
      expect(Number.isFinite(4.5)).to.equal(true);
      expect(Number.isFinite('hi')).to.equal(false);
      expect(Number.isFinite('1.3')).to.equal(false);
      expect(Number.isFinite('51')).to.equal(false);
      expect(Number.isFinite(0)).to.equal(true);
      expect(Number.isFinite(-0)).to.equal(true);
      expect(Number.isFinite(valueOfThree)).to.equal(false);
      expect(Number.isFinite(valueOfNaN)).to.equal(false);
      expect(Number.isFinite(valueOfThrows)).to.equal(false);
      expect(Number.isFinite(toStringThrows)).to.equal(false);
      expect(Number.isFinite(toPrimitiveThrows)).to.equal(false);
    });

    it('should not be confused by type coercion', function () {
      nonNumbers.map(Number.isFinite).forEach(expectFalse);
    });
  });

  describe('.isInteger()', function () {
    if (!Number.hasOwnProperty('isInteger')) {
      return it('exists', function () {
        expect(Number).to.have.property('isInteger');
      });
    }

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.isInteger).to.have.property('name', 'isInteger');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('isInteger').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      expect(Number.isInteger).to.have.property('length', 1);
    });

    it('should be truthy on integers', function () {
      integers.map(Number.isInteger).forEach(expectTrue);
      expect(Number.isInteger(4)).to.equal(true);
      expect(Number.isInteger(4.0)).to.equal(true);
      expect(Number.isInteger(1801439850948)).to.equal(true);
    });

    it('should be false when the type is not number', function () {
      nonNumbers.forEach(function (thing) {
        expect(Number.isInteger(thing)).to.equal(false);
      });
    });

    it('should be false when NaN', function () {
      expect(Number.isInteger(NaN)).to.equal(false);
    });

    it('should be false when ∞', function () {
      expect(Number.isInteger(Infinity)).to.equal(false);
      expect(Number.isInteger(-Infinity)).to.equal(false);
    });

    it('should be false when number is not integer', function () {
      expect(Number.isInteger(3.4)).to.equal(false);
      expect(Number.isInteger(-3.4)).to.equal(false);
    });

    it('should be true when abs(number) is 2^53 or larger', function () {
      expect(Number.isInteger(Math.pow(2, 53))).to.equal(true);
      expect(Number.isInteger(Math.pow(2, 54))).to.equal(true);
      expect(Number.isInteger(-Math.pow(2, 53))).to.equal(true);
      expect(Number.isInteger(-Math.pow(2, 54))).to.equal(true);
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];
      safeIntegers.forEach(function (integer) {
        expect(Number.isInteger(integer)).to.equal(true);
        expect(Number.isInteger(-integer)).to.equal(true);
      });
    });
  });

  describe('.isSafeInteger()', function () {
    if (!Number.hasOwnProperty('isSafeInteger')) {
      return it('exists', function () {
        expect(Number).to.have.property('isSafeInteger');
      });
    }

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.isSafeInteger).to.have.property('name', 'isSafeInteger');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('isSafeInteger').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      expect(Number.isSafeInteger).to.have.property('length', 1);
    });

    it('should be truthy on integers', function () {
      integers.map(Number.isSafeInteger).forEach(expectTrue);
      expect(Number.isSafeInteger(4)).to.equal(true);
      expect(Number.isSafeInteger(4.0)).to.equal(true);
      expect(Number.isSafeInteger(1801439850948)).to.equal(true);
    });

    it('should be false when the type is not number', function () {
      nonNumbers.forEach(function (thing) {
        expect(Number.isSafeInteger(thing)).to.equal(false);
      });
    });

    it('should be false when NaN', function () {
      expect(Number.isSafeInteger(NaN)).to.equal(false);
    });

    it('should be false when ∞', function () {
      expect(Number.isSafeInteger(Infinity)).to.equal(false);
      expect(Number.isSafeInteger(-Infinity)).to.equal(false);
    });

    it('should be false when number is not integer', function () {
      expect(Number.isSafeInteger(3.4)).to.equal(false);
      expect(Number.isSafeInteger(-3.4)).to.equal(false);
    });

    it('should be false when abs(number) is 2^53 or larger', function () {
      expect(Number.isSafeInteger(Math.pow(2, 53))).to.equal(false);
      expect(Number.isSafeInteger(Math.pow(2, 54))).to.equal(false);
      expect(Number.isSafeInteger(-Math.pow(2, 53))).to.equal(false);
      expect(Number.isSafeInteger(-Math.pow(2, 54))).to.equal(false);
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];
      safeIntegers.forEach(function (integer) {
        expect(Number.isSafeInteger(integer)).to.equal(true);
        expect(Number.isSafeInteger(-integer)).to.equal(true);
      });
    });
  });

  describe('.isNaN()', function () {
    if (!Number.hasOwnProperty('isNaN')) {
      return it('exists', function () {
        expect(Number).to.have.property('isNaN');
      });
    }

    ifFunctionsHaveNamesIt('has the right name', function () {
      expect(Number.isNaN).to.have.property('name', 'isNaN');
    });

    it('is not enumerable', function () {
      expect(Number).ownPropertyDescriptor('isNaN').to.have.property('enumerable', false);
    });

    it('has the right arity', function () {
      expect(Number.isNaN).to.have.property('length', 1);
    });

    it('should be truthy only on NaN', function () {
      integers.concat(nonIntegers).map(Number.isNaN).forEach(expectFalse);
      nonNumbers.map(Number.isNaN).forEach(expectFalse);
      expect(Number.isNaN(NaN)).to.equal(true);
      expect(Number.isNaN(0 / 0)).to.equal(true);
      expect(Number.isNaN(Number('NaN'))).to.equal(true);
      expect(Number.isNaN(4)).to.equal(false);
      expect(Number.isNaN(4.5)).to.equal(false);
      expect(Number.isNaN('hi')).to.equal(false);
      expect(Number.isNaN('1.3')).to.equal(false);
      expect(Number.isNaN('51')).to.equal(false);
      expect(Number.isNaN(0)).to.equal(false);
      expect(Number.isNaN(-0)).to.equal(false);
      expect(Number.isNaN(valueOfThree)).to.equal(false);
      expect(Number.isNaN(valueOfNaN)).to.equal(false);
      expect(Number.isNaN(valueOfThrows)).to.equal(false);
      expect(Number.isNaN(toStringThrows)).to.equal(false);
      expect(Number.isNaN(toPrimitiveThrows)).to.equal(false);
    });
  });

  describe('strings in the constructor', function () {
    it('works on normal literals', function () {
      expect(Number('1')).to.equal(+'1');
	  expect(Number('1.1')).to.equal(+'1.1');
      expect(Number('0xA')).to.equal(0xA);
    });

    it('behaves like the builtin', function () {
      expect((1).constructor).to.equal(Number);
    });

    it('works with boxed primitives', function () {
      expect(1 instanceof Number).to.equal(false);
      expect(Object(1) instanceof Number).to.equal(true);
    });

    it('works with `new`', function () {
      /*jshint -W053 */
      var one = new Number('1');
      var a = new Number('0xA');
      /*jshint +W053 */

      expect(+one).to.equal(1);
      expect(one instanceof Number).to.equal(true);
      expect(+a).to.equal(0xA);
      expect(a instanceof Number).to.equal(true);
    });

    it('works with binary literals in string form', function () {
      expect(Number('0b1')).to.equal(1);
      expect(Number('0b10')).to.equal(2);
      expect(Number('0b11')).to.equal(3);
      expect(Number({ toString: function () { return '0b100'; }, valueOf: function () { return '0b101'; } })).to.equal(5);
    });

    it('works with octal literals in string form', function () {
      expect(Number('0o7')).to.equal(7);
      expect(Number('0o10')).to.equal(8);
      expect(Number('0o11')).to.equal(9);
      expect(Number({ toString: function () { return '0o12'; }, valueOf: function () { return '0o13'; } })).to.equal(11);
    });
  });
});
