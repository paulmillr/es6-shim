if (typeof window !== 'undefined') {
  chai.Assertion.includeStack = true;
  window.expect = chai.expect;
  mocha.setup('bdd');
}
