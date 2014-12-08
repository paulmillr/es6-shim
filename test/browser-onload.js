/*global window, mocha */

if (typeof window !== 'undefined') {
  window.completedTests = 0;
  window.sawFail = false;
  window.onload = function () {
    window.testsPassed = null;
    var handleResults = function (runner) {
      var failedTests = [];
      if (runner.stats.end) {
        window.testsPassed = (runner.stats.failures === 0);
      }
      runner.on('pass', function (test) {
        window.completedTests++;
      });
      runner.on('fail', function (test, err) {
        window.sawFail = true;
        var flattenTitles = function (test) {
          var titles = [];
          while (test.parent.title) {
            titles.push(test.parent.title);
            test = test.parent;
          }
          return titles.reverse();
        };
        failedTests.push({
          name: test.title, result: false, message: err.message,
          stack: err.stack, titles: flattenTitles(test)
        });
      });
      runner.on('end', function () {
        window.testsPassed = !window.sawFail;
        // for sauce
        window.mochaResults = runner.stats;
        window.mochaResults.reports = failedTests;
      });
      return runner;
    };
    handleResults(mocha.run());
  };
}
