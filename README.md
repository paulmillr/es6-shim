# ES6 Shim
Provides compatibility shims so that legacy JavaScript engines behave as
closely as possible to ECMAScript 6 (Harmony).

Project targets engines that support ES5 (Firefox, Chrome, Safari, Opera). With
[ES5-shim](https://github.com/kriskowal/es5-shim) it could also work in older
browsers.

## Installation

    npm install es6-shim

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
Math.trunc

## IE8 support
There are some shims that do not work in IE8, because it is simply not
possible to implement them properly:

* Object.getOwnPropertyDescriptors, Object.getPropertyDescriptor, Object.getPropertyNames

## License
The project was initially based on [es6-shim by Axel Rauschmayer](https://github.com/rauschma/es6-shim).

The MIT License (MIT)

Copyright (c) 2012 Paul Miller (http://paulmillr.com)

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
