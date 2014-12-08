/*global describe, it, expect, require */

var exported = require('../');

var runStringTests = function () {
  'use strict';
  describe('String', function () {
    var hasStrictMode = (function () { return this === null; }.call(null));
    var testObjectCoercible = function (methodName) {
      var fn = String.prototype[methodName];
      if (!hasStrictMode) { return; } // skip these tests on IE <= 10
      expect(function () { return fn.call(undefined); }).to['throw'](TypeError);
      expect(function () { return fn.call(null); }).to['throw'](TypeError);
      expect(function () { return fn.apply(undefined); }).to['throw'](TypeError);
      expect(function () { return fn.apply(null); }).to['throw'](TypeError);
    };

    it('is on the exported object', function () {
      expect(exported.String).to.equal(String);
    });

    describe('#repeat()', function () {
      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('repeat');
      });

      it('should throw a RangeError when negative or infinite', function () {
        expect(function negativeOne() { return 'test'.repeat(-1); }).to['throw'](RangeError);
        expect(function infinite() { return 'test'.repeat(Infinity); }).to['throw'](RangeError);
      });

      it('should coerce to an integer', function () {
        expect('test'.repeat(null)).to.eql('');
        expect('test'.repeat(false)).to.eql('');
        expect('test'.repeat('')).to.eql('');
        expect('test'.repeat(NaN)).to.eql('');
        expect('test'.repeat({})).to.eql('');
        expect('test'.repeat([])).to.eql('');
        expect('test'.repeat({ valueOf: function () { return 2; } })).to.eql('testtest');
      });
      it('should work', function () {
        expect('test'.repeat(3)).to.eql('testtesttest');
      });
      it('should work on integers', function () {
        expect(String.prototype.repeat.call(2, 3)).to.eql('222');
      });
      it('should work on booleans', function () {
        expect(String.prototype.repeat.call(true, 3)).to.eql('truetruetrue');
      });
      it('should work on dates', function () {
        var d = new Date();
        expect(String.prototype.repeat.call(d, 3)).to.eql([d, d, d].join(''));
      });
    });

    describe('#startsWith()', function () {
      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('startsWith');
      });

      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('startsWith');
      });

      it('should be truthy on correct results', function () {
        expect('test'.startsWith('te')).to.equal(true);
        expect('test'.startsWith('st')).to.equal(false);
        expect(''.startsWith('/')).to.equal(false);
        expect('#'.startsWith('/')).to.equal(false);
        expect('##'.startsWith('///')).to.equal(false);

        expect('abc'.startsWith('abc')).to.equal(true);
        expect('abcd'.startsWith('abc')).to.equal(true);
        expect('abc'.startsWith('a')).to.equal(true);
        expect('abc'.startsWith('abcd')).to.equal(false);
        expect('abc'.startsWith('bcde')).to.equal(false);
        expect('abc'.startsWith('b')).to.equal(false);
        expect('abc'.startsWith('abc', 0)).to.equal(true);
        expect('abc'.startsWith('bc', 0)).to.equal(false);
        expect('abc'.startsWith('bc', 1)).to.equal(true);
        expect('abc'.startsWith('c', 1)).to.equal(false);
        expect('abc'.startsWith('abc', 1)).to.equal(false);
        expect('abc'.startsWith('c', 2)).to.equal(true);
        expect('abc'.startsWith('d', 2)).to.equal(false);
        expect('abc'.startsWith('dcd', 2)).to.equal(false);
        expect('abc'.startsWith('a', 42)).to.equal(false);
        expect('abc'.startsWith('a', Infinity)).to.equal(false);
        expect('abc'.startsWith('a', NaN)).to.equal(true);
        expect('abc'.startsWith('b', NaN)).to.equal(false);
        expect('abc'.startsWith('ab', -43)).to.equal(true);
        expect('abc'.startsWith('ab', -Infinity)).to.equal(true);
        expect('abc'.startsWith('bc', -42)).to.equal(false);
        expect('abc'.startsWith('bc', -Infinity)).to.equal(false);
        if (hasStrictMode) {
          expect(function () {
            return ''.startsWith.call(null, 'nu');
          }).to['throw'](TypeError);
          expect(function () {
            return ''.startsWith.call(undefined, 'un');
          }).to['throw'](TypeError);
        }
        var myobj = {
          toString: function () { return 'abc'; },
          startsWith: String.prototype.startsWith
        };
        expect(myobj.startsWith('abc')).to.equal(true);
        expect(myobj.startsWith('bc')).to.equal(false);

        var gotStr = false, gotPos = false;

        myobj = {
          toString: function () {
            expect(gotPos).to.equal(false);
            gotStr = true;
            return 'xyz';
          },
          startsWith: String.prototype.startsWith
        };
        var idx = {
          valueOf: function () {
            expect(gotStr).to.equal(true);
            gotPos = true;
            return 42;
          }
        };
        myobj.startsWith('elephant', idx);
        expect(gotPos).to.equal(true);
      });

      it('should coerce to a string', function () {
        expect('abcd'.startsWith({ toString: function () { return 'ab'; } })).to.equal(true);
        expect('abcd'.startsWith({ toString: function () { return 'foo'; } })).to.equal(false);
      });

      it('should not allow a regex', function () {
        expect(function () { return 'abcd'.startsWith(/abc/); }).to['throw'](TypeError);
        expect(function () { return 'abcd'.startsWith(new RegExp('abc')); }).to['throw'](TypeError);
      });
    });

    describe('#endsWith()', function () {
      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('endsWith');
      });

      it('should be truthy on correct results', function () {
        expect('test'.endsWith('st')).to.equal(true);
        expect('test'.endsWith('te')).to.equal(false);
        expect(''.endsWith('/')).to.equal(false);
        expect('#'.endsWith('/')).to.equal(false);
        expect('##'.endsWith('///')).to.equal(false);

        expect('abc'.endsWith('abc')).to.equal(true);
        expect('abcd'.endsWith('bcd')).to.equal(true);
        expect('abc'.endsWith('c')).to.equal(true);
        expect('abc'.endsWith('abcd')).to.equal(false);
        expect('abc'.endsWith('bbc')).to.equal(false);
        expect('abc'.endsWith('b')).to.equal(false);
        expect('abc'.endsWith('abc', 3)).to.equal(true);
        expect('abc'.endsWith('bc', 3)).to.equal(true);
        expect('abc'.endsWith('a', 3)).to.equal(false);
        expect('abc'.endsWith('bc', 3)).to.equal(true);
        expect('abc'.endsWith('a', 1)).to.equal(true);
        expect('abc'.endsWith('abc', 1)).to.equal(false);
        expect('abc'.endsWith('b', 2)).to.equal(true);
        expect('abc'.endsWith('d', 2)).to.equal(false);
        expect('abc'.endsWith('dcd', 2)).to.equal(false);
        expect('abc'.endsWith('a', 42)).to.equal(false);
        expect('abc'.endsWith('bc', Infinity)).to.equal(true);
        expect('abc'.endsWith('a', Infinity)).to.equal(false);
        expect('abc'.endsWith('bc', undefined)).to.equal(true);
        expect('abc'.endsWith('bc', -43)).to.equal(false);
        expect('abc'.endsWith('bc', -Infinity)).to.equal(false);
        expect('abc'.endsWith('bc', NaN)).to.equal(false);
        if (hasStrictMode) {
          expect(function () {
            return ''.endsWith.call(null, 'ull');
          }).to['throw'](TypeError);
          expect(function () {
            return ''.endsWith.call(undefined, 'ned');
          }).to['throw'](TypeError);
        }

        var myobj = {
          toString: function () { return 'abc'; },
          endsWith: String.prototype.endsWith
        };
        expect(myobj.endsWith('abc')).to.equal(true);
        expect(myobj.endsWith('ab')).to.equal(false);
        var gotStr = false, gotPos = false;

        myobj = {
          toString: function () {
            expect(gotPos).to.equal(false);
            gotStr = true;
            return 'xyz';
          },
          endsWith: String.prototype.endsWith
        };
        var idx = {
          valueOf: function () {
            expect(gotStr).to.equal(true);
            gotPos = true;
            return 42;
          }
        };
        myobj.endsWith('elephant', idx);
        expect(gotPos).to.equal(true);
      });

      it('should coerce to a string', function () {
        expect('abcd'.endsWith({ toString: function () { return 'cd'; } })).to.equal(true);
        expect('abcd'.endsWith({ toString: function () { return 'foo'; } })).to.equal(false);
      });

      it('should not allow a regex', function () {
        expect(function () { return 'abcd'.endsWith(/abc/); }).to['throw'](TypeError);
        expect(function () { return 'abcd'.endsWith(new RegExp('abc')); }).to['throw'](TypeError);
      });

      it('should handle negative and zero positions properly', function () {
        expect('abcd'.endsWith('bcd', 0)).to.equal(false);
        expect('abcd'.endsWith('bcd', -2)).to.equal(false);
        expect('abcd'.endsWith('b', -2)).to.equal(false);
        expect('abcd'.endsWith('ab', -2)).to.equal(false);
      });
    });

    describe('#includes()', function () {
      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('includes');
      });

      it('should be truthy on correct results', function () {
        expect('test'.includes('es')).to.equal(true);
        expect('abc'.includes('a')).to.equal(true);
        expect('abc'.includes('b')).to.equal(true);
        expect('abc'.includes('abc')).to.equal(true);
        expect('abc'.includes('bc')).to.equal(true);
        expect('abc'.includes('d')).to.equal(false);
        expect('abc'.includes('abcd')).to.equal(false);
        expect('abc'.includes('ac')).to.equal(false);
        expect('abc'.includes('abc', 0)).to.equal(true);
        expect('abc'.includes('bc', 0)).to.equal(true);
        expect('abc'.includes('de', 0)).to.equal(false);
        expect('abc'.includes('bc', 1)).to.equal(true);
        expect('abc'.includes('c', 1)).to.equal(true);
        expect('abc'.includes('a', 1)).to.equal(false);
        expect('abc'.includes('abc', 1)).to.equal(false);
        expect('abc'.includes('c', 2)).to.equal(true);
        expect('abc'.includes('d', 2)).to.equal(false);
        expect('abc'.includes('dcd', 2)).to.equal(false);
        expect('abc'.includes('a', 42)).to.equal(false);
        expect('abc'.includes('a', Infinity)).to.equal(false);
        expect('abc'.includes('ab', -43)).to.equal(true);
        expect('abc'.includes('cd', -42)).to.equal(false);
        expect('abc'.includes('ab', -Infinity)).to.equal(true);
        expect('abc'.includes('cd', -Infinity)).to.equal(false);
        expect('abc'.includes('ab', NaN)).to.equal(true);
        expect('abc'.includes('cd', NaN)).to.equal(false);

        var myobj = {
          toString: function () {return 'abc';},
          includes: String.prototype.includes
        };

        expect(myobj.includes('abc')).to.equal(true);
        expect(myobj.includes('cd')).to.equal(false);

        var gotStr = false, gotPos = false;

        myobj = {
          toString: function () {
            expect(gotPos).to.equal(false);
            gotStr = true;
            return 'xyz';
          },

          includes: String.prototype.includes
        };

        var idx = {
          valueOf: function () {
            expect(gotStr).to.equal(true);
            gotPos = true;
            return 42;
          }
        };

        myobj.includes('elephant', idx);
        expect(gotPos).to.equal(true);
      });

      it('should be falsy on incorrect results', function () {
        expect('test'.includes('1290')).to.equal(false);
      });
    });

    describe('.fromCodePoint()', function () {
      it('throws a RangeError', function () {
        var invalidValues = [
          'abc',
          {},
          -1,
          0x10FFFF + 1
        ];
        invalidValues.forEach(function (value) {
          expect(function () { return String.fromCodePoint(value); }).to['throw'](RangeError);
        });
      });

      it('returns the empty string with no args', function () {
        expect(String.fromCodePoint()).to.equal('');
      });

      it('has a length of one', function () {
        expect(String.fromCodePoint.length).to.equal(1);
      });

      it('works', function () {
        var codePoints = [];
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789…?!';
        for (var i = 0; i < chars.length; ++i) {
          codePoints.push(chars.charCodeAt(i));
          expect(String.fromCodePoint(chars.charCodeAt(i))).to.equal(chars[i]);
        }
        expect(String.fromCodePoint.apply(String, codePoints)).to.equal(chars);
      });

      it('works with unicode', function () {
        expect(String.fromCodePoint(0x2500)).to.equal('\u2500');
        expect(String.fromCodePoint(0x010000)).to.equal('\ud800\udc00');
        expect(String.fromCodePoint(0x10FFFF)).to.equal('\udbff\udfff');
      });
    });

    describe('#codePointAt()', function () {
      it('should throw a TypeError when called on null or undefined', function () {
        testObjectCoercible('codePointAt');
      });

      it('should work', function () {
        var str = 'abc';
        expect(str.codePointAt(0)).to.equal(97);
        expect(str.codePointAt(1)).to.equal(98);
        expect(str.codePointAt(2)).to.equal(99);
      });

      it('should work with unicode', function () {
        expect('\u2500'.codePointAt(0)).to.equal(0x2500);
        expect('\ud800\udc00'.codePointAt(0)).to.equal(0x10000);
        expect('\udbff\udfff'.codePointAt(0)).to.equal(0x10ffff);
        expect('\ud800\udc00\udbff\udfff'.codePointAt(0)).to.equal(0x10000);
        expect('\ud800\udc00\udbff\udfff'.codePointAt(1)).to.equal(0xdc00);
        expect('\ud800\udc00\udbff\udfff'.codePointAt(2)).to.equal(0x10ffff);
        expect('\ud800\udc00\udbff\udfff'.codePointAt(3)).to.equal(0xdfff);
      });

      it('should return undefined when pos is negative or too large', function () {
        var str = 'abc';
        expect(str.codePointAt(-1)).to.equal(undefined);
        expect(str.codePointAt(str.length)).to.equal(undefined);
      });
    });

    describe('#iterator()', function () {
      it('should work with plain strings', function () {
        var str = 'abc';
        expect(Array.from(str)).to.eql(['a', 'b', 'c']);
      });

      it('should work with surrogate characters', function () {
        var str = '\u2500\ud800\udc00\udbff\udfff\ud800';
        expect(Array.from(str)).to.eql(
          ['\u2500', '\ud800\udc00', '\udbff\udfff', '\ud800']
        );
      });
    });

    describe('.raw()', function () {
      it('should have a length of 1', function () {
        expect(String.raw.length).to.equal(1);
      });

      it('works with callSite.raw: Array', function () {
        var callSite = {};

        var str = 'The total is 10 ($11 with tax)';
        callSite.raw = ['The total is ', ' ($', ' with tax)'];
        expect(String.raw(callSite, 10, 11)).to.eql(str);

        str = 'The total is {total} (${total * 1.01} with tax)';
        callSite.raw = ['The total is ', ' ($', ' with tax)'];
        expect(String.raw(callSite, '{total}', '{total * 1.01}')).to.eql(str);
      });

      it('works with callSite.raw: array-like object', function () {
        var callSite = {};

        var str = 'The total is 10 ($11 with tax)';
        callSite.raw = {0: 'The total is ', 1: ' ($', 2: ' with tax)', length: 3};
        expect(String.raw(callSite, 10, 11)).to.eql(str);

        str = 'The total is {total} (${total * 1.01} with tax)';
        callSite.raw = {0: 'The total is ', 1: ' ($', 2: ' with tax)', length: 3};
        expect(String.raw(callSite, '{total}', '{total * 1.01}')).to.eql(str);
      });

      it('works with callSite.raw: empty Objects', function () {
        var callSite = { raw: {} };
        expect(String.raw(callSite, '{total}', '{total * 1.01}')).to.eql('');
        expect(String.raw(callSite)).to.equal('');
      });

      it('ReturnIfAbrupt - Less Substitutions', function () {
        var callSite = {
          raw: { 0: 'The total is ', 1: ' ($', 2: ' with tax)', length: 3 }
        };
        var str = 'The total is 10 ($ with tax)';
        expect(String.raw(callSite, 10)).to.equal(str);
      });
    });

    describe('#trim()', function () {
      it('should trim the correct characters', function () {
        var whitespace = '\u0009' + '\u000b' + '\u000c' + '\u0020' +
                         '\u00a0' + '\u1680' + '\u2000' + '\u2001' +
                         '\u2002' + '\u2003' + '\u2004' + '\u2005' +
                         '\u2006' + '\u2007' + '\u2008' + '\u2009' +
                         '\u200A' + '\u202f' + '\u205f' + '\u3000';

        var lineTerminators = '\u000a' + '\u000d' + '\u2028' + '\u2029';

        var trimmed = (whitespace + lineTerminators).trim();
        expect(trimmed.length).to.equal(0);
        expect(trimmed).to.equal('');
      });

      it('should not trim U+0085', function () {
        var trimmed = '\u0085'.trim();
        expect(trimmed.length).to.equal(1);
        expect(trimmed).to.equal('\u0085');
      });

      it('should trim on both sides', function () {
        var trimmed = ' a '.trim();
        expect(trimmed.length).to.equal(1);
        expect(trimmed).to.equal('a');
      });
    });
  });
};

describe('clean Object.prototype', runStringTests);

describe('polluted Object.prototype', function () {
  Object.prototype[1] = 42;
  runStringTests();
  delete Object.prototype[1];
});
