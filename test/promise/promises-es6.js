/*global describe */

// tests from promises-es6-tests
(function () {
    'use strict';

    describe('Promises/ES6 Tests', function () {

        // an adapter that sets up global.Promise
        // since it's already set up, empty functions will suffice
        var adapter = {
            defineGlobalPromise: function () {
            },
            removeGlobalPromise: function () {
            }
        };

        require('promises-es6-tests').mocha(adapter);
    });

}());
