if (typeof window !== 'undefined') {
  window.expect = chai.expect;
  mocha.setup('bdd');
}
