test:
	./node_modules/mocha/bin/mocha --reporter spec --require "test/test_helpers.js"

.PHONY: test
