expect = (function() {
  var chai = require('chai');
  chai.Assertion.includeStack = true;
  return chai.expect;
})();
assert = (function() {
  var chai = require('chai');
  chai.Assertion.includeStack = true;
  return chai.assert;
})();
require('../');

