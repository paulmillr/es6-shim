describe('String', function() {
  describe('#repeat()', function() {
    it('should throw a RangeError when negative or infinite', function() {
      expect(function negativeOne() { return 'test'.repeat(-1); }).to.throw(RangeError);
      expect(function infinite() { return 'test'.repeat(Infinity); }).to.throw(RangeError);
    });
    it('should coerce to an integer', function() {
      expect('test'.repeat(null)).to.eql('');
      expect('test'.repeat(false)).to.eql('');
      expect('test'.repeat('')).to.eql('');
      expect('test'.repeat(NaN)).to.eql('');
      expect('test'.repeat({})).to.eql('');
      expect('test'.repeat([])).to.eql('');
      expect('test'.repeat({ valueOf: function() { return 2; } })).to.eql('testtest');
    });
    it('should work', function() {
      expect('test'.repeat(3)).to.eql('testtesttest');
    });
    it('should work - integer type', function() {
      expect(String.prototype.repeat.call(2, 3)).to.eql('222');
    });
    it('should work - boolean type', function() {
      expect(String.prototype.repeat.call(true, 3)).to.eql('truetruetrue');
    });
    it('should work - Date type', function() {
      var d = new Date();
      expect(String.prototype.repeat.call(d, 3)).to.eql([d, d, d].join(''));
    });
  });

  describe('#startsWith()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.startsWith('te')).to.be.ok;
      expect('test'.startsWith('st')).to.not.be.ok;
      expect(''.startsWith('/')).to.not.be.ok;
      expect('#'.startsWith('/')).to.not.be.ok;
      expect('##'.startsWith('///')).to.not.be.ok;

      expect('abc'.startsWith('abc')).to.be.ok;
      expect('abcd'.startsWith('abc')).to.be.ok;
      expect('abc'.startsWith('a')).to.be.ok;
      expect('abc'.startsWith('abcd')).to.not.be.ok;
      expect('abc'.startsWith('bcde')).to.not.be.ok;
      expect('abc'.startsWith('b')).to.not.be.ok;
      expect('abc'.startsWith('abc', 0)).to.be.ok;
      expect('abc'.startsWith('bc', 0)).to.not.be.ok;
      expect('abc'.startsWith('bc', 1)).to.be.ok;
      expect('abc'.startsWith('c', 1)).to.not.be.ok;
      expect('abc'.startsWith('abc', 1)).to.not.be.ok;
      expect('abc'.startsWith('c', 2)).to.be.ok;
      expect('abc'.startsWith('d', 2)).to.not.be.ok;
      expect('abc'.startsWith('dcd', 2)).to.not.be.ok;
      expect('abc'.startsWith('a', 42)).to.not.be.ok;
      expect('abc'.startsWith('a', Infinity)).to.not.be.ok;
      expect('abc'.startsWith('a', NaN)).to.be.ok;
      expect('abc'.startsWith('b', NaN)).to.not.be.ok;
      expect('abc'.startsWith('ab', -43)).to.be.ok;
      expect('abc'.startsWith('ab', -Infinity)).to.be.ok;
      expect('abc'.startsWith('bc', -42)).to.not.be.ok;
      expect('abc'.startsWith('bc', -Infinity)).to.not.be.ok;
      var myobj = {
        toString: function() {return 'abc';},
        startsWith: String.prototype.startsWith
      };
      expect(myobj.startsWith('abc')).to.be.ok;
      expect(myobj.startsWith('bc')).to.not.be.ok;

      var gotStr = false, gotPos = false;

      myobj = {
        toString: function() {
          expect(gotPos).to.not.be.ok;
          gotStr = true;
          return 'xyz';
        },
        startsWith: String.prototype.startsWith
      };
      var idx = {
        valueOf: function() {
          expect(gotStr).to.be.ok;
          gotPos = true;
          return 42;
        }
      };
      myobj.startsWith('elephant', idx);
      expect(gotPos).to.be.ok;
    });
  });

  describe('#endsWith()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.endsWith('st')).to.be.ok;
      expect('test'.endsWith('te')).to.not.be.ok;
      expect(''.endsWith('/')).to.not.be.ok;
      expect('#'.endsWith('/')).to.not.be.ok;
      expect('##'.endsWith('///')).to.not.be.ok;

      expect('abc'.endsWith('abc')).to.be.ok;
      expect('abcd'.endsWith('bcd')).to.be.ok;
      expect('abc'.endsWith('c')).to.be.ok;
      expect('abc'.endsWith('abcd')).to.not.be.ok;
      expect('abc'.endsWith('bbc')).to.not.be.ok;
      expect('abc'.endsWith('b')).to.not.be.ok;
      expect('abc'.endsWith('abc', 3)).to.be.ok;
      expect('abc'.endsWith('bc', 3)).to.be.ok;
      expect('abc'.endsWith('a', 3)).to.not.be.ok;
      expect('abc'.endsWith('bc', 3)).to.be.ok;
      expect('abc'.endsWith('a', 1)).to.be.ok;
      expect('abc'.endsWith('abc', 1)).to.not.be.ok;
      expect('abc'.endsWith('b', 2)).to.be.ok;
      expect('abc'.endsWith('d', 2)).to.not.be.ok;
      expect('abc'.endsWith('dcd', 2)).to.not.be.ok;
      expect('abc'.endsWith('a', 42)).to.not.be.ok;
      expect('abc'.endsWith('bc', Infinity)).to.be.ok;
      expect('abc'.endsWith('a', Infinity)).to.not.be.ok;
      expect('abc'.endsWith('bc', undefined)).to.be.ok;
      expect('abc'.endsWith('bc', -43)).to.not.be.ok;
      expect('abc'.endsWith('bc', -Infinity)).to.not.be.ok;
      expect('abc'.endsWith('bc', NaN)).to.not.be.ok;

      var myobj = {
        toString: function() {return 'abc'},
        endsWith: String.prototype.endsWith
      };
      expect(myobj.endsWith('abc')).to.be.ok;
      expect(myobj.endsWith('ab')).to.not.be.ok;
      var gotStr = false, gotPos = false;

      myobj = {
        toString: function() {
          expect(gotPos).to.not.be.ok;
          gotStr = true;
          return 'xyz';
        },
        endsWith : String.prototype.endsWith
      };
      var idx = {
        valueOf: function () {
          expect(gotStr).to.be.ok;
          gotPos = true;
          return 42;
        }
      };
      myobj.endsWith('elephant', idx);
      expect(gotPos).to.be.ok;
    });
  });

  describe('#contains()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.contains('es')).to.be.ok;
      expect('abc'.contains('a')).to.be.ok;
      expect('abc'.contains('b')).to.be.ok;
      expect('abc'.contains('abc')).to.be.ok;
      expect('abc'.contains('bc')).to.be.ok;
      expect('abc'.contains('d')).to.not.be.ok;
      expect('abc'.contains('abcd')).to.not.be.ok;
      expect('abc'.contains('ac')).to.not.be.ok;
      expect('abc'.contains('abc', 0)).to.be.ok;
      expect('abc'.contains('bc', 0)).to.be.ok;
      expect('abc'.contains('de', 0)).to.not.be.ok;
      expect('abc'.contains('bc', 1)).to.be.ok;
      expect('abc'.contains('c', 1)).to.be.ok;
      expect('abc'.contains('a', 1)).to.not.be.ok;
      expect('abc'.contains('abc', 1)).to.not.be.ok;
      expect('abc'.contains('c', 2)).to.be.ok;
      expect('abc'.contains('d', 2)).to.not.be.ok;
      expect('abc'.contains('dcd', 2)).to.not.be.ok;
      expect('abc'.contains('a', 42)).to.not.be.ok;
      expect('abc'.contains('a', Infinity)).to.not.be.ok;
      expect('abc'.contains('ab', -43)).to.be.ok;
      expect('abc'.contains('cd', -42)).to.not.be.ok;
      expect('abc'.contains('ab', -Infinity)).to.be.ok;
      expect('abc'.contains('cd', -Infinity)).to.not.be.ok;
      expect('abc'.contains('ab', NaN)).to.be.ok;
      expect('abc'.contains('cd', NaN)).to.not.be.ok;

      var myobj = {
        toString: function() {return 'abc';},
        contains: String.prototype.contains
      };

      expect(myobj.contains('abc')).to.be.ok;
      expect(myobj.contains('cd')).to.not.be.ok;

      var gotStr = false, gotPos = false;

      myobj = {
        toString: function() {
          expect(gotPos).to.not.be.ok;
          gotStr = true;
          return 'xyz';
        },

        contains: String.prototype.contains
      };

      var idx = {
        valueOf: function() {
          expect(gotStr).to.be.ok;
          gotPos = true;
          return 42;
        }
      };

      myobj.contains('elephant', idx);
      expect(gotPos).to.be.ok;
    });

    it('should be falsy on incorrect results', function() {
      expect('test'.contains('1290')).to.not.be.ok;
    });
  });

  describe('.fromCodePoint()', function() {
    it('throws a RangeError', function() {
      var invalidValues = [
        'abc',
        {},
        -1,
        0x10FFFF + 1
      ];
      invalidValues.forEach(function(value) {
        expect(function() { return String.fromCodePoint(value); }).to.throw(RangeError);
      });
    });

    it('returns the empty string with no args', function() {
      expect(String.fromCodePoint()).to.equal('');
    });

    it('has a length of zero', function() {
      expect(String.fromCodePoint.length).to.equal(0);
    });

    it('works', function() {
      var codePoints = [];
      var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789…?!';
      for (var i = 0; i < chars.length; ++i) {
        codePoints.push(chars.charCodeAt(i));
        expect(String.fromCodePoint(chars.charCodeAt(i))).to.equal(chars[i]);
      }
      expect(String.fromCodePoint.apply(String, codePoints)).to.equal(chars);
    });

    it('works with unicode', function() {
      expect(String.fromCodePoint(0x2500)).to.equal("\u2500");
      expect(String.fromCodePoint(0x010000)).to.equal("\ud800\udc00");
      expect(String.fromCodePoint(0x10FFFF)).to.equal("\udbff\udfff");
    });
  });

  describe('#codePointAt()', function() {
    it('works', function() {
      var str = 'abc';
      expect(str.codePointAt(0)).to.equal(97);
      expect(str.codePointAt(1)).to.equal(98);
      expect(str.codePointAt(2)).to.equal(99);
    });

    it('works with unicode', function() {
      expect('\u2500'.codePointAt(0)).to.equal(0x2500);
      expect('\ud800\udc00'.codePointAt(0)).to.equal(0x10000);
      expect('\udbff\udfff'.codePointAt(0)).to.equal(0x10ffff);
      expect('\ud800\udc00\udbff\udfff'.codePointAt(0)).to.equal(0x10000);
      expect('\ud800\udc00\udbff\udfff'.codePointAt(1)).to.equal(0xdc00);
      expect('\ud800\udc00\udbff\udfff'.codePointAt(2)).to.equal(0x10ffff);
    });

    it('returns undefined when pos is negative or too large', function() {
      var str = 'abc';
      expect(str.codePointAt(-1)).to.be.undefined;
      expect(str.codePointAt(str.length)).to.be.undefined;
    });
  });

  describe('#raw()', function() {
    it('String.raw Works with Array', function() {
      var callSite = {};

      var str = 'The total is 10 ($11 with tax)';
      callSite.raw = ["The total is ", " ($", " with tax)"];
      expect(String.raw(callSite,10,11)).to.eql(str);

      str = 'The total is {total} (${total * 1.01} with tax)';
      callSite.raw = ["The total is ", " ($", " with tax)"];
      expect(String.raw(callSite,'{total}','{total * 1.01}')).to.eql(str);
    });

    it('String.raw Works with Objects , Keys as Integer', function() {
      var callSite = {};

      var str = 'The total is 10 ($11 with tax)';
      callSite.raw = {0 : "The total is ", 1 : " ($", 2 : " with tax)"};
      expect(String.raw(callSite,10,11)).to.eql(str);

      str = 'The total is {total} (${total * 1.01} with tax)';
      callSite.raw = {0 : "The total is ", 1 : " ($", 2 : " with tax)"};
      expect(String.raw(callSite,'{total}','{total * 1.01}')).to.eql(str);
    });

    it('String.raw Works with Objects , Keys as String', function() {
      var callSite = {};

      var str = 'The total is 10 ($11 with tax)';
      callSite.raw = {'0' : "The total is ", '1' : " ($", '2' : " with tax)"};
      expect(String.raw(callSite,10,11)).to.eql(str);

      str = 'The total is {total} (${total * 1.01} with tax)';
      callSite.raw = {'0' : "The total is ", '1' : " ($", '2' : " with tax)"};
      expect(String.raw(callSite,'{total}','{total * 1.01}')).to.eql(str);
    });

    it('String.raw ReturnIfAbrupt - Less Substitutions', function() {
      var callSite = {};  
      var str = 'The total is 10 ($';
      callSite.raw = {'0' : "The total is ", '1' : " ($", '2' : " with tax)"};
      expect(String.raw(callSite,10)).to.eql(str);
    });
     
    it('String.raw Empty objects', function() {
      var callSite = {};
      expect(String.raw(callSite,'{total}','{total * 1.01}')).to.eql('');
      expect(String.raw(callSite)).to.eql('');
    });
  });
});
