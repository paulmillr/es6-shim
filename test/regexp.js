/*global describe, it, expect, require */

var exported = require('../');

var getRegexLiteral = function (stringRegex) {
  try {
    /*jshint evil: true */
    return Function('return ' + stringRegex + ';')();
    /*jshint evil: false */
  } catch (e) {}
};

describe('RegExp', function () {
  it('is on the exported object', function () {
    expect(exported.RegExp).to.equal(RegExp);
  });

  describe('constructor', function () {
    it('allows a regex as the pattern', function () {
      var a = /a/g;
      var b = new RegExp(a);
      expect(a).not.to.equal(b);
      expect(a).to.eql(b);
    });

    it('allows a string with flags', function () {
      expect(new RegExp('a', 'mgi')).to.eql(/a/gim);
      expect(String(new RegExp('a', 'mgi'))).to.equal('/a/gim');
    });

    it('works with instanceof', function () {
      expect(/a/g).to.be.an['instanceof'](RegExp);
      expect(new RegExp('a', 'im')).to.be.an['instanceof'](RegExp);
    });

    it('has the right constructor', function () {
      expect(/a/g).to.have.property('constructor', RegExp);
      expect(new RegExp('a', 'im')).to.have.property('constructor', RegExp);
    });

    it('toStrings properly', function () {
      expect(Object.prototype.toString.call(/a/g)).to.equal('[object RegExp]');
      expect(Object.prototype.toString.call(new RegExp('a', 'g'))).to.equal('[object RegExp]');
    });
  });

  describe('#flags', function () {
    it('throws when not called on an object', function () {
      var nonObjects = ['', false, true, 42, NaN, null, undefined];
      nonObjects.forEach(function (nonObject) {
        expect(function () { RegExp.prototype.flags.call(nonObject); }).to['throw'](TypeError);
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
    xit('does not have the nonstandard $input property', function () {
      expect(RegExp).not.to.have.property('$input'); // Chrome < 39, Opera < 26 have this
    });

    it('has the right globals', function () {
      var enumerableKeys = [
        'input',
        'multiline',
        'lastMatch',
        'lastParen',
        'leftContext',
        'rightContext',
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
      var nonEnumerableKeys = [
        '$_',
        '$*',
        '$&',
        '$+',
        '$`',
        "$'"
      ];
      expect(Object.keys(RegExp)).to.eql(enumerableKeys);
      var noop = function () {};
      var actualNonEnumerables = Object.getOwnPropertyNames(RegExp).filter(function (key) {
        return !(key in noop) && key !== '$input'; // see above test
      });
      expect(actualNonEnumerables).to.have.members(enumerableKeys.concat(nonEnumerableKeys));
    });

    it('updates RegExp globals', function () {
      var re = /(b)(c)(d)(e)(f)(g)(h)(i)(j)(k)(l)(m)(n)(o)(p)/;
      var str = 'abcdefghijklmnopq';
      re.exec(str);
      expect(RegExp.input).to.equal(str);
      expect(RegExp.$_).to.equal(str);
      expect(RegExp.multiline).to.equal(false);
      expect(RegExp['$*']).to.equal(false);
      expect(RegExp.lastMatch).to.equal('bcdefghijklmnop');
      expect(RegExp['$&']).to.equal('bcdefghijklmnop');
      expect(RegExp.lastParen).to.equal('p');
      expect(RegExp['$+']).to.equal('p');
      expect(RegExp.leftContext).to.equal('a');
      expect(RegExp['$`']).to.equal('a');
      expect(RegExp.rightContext).to.equal('q');
      expect(RegExp["$'"]).to.equal('q');
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
