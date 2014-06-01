describe('Worker', function() {
  var undefined,
    workerErrorEventToError = function (errorEvent) {
      var errorText = "Error in Worker";
      if (errorEvent.filename !== undefined) {
        errorText += " " + errorEvent.filename;
      }
      if (errorEvent.lineno !== undefined) {
        errorText += "(" + errorEvent.lineno + ")";
      }
      if (errorEvent.message !== undefined) {
        errorText += ": " + errorEvent.message;
      }
      return new Error(errorText);
    };

  if (typeof Worker !== 'undefined') {
    it('can import es6-shim', function (done) {
      var worker = new Worker('worker-runner.workerjs');
      worker.addEventListener('error', function (errorEvent) { throw workerErrorEventToError(errorEvent); });
      worker.addEventListener('message', function (messageEvent) {
        expect(messageEvent.data).to.eql('ready');
        done();
      });
    });
  }
});
