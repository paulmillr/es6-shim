var expect = require('expect.js');
require('../');

describe('Set', function() {
  var set;

  beforeEach(function() {
    set = Set();
  });

  it('should exist in global namespace', function() {
    expect(Set).to.be.ok();
  });
    
  it('should return true on values that set has', function() {
    set.add(1);
    expect(set.has(1)).to.be.ok();

    var arr = [1, 2, 3];
    set.add(arr);
    expect(set.has(arr)).to.be.ok();

    var obj = {a: 1};
    set.add(obj);
    expect(set.has(obj)).to.be.ok();
  });
    
  it('should return true on values that set has not', function() {
    set.add(1);
    expect(set.has(2)).to.not.be.ok();
  });
    
  it('should delete props', function() {
    set.add(1);
    set.delete(1);
    expect(set.has(1)).to.not.be.ok();
  });
  
  //describe('Set.of()', function() {
  //  it('should create new set from iterable', function() {
  //    expect(Set.of([1, 2, 3, 4, 5, 4, 3, 2, 1])).to.eql([
  //      1, 2, 3, 4, 5
  //    ]);
  //  });
  //});
});
