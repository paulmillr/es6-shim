var expect = require('expect.js');
require('../');

describe('Map', function() {
  var map;

  beforeEach(function() {
    map = Map();
  });

  it('should exist in global namespace', function() {
    expect(Map).to.be.ok();
  });
    
  it('should return true on values that set has', function() {
    map.set(1, 2);
    expect(map.has(1)).to.be.ok();
    expect(map.get(1)).to.equal(2);

    var arr = [1, 2, 3];
    map.set(arr, [3, 2, 1]);
    expect(map.has(arr)).to.be.ok();
    expect(map.get(arr)).to.eql([3, 2, 1]);

    var obj = {a: 1};
    map.set(obj, {b: 1});
    expect(map.has(obj)).to.be.ok();
    expect(map.get(obj)).to.eql({b: 1});
  });
    
  it('should return true on values that set has not', function() {
    map.set(1);
    expect(map.has(2)).to.not.be.ok();
  });
    
  it('should delete props', function() {
    map.set(1, 2);
    map.delete(1);
    expect(map.has(1)).to.not.be.ok();
  });
});
