/* global describe, it, xit, expect, require, beforeEach, afterEach */

describe('Function', function () {
  describe('#name', function () {
    it('returns the name for named functions', function () {
      var foo = function bar() {};
      expect(foo.name).to.equal('bar');
      expect(foo).to.have.ownPropertyDescriptor('name', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: 'bar'
      });
    });

    it('returns empty string for anonymous functions', function () {
      var anon = function () {};
      expect(anon.name).to.equal('');
      expect(anon).to.have.ownPropertyDescriptor('name', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: ''
      });
    });

    it('returns "anomymous" for Function functions', function () {
      /* eslint no-new-func: 1 */
      /* jshint evil: true */
      var func = Function('');
      /* jshint evil: false */
      expect(typeof func.name).to.equal('string');
      expect(func.name === 'anonymous' || func.name === '').to.equal(true);
      expect(func).to.have.ownPropertyDescriptor('name', {
        configurable: true,
        enumerable: false,
        writable: false,
        value: func.name
      });
    });
  });
});
