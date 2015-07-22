/* global beforeEach, describe, xdescribe, it, xit, expect, require */

var getRegexLiteral = function (stringRegex) {
  try {
    /*jshint evil: true */
    return Function('return ' + stringRegex + ';')();
    /*jshint evil: false */
  } catch (e) {}
};
var describeIfSupportsDescriptors = Object.getOwnPropertyDescriptor ? describe : xdescribe;
var callAllowsPrimitives = (function () { return this === 3; }.call(3));
var ifCallAllowsPrimitivesIt = callAllowsPrimitives ? it : xit;

describe('RegExp', function () {
  (typeof process !== 'undefined' && process.env.NO_ES6_SHIM ? it.skip : it)('is on the exported object', function () {
    var exported = require('../');
    expect(exported.RegExp).to.equal(RegExp);
  });

  it('can be called with no arguments', function () {
    var regex = RegExp();
    expect(String(regex)).to.equal(String(RegExp.prototype));
    expect(regex).to.be.an.instanceOf(RegExp);
  });

  it('can be called with null/undefined', function () {
    expect(String(RegExp(null))).to.equal('/null/');
    expect(String(RegExp(undefined))).to.equal(String(RegExp.prototype));
  });

  describe('constructor', function () {
    it('allows a regex as the pattern', function () {
      var a = /a/g;
      var b = new RegExp(a);
      if (typeof a !== 'function') {
        // in browsers like Safari 5, new RegExp with a regex returns the same instance.
        expect(a).not.to.equal(b);
      }
      expect(a).to.eql(b);
    });

    it('allows a string with flags', function () {
      expect(new RegExp('a', 'mgi')).to.eql(/a/gim);
      expect(String(new RegExp('a', 'mgi'))).to.equal('/a/gim');
    });

    it('allows a regex with flags', function () {
      var a = /a/g;
      var makeRegex = function () { return new RegExp(a, 'mi'); };
      expect(makeRegex).not.to['throw'](TypeError);
      expect(makeRegex()).to.eql(/a/mi);
      expect(String(makeRegex())).to.equal('/a/im');
    });

    it('works with instanceof', function () {
      expect(/a/g).to.be.an.instanceOf(RegExp);
      expect(new RegExp('a', 'im')).to.be.an.instanceOf(RegExp);
      expect(new RegExp(/a/g, 'im')).to.be.an.instanceOf(RegExp);
    });

    it('has the right constructor', function () {
      expect(/a/g).to.have.property('constructor', RegExp);
      expect(new RegExp('a', 'im')).to.have.property('constructor', RegExp);
      expect(new RegExp(/a/g, 'im')).to.have.property('constructor', RegExp);
    });

    it('toStrings properly', function () {
      expect(Object.prototype.toString.call(/a/g)).to.equal('[object RegExp]');
      expect(Object.prototype.toString.call(new RegExp('a', 'g'))).to.equal('[object RegExp]');
      expect(Object.prototype.toString.call(new RegExp(/a/g, 'im'))).to.equal('[object RegExp]');
    });

    it('functions as a boxed primitive wrapper', function () {
      var regex = /a/g;
      expect(RegExp(regex)).to.equal(regex);
    });
  });

  describeIfSupportsDescriptors('#flags', function () {
    if (!RegExp.prototype.hasOwnProperty('flags')) {
      return it('exists', function () {
        expect(RegExp.prototype).to.have.property('flags');
      });
    }

    var regexpFlagsDescriptor = Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags');
    var testGenericRegExpFlags = function (object) {
      return regexpFlagsDescriptor.get.call(object);
    };

    it('has the correct descriptor', function () {
      expect(regexpFlagsDescriptor.configurable).to.equal(true);
      expect(regexpFlagsDescriptor.enumerable).to.equal(false);
      expect(regexpFlagsDescriptor.get instanceof Function).to.equal(true);
      expect(regexpFlagsDescriptor.set).to.equal(undefined);
    });

    ifCallAllowsPrimitivesIt('throws when not called on an object', function () {
      var nonObjects = ['', false, true, 42, NaN, null, undefined];
      nonObjects.forEach(function (nonObject) {
        expect(function () { testGenericRegExpFlags(nonObject); }).to['throw'](TypeError);
      });
    });

    it('has the correct flags on a literal', function () {
      expect((/a/g).flags).to.equal('g');
      expect((/a/i).flags).to.equal('i');
      expect((/a/m).flags).to.equal('m');
      if (RegExp.prototype.hasOwnProperty('sticky')) {
        expect(getRegexLiteral('/a/y').flags).to.equal('y');
      }
      if (RegExp.prototype.hasOwnProperty('unicode')) {
        expect(getRegexLiteral('/a/u').flags).to.equal('u');
      }
    });

    it('has the correct flags on a constructed RegExp', function () {
      expect(new RegExp('a', 'g').flags).to.equal('g');
      expect(new RegExp('a', 'i').flags).to.equal('i');
      expect(new RegExp('a', 'm').flags).to.equal('m');
      if (RegExp.prototype.hasOwnProperty('sticky')) {
        expect(new RegExp('a', 'y').flags).to.equal('y');
      }
      if (RegExp.prototype.hasOwnProperty('unicode')) {
        expect(new RegExp('a', 'u').flags).to.equal('u');
      }
    });

    it('returns flags sorted on a literal', function () {
      expect((/a/gim).flags).to.equal('gim');
      expect((/a/mig).flags).to.equal('gim');
      expect((/a/mgi).flags).to.equal('gim');
      if (RegExp.prototype.hasOwnProperty('sticky')) {
        expect(getRegexLiteral('/a/gyim').flags).to.equal('gimy');
      }
      if (RegExp.prototype.hasOwnProperty('unicode')) {
        expect(getRegexLiteral('/a/ugmi').flags).to.equal('gimu');
      }
    });

    it('returns flags sorted on a constructed RegExp', function () {
      expect(new RegExp('a', 'gim').flags).to.equal('gim');
      expect(new RegExp('a', 'mig').flags).to.equal('gim');
      expect(new RegExp('a', 'mgi').flags).to.equal('gim');
      if (RegExp.prototype.hasOwnProperty('sticky')) {
        expect(new RegExp('a', 'mygi').flags).to.equal('gimy');
      }
      if (RegExp.prototype.hasOwnProperty('unicode')) {
        expect(new RegExp('a', 'mugi').flags).to.equal('gimu');
      }
    });
  });

  describe('Object properties', function () {
    it('does not have the nonstandard $input property', function () {
      expect(RegExp).not.to.have.property('$input'); // Chrome < 39, Opera < 26 have this
    });

    it('has "input" property', function () {
      expect(RegExp).to.have.ownProperty('input');
      expect(RegExp).to.have.ownProperty('$_');
    });

    it('has "last match" property', function () {
      expect(RegExp).to.have.ownProperty('lastMatch');
      expect(RegExp).to.have.ownProperty('$+');
    });

    it('has "last paren" property', function () {
      expect(RegExp).to.have.ownProperty('lastParen');
      expect(RegExp).to.have.ownProperty('$&');
    });

    it('has "leftContext" property', function () {
      expect(RegExp).to.have.ownProperty('leftContext');
      expect(RegExp).to.have.ownProperty('$`');
    });

    it('has "rightContext" property', function () {
      expect(RegExp).to.have.ownProperty('rightContext');
      expect(RegExp).to.have.ownProperty("$'");
    });

    xit('has "multiline" property', function () {
      // fails in IE 9, 10, 11
      expect(RegExp).to.have.ownProperty('multiline');
      expect(RegExp).to.have.ownProperty('$*');
    });

    it('has the right globals', function () {
      var matchVars = [
        '$1',
        '$2',
        '$3',
        '$4',
        '$5',
        '$6',
        '$7',
        '$8',
        '$9'
      ];
      matchVars.forEach(function (match) {
        expect(RegExp).to.have.property(match);
      });
    });

    describe('updates RegExp globals', function () {
      var re, str = 'abcdefghijklmnopq';
      beforeEach(function () {
        re = /(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)(m)(n)(o)(p)/;
        re.exec(str);
      });

      it('has "input"', function () {
        expect(RegExp.input).to.equal(str);
        expect(RegExp.$_).to.equal(str);
      });

      it('has "multiline"', function () {
        if (RegExp.hasOwnProperty('multiline')) {
          expect(RegExp.multiline).to.equal(false);
        }
        if (RegExp.hasOwnProperty('$*')) {
          expect(RegExp['$*']).to.equal(false);
        }
      });

      it('has "lastMatch"', function () {
        expect(RegExp.lastMatch).to.equal('bcdefghijklmnop');
        expect(RegExp['$&']).to.equal('bcdefghijklmnop');
      });

      // in all but IE, this works. IE lastParen breaks after 11 tokens.
      xit('has "lastParen"', function () {
        expect(RegExp.lastParen).to.equal('p');
        expect(RegExp['$+']).to.equal('p');
      });
      it('has "lastParen" for less than 11 tokens', function () {
        (/(b)(c)(d)/).exec('abcdef');
        expect(RegExp.lastParen).to.equal('d');
        expect(RegExp['$+']).to.equal('d');
      });

      it('has "leftContext"', function () {
        expect(RegExp.leftContext).to.equal('a');
        expect(RegExp['$`']).to.equal('a');
      });

      it('has "rightContext"', function () {
        expect(RegExp.rightContext).to.equal('q');
        expect(RegExp["$'"]).to.equal('q');
      });

      it('has $1 - $9', function () {
        expect(RegExp.$1).to.equal('b');
        expect(RegExp.$2).to.equal('c');
        expect(RegExp.$3).to.equal('d');
        expect(RegExp.$4).to.equal('e');
        expect(RegExp.$5).to.equal('f');
        expect(RegExp.$6).to.equal('g');
        expect(RegExp.$7).to.equal('h');
        expect(RegExp.$8).to.equal('i');
        expect(RegExp.$9).to.equal('j');
      });
    });
  });
});
