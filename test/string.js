describe('String', function() {
  describe('#repeat()', function() {
    it('should work', function() {
      expect('test'.repeat(3)).to.eql('testtesttest');
    });
  });

  describe('#startsWith()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.startsWith('te')).to.be.ok;
    });

    it('should be falsy on incorrect results', function() {
      expect('test'.startsWith('st')).to.not.be.ok;
      expect(''.startsWith('/')).to.not.be.ok;
      expect('#'.startsWith('/')).to.not.be.ok;
      expect('##'.startsWith('///')).to.not.be.ok;
    });
  });

  describe('#endsWith()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.endsWith('st')).to.be.ok;
    })

    it('should be falsy on incorrect results', function() {
      expect('test'.endsWith('te')).to.not.be.ok;
      expect(''.endsWith('/')).to.not.be.ok;
      expect('#'.endsWith('/')).to.not.be.ok;
      expect('##'.endsWith('///')).to.not.be.ok;
    });
  });

  describe('#contains()', function() {
    it('should be truthy on correct results', function() {
      expect('test'.contains('es')).to.be.ok;
    });

    it('should be falsy on incorrect results', function() {
      expect('test'.contains('1290')).to.not.be.ok;
    });
  });
});
