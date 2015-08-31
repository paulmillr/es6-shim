/* global describe, it, expect, require */
describe('JSON', function () {
  var functionsHaveNames = (function foo() {}).name === 'foo';
  var ifFunctionsHaveNamesIt = functionsHaveNames ? it : xit;
  var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
  var ifSymbolsIt = hasSymbols ? it : xit;

  describe('.stringify()', function () {
    ifSymbolsIt('serializes Symbols in an Array to null', function () {
      expect(JSON.stringify([Symbol('foo')])).to.eql('[null]');
    });

    ifSymbolsIt('skips symbol properties in an object', function () {
      var obj = {};
      var enumSym = Symbol('enumerable');
      var nonenum = Symbol('non-enumerable');
      obj[enumSym] = true;
      Object.defineProperty(obj, nonenum, { enumerable: false, value: true });
      expect(Object.getOwnPropertySymbols(obj)).to.eql([enumSym, nonenum]);
      expect(JSON.stringify(obj)).to.eql('{}');
    });
  });
});
