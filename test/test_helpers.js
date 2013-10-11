expect = (function() {
  var chai = require('chai');
  chai.Assertion.includeStack = true;
  return chai.expect;
})();
require('../');

