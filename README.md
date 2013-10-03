<a href="https://jepso-ci.com/paulmillr/es6-shim"><img src="https://jepso-ci.com/paulmillr/es6-shim.svg" align="right" alt="jepso-ci status" /></a>
# ES6 Shim
Provides compatibility shims so that legacy JavaScript engines behave as
closely as possible to ECMAScript 6 (Harmony).

[![Build Status][1]][2] [![dependency status][3]][4] [![dev dependency status][5]][6]

[![browser support](https://ci.testling.com/paulmillr/es6-shim.png)](https://ci.testling.com/paulmillr/es6-shim)

## Installation
If you want to use it in browser:

* Just include es6-shim before your scripts.
* Include [es5-shim](https://github.com/kriskowal/es5-shim) if your browser doesn't support ECMAScript 5.
* `component install paulmillr/es6-shim` if you’re using [component(1)](https://github.com/component/component).
* `bower install es6-shim` if you’re using [Twitter Bower](http://bower.io/).

For node.js:

    npm install es6-shim

## Safe shims

* `Map`, `Set`
* `String`:
    * `fromCodePoint()`
    * `raw()`
* `String.prototype`:
    * `codePointAt()`
    * `repeat()`
    * `startsWith()`
    * `endsWith()`
    * `contains()`
* `Number`:
    * `MAX_SAFE_INTEGER`
    * `EPSILON`
    * `parseInt()`
    * `parseFloat()`
    * `isNaN()`
    * `isSafeInteger()`
    * `isFinite()`
* `Number.prototype`:
    * `clz()`
* `Array`:
    * `from()`
    * `of()`
* `Array.prototype`:
    * `find()`
    * `findIndex()`
    * `keys()` (note: keys/values/entries return an `ArrayIterator` object)
    * `entries()`
    * `values()`
* `Object`:
    * `getOwnPropertyDescriptors()` (ES5)
    * `getPropertyDescriptor()` (ES5)
    * `getPropertyNames()` (ES5)
    * `is()`
    * `assign()`
    * `mixin()` (ES5)
* `Math`:
    * `sign()`
    * `log10()`
    * `log2()`
    * `log1p()`
    * `expm1()`
    * `cosh()`
    * `sinh()`
    * `tanh()`
    * `acosh()`
    * `asinh()`
    * `atanh()`
    * `hypot()`
    * `trunc()`
    * `imul()`

Math functions accuracy is 1e-11.

## WeakMap shim
It is not possible to implement WeakMap in pure javascript.
The [es6-collections](https://github.com/WebReflection/es6-collections)
implementation doesn't hold values strongly, which is critical
for the collection. es6-shim decided to not include an incorrect shim.

WeakMap has a very unusual use-case so you probably won't need it at all
(use simple `Map` instead).

## Getting started

```javascript
'abc'.startsWith('a') // true
'abc'.endsWith('a') // false
'john alice'.contains('john') // true
'123'.repeat(2)     // '123123'

Object.is(NaN, NaN) // Fixes ===. 0 isnt -0, NaN is NaN
Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}
Object.mixin({a: 1}, {get b: function() {return 2}}) // {a: 1, b: getter}

Number.isNaN('123') // false. isNaN('123') will give true.
Number.isFinite('asd') // false. Global isFinite() will give true.
Number.toInteger(2.4) // 2. converts values to IEEE754 double precision integers
// Tests if value is a number, finite,
// >= -9007199254740992 && <= 9007199254740992 and floor(value) === value
Number.isInteger(2.4) // false.

Math.sign(400) // 1, 0 or -1 depending on sign. In this case 1.

[5, 10, 15, 10].find(function(item) {return item / 2 === 5;}) // 10
[5, 10, 15, 10].findIndex(function(item) {return item / 2 === 5;}) // 1

// Replacement for `{}` key-value storage.
// Keys can be anything.
var map = new Map()
map.set('John', 25)
map.set('Alice', 400)
map.set(['meh'], 555)
map.get(['meh']) // undefined because you need to use exactly the same object.
map.delete('Alice')
map.keys()
map.values()
map.size // 2

// Useful for storing unique items.
var set = new Set()
set.add(1)
set.add(5)
set.has(1)
set.has(4)  // => false
set.delete(5)
```

Other stuff:

* [ECMAScript 6 drafts](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)
* [Harmony proposals](http://wiki.ecmascript.org/doku.php?id=harmony:harmony)

## License
The project was initially based on [es6-shim by Axel Rauschmayer](https://github.com/rauschma/es6-shim).

The MIT License (MIT)

Copyright (c) 2013 Paul Miller (http://paulmillr.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[1]: https://travis-ci.org/paulmillr/es6-shim.png
[2]: https://travis-ci.org/paulmillr/es6-shim
[3]: https://david-dm.org/paulmillr/es6-shim.png
[4]: https://david-dm.org/paulmillr/es6-shim
[5]: https://david-dm.org/paulmillr/es6-shim/dev-status.png
[6]: https://david-dm.org/paulmillr/es6-shim#info=devDependencies

