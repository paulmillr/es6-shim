if (typeof window !== 'undefined') {
  chai.Assertion.includeStack = true;
  window.expect = chai.expect;
  window.assert = chai.assert;
  mocha.setup('bdd');
}
