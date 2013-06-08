if (typeof window !== 'undefined') {
  window.onload = function() {
    window.testsPassed = null;
    var handleResults = function(runner) {
      if (runner.stats.end) {
        window.testsPassed = (runner.stats.failures === 0);
      }
      runner.on('fail', function(test, err){
        window.testsPassed = false;
      });
      runner.on('end', function(){
        window.testsPassed = (window.testsPassed == null);
      });
      return runner;
    };
    handleResults(mocha.run());
  };
}
