# ES6 Shim
Provides compatibility shims so that legacy JavaScript engines behave as
closely as possible to ECMAScript 6 (Harmony).

Project targets engines that support ES5 (Firefox, Chrome, Safari, Opera). With
[ES5-shim](https://github.com/kriskowal/es5-shim) it could also work in older
browsers.

## Installation

    npm install es6-shim

Or just include es6-shim before your scripts if you want to use it in browser.

## Safe shims
* Maps & Sets
* String.prototype.repeat, String.prototype.startsWith,
String.prototype.endsWith, String.prototype.contains, String.prototype.toArray
* Array.from, Array.of
* Number.isNaN, Number.toInteger, Number.isInteger, Number.isFinite
* Object.getOwnPropertyDescriptors, Object.getPropertyDescriptor,
Object.getPropertyNames, Object.is, Object.isnt
* Math.sign, Math.log10, Math.log2, Math.log1p, Math.expm1, Math.cosh,
Math.sinh, Math.tanh, Math.acosh, Math.asinh, Math.atanh, Math.hypot,
Math.trunc (accuracy is 1e-11).

## WeakMap shim
It is not possible to implement WeakMap in pure javascript.
[es6-collections](https://github.com/WebReflection/es6-collections)
implementation doesn't held values strongly which is critical
for the collection. es6-shim decided to not include incorrect shim.

WeakMap has very unusual use-case so you probably won't need it at all (
use simple `Map` instead).

es6-collections Map and Set are also implemented incorrectly and don't pass
all V8 collection tests.

## IE8 support
There are some shims that do not work in IE8, because it is simply not
possible to implement them properly:

* Object.getOwnPropertyDescriptors, Object.getPropertyDescriptor, Object.getPropertyNames

## Getting started

```javascript
'abc'.startsWith('a') // true
'abc'.endsWith('a') // false
Object.is(NaN, NaN) // Fixes ===. 0 isnt -0, NaN is NaN
'123'.repeat(2)     // '123123'
'123'.toArray()     // ['1', '2', '3']
'john alice'.contains('john') // true
Number.isNaN('123') // false. isNaN('123') will give true.
Number.toInteger(2.4) // 2. converts values to IEEE754 double precision integers
// Tests if value is a number, finite,
// >= -9007199254740992 && <= 9007199254740992 and floor(value) === value
Number.isInteger(2.4) // true.
Number.isFinite('asd') // false. Global isFinite() will give true.
Math.sign(400) // 1, 0 or -1 depending on sign. In this case 1.

// Replacement for `{}` key-value storage.
// Keys can be anything.
var map = new Map()
map.set('John', 25)
map.set('Alice', 400)
map.set(['meh'], 555)
map.get(['meh']) // undefined because you need to use exactly the same object.
map.delete('Alice')

// Useful for storing unique items.
var set = new Set()
set.add(1)
set.add(5)
set.has(1)
set.has(4)  // => false
set.delete(5)
```

## License
The project was initially based on [es6-shim by Axel Rauschmayer](https://github.com/rauschma/es6-shim).

The MIT License (MIT)

Copyright (c) Paul Miller (http://paulmillr.com)

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
