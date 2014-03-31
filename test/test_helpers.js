expect = (function() {
  var chai = require('chai');
  chai.config.includeStack = true;
  return chai.expect;
})();
assert = (function() {
  var chai = require('chai');
  chai.config.includeStack = true;
  return chai.assert;
})();
require('../');

