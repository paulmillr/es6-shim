var chai = require('chai'),
    Assertion = chai.Assertion;

expect = chai.expect;

Assertion.addMethod('theSameSet', function (otherArray) {
    var array = this._obj;

    expect(Array.isArray(array)).to.equal(true);
    expect(Array.isArray(otherArray)).to.equal(true);

    var diff = array.filter(function (value) {
        return !otherArray.some(function (otherValue) {
            var areBothNaN = typeof value === 'number' && typeof otherValue === 'number' && value !== value && otherValue !== otherValue;
            return areBothNaN || value === otherValue;
        });
    });

    this.assert(
        diff.length === 0,
        "expected #{this} to be equal to #{exp} (as sets, i.e. no order)",
        array,
        otherArray
    );
});

require('../');

