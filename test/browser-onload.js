if (typeof window !== 'undefined') {
  window.completedTests = 0;
  window.sawFail = false;
  window.onload = function() {
    window.testsPassed = null;
    var handleResults = function(runner) {
      if (runner.stats.end) {
        window.testsPassed = (runner.stats.failures === 0);
      }
      runner.on('pass', function(test) {
        window.completedTests++;
      });
      runner.on('fail', function(test, err) {
        window.sawFail = true;
      });
      runner.on('end', function() {
        window.testsPassed = !window.sawFail;
      });
      return runner;
    };
    handleResults(mocha.run());
  };
}
