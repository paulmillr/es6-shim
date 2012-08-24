// ES6-shim 0.5.2 (c) 2012 Paul Miller (paulmillr.com)
// ES6-shim may be freely distributed under the MIT license.
// For more details and documentation:
// https://github.com/paulmillr/es6-shim/
({define: (typeof define === 'function')
    ? define  // RequireJS
    : function(definition) {definition();} // CommonJS and <script>
}).define(function() {
  'use strict';

  var globals = (typeof global === 'undefined') ? window : global;
  var global_isFinite = globals.isFinite;
  var factorial = function(value) {
    var result = 1;
    for (var i = 2; i <= value; i++) {
      result *= i;
    }
    return result;
  };

  var defineProperty = function(object, name, method) {
    if (!object[name]) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: method
      });
    }
  };

  var defineProperties = function(object, map) {
    Object.keys(map).forEach(function(name) {
      defineProperty(object, name, map[name]);
    });
  };

  defineProperties(String.prototype, {
    // Fast repeat, uses the `Exponentiation by squaring` algorithm.
    repeat: function(times) {
      if (times < 1) return '';
      if (times % 2) return this.repeat(times - 1) + this;
      var half = this.repeat(times / 2);
      return half + half;
    },

    startsWith: function(substring) {
      return this.lastIndexOf(substring, 0) === 0;
    },

    endsWith: function(substring) {
      var startFrom = this.length - String(substring).length;
      return startFrom >= 0 && this.indexOf(substring, startFrom) === startFrom;
    },

    contains: function(substring) {
      return this.indexOf(substring) !== -1;
    }
  });

  defineProperties(Array, {
    from: function(iterable) {
      var object = Object(iterable);
      var array = [];

      for (var key = 0, length = object.length >>> 0; key < length; key++) {
        if (key in object) {
          array[key] = object[key];
        }
      }

      return array;
    },

    of: function() {
      return Array.prototype.slice.call(arguments);
    }
  });

  defineProperties(Number, {
    MAX_INTEGER: 9007199254740992,
    EPSILON: 2.220446049250313e-16,

    parseInt: globals.parseInt,
    parseFloat: globals.parseFloat,

    isFinite: function(value) {
      return typeof value === 'number' && global_isFinite(value);
    },

    isInteger: function(value) {
      return Number.isFinite(value) &&
        value >= -9007199254740992 && value <= Number.MAX_INTEGER &&
        Math.floor(value) === value;
    },

    isNaN: function(value) {
      return Object.is(value, NaN);
    },

    toInteger: function(value) {
      var number = +value;
      if (Object.is(number, NaN)) return +0;
      if (number === 0 || !Number.isFinite(number)) return number;
      return Math.sign(number) * Math.floor(Math.abs(number));
    }
  });

  defineProperties(Number.prototype, {
    clz: function() {
      var number = +this;
      if (!number || !Number.isFinite(number)) return 32;
      number = number < 0 ? Math.ceil(number) : Math.floor(number);
      number = number - Math.floor(number / 0x100000000) * 0x100000000;
      return 32 - (number).toString(2).length;
    }
  });

  defineProperties(Object, {
    getOwnPropertyDescriptors: function(subject) {
      var descs = {};
      Object.getOwnPropertyNames(subject).forEach(function(propName) {
        descs[propName] = Object.getOwnPropertyDescriptor(subject, propName);
      });
      return descs;
    },

    getPropertyDescriptor: function(subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (pd === undefined && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    },

    getPropertyNames: function(subject, name) {
      var result = Object.getOwnPropertyNames(subject);
      var proto = Object.getPrototypeOf(subject);
      var property;
      while (proto !== null) {
        Object.getOwnPropertyNames(proto).forEach(function(property) {
          if (result.indexOf(property) === -1) {
            result.push(property);
          }
        });
        proto = Object.getPrototypeOf(proto);
      }
      return result;
    },

    is: function(x, y) {
      if (x === y) {
        // 0 === -0, but they are not identical.
        if (x === 0) {
          return 1 / x === 1 / y;
        } else {
          return true;
        }
      }

      // NaN !== NaN, but they are identical.
      // NaNs are the only non-reflexive value, i.e., if x !== x,
      // then x is a NaN.
      // isNaN is broken: it converts its argument to number, so
      // isNaN('foo') => true
      return x !== x && y !== y;
    },
    
    isnt: function(x, y) {
      return !Object.is(x, y);
    }
  });  
  
  defineProperties(Math, {
    sign: function(value) {
      var number = +value;
      if (number === 0 || Object.is(number, NaN)) return number;
      return (number < 0) ? -1 : 1;
    },
    
    trunc: function(value) {
      if (value === 0 || Object.is(value, NaN) || Object.is(value, Infinity)
      || Object.is(value, -Infinity)) {
        return value;
      }

      return ~~value;
    }
  });

  var mathFns = (function() {
    /**
      * ES6 math functions translated from C code
      * of [fdlibm](http://www.netlib.org/fdlibm/).
      *
      * ===========================================
      *
      * Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
      *
      * Developed at SunSoft, a Sun Microsystems, Inc. business.
      * Permission to use, copy, modify, and distribute this
      * software is freely granted, provided that this notice 
      * is preserved.
    **/

    function toInt32(n) {
      return n | 0;
    }

    function numberToInt32(number, w) {
      number = Number(number);

      var s, e, f, hi, lo;

      if (isNaN(number)) {
        //!!! one of possible values
        hi = 0x7ff00000;
        lo = 0;
      } else {
        if (isFinite(number)) {
          s = 1 / number < 0 ? 1 : 0;
          number = Math.abs(number);
          e = Math.floor(Math.log(number) / Math.log(2)) - 1;
          while (e !== -Infinity && e < 1023 && Math.pow(2, e + 1) <= number) {
            e += 1;
          }
          e += 1023;
          if (e > 0) {
            f = (number * Math.pow(2, 1023 - e) - 1) * Math.pow(2, 52);
          } else {
            e = 0;
            f = number * Math.pow(2, 1022 - e) * Math.pow(2, 52);
          }
        } else {
          s = number < 0 ? 1 : 0;
          e = 2047;
          f = 0;
        }
        hi = s * Math.pow(2, 31) + e * Math.pow(2, 20) + Math.floor(f / Math.pow(2, 32));
        lo = f % Math.pow(2, 32);
      }

      return toInt32(w ? hi : lo);
    }

    function makeNumber(hi, lo) {
      var s, e, f;
      if (isNaN(hi)) {
        return hi;
      }
      hi >>>= 0;
      lo >>>= 0;
      s = hi >>> 31;
      e = (hi >>> 20) & 0xfff;
      f = (hi & 0xfffff) * Math.pow(2, 32) + lo;
      if (e === 2047) {
        return (s ? -1 : 1) * (f ? NaN : Infinity);
      } else {
        if (e > 0) {
          return (s ? -1 : 1) * (f * Math.pow(2, - 52) + 1) * Math.pow(2, e - 1023);
        } else {
          return (s ? -1 : 1) * f * Math.pow(2, - 52) * Math.pow(2, e - 1022); // e === 0
        }
      }
    }

    function __HI(x) {
      return numberToInt32(x, 1);
    }

    function __LO(x) {
      return numberToInt32(x, 0);
    }

    // http://www.netlib.org/fdlibm/e_log10.c
    /* @(#)e_log10.c 1.3 95/01/18 */
    /* __ieee754_log10(x)
     * Return the base 10 logarithm of x
     * 
     * Method :
     *	Let log10_2hi = leading 40 bits of log10(2) and
     *	    log10_2lo = log10(2) - log10_2hi,
     *	    ivln10   = 1/log(10) rounded.
     *	Then
     *		n = ilogb(x), 
     *		if(n<0)  n = n+1;
     *		x = scalbn(x,-n);
     *		log10(x) := n*log10_2hi + (n*log10_2lo + ivln10*log(x))
     *
     * Note 1:
     *	To guarantee log10(10**n)=n, where 10**n is normal, the rounding 
     *	mode must set to Round-to-Nearest.
     * Note 2:
     *	[1/log(10)] rounded to 53 bits has error  .198   ulps;
     *	log10 is monotonic at all binary break points.
     *
     * Special cases:
     *	log10(x) is NaN with signal if x < 0; 
     *	log10(+INF) is +INF with no signal; log10(0) is -INF with signal;
     *	log10(NaN) is that NaN with no signal;
     *	log10(10**N) = N  for N=0,1,...,22.
     *
     * Constants:
     * The hexadecimal values are the intended ones for the following constants.
     * The decimal values may be used, provided that the compiler will convert
     * from decimal to binary accurately enough to produce the hexadecimal values
     * shown.
     */

    var two54 = 1.80143985094819840000e+16; /* 0x43500000, 0x00000000 */
    var ivln10 = 4.34294481903251816668e-01; /* 0x3FDBCB7B, 0x1526E50E */
    var log10_2hi = 3.01029995663611771306e-01; /* 0x3FD34413, 0x509F6000 */
    var log10_2lo = 3.69423907715893078616e-13; /* 0x3D59FEF3, 0x11F12B36 */

    var zero = 0.0;

    function log10(x) {
      x = Number(x);
      var y, z;
      var i, k, hx; // int
      var lx; // unsigned

      hx = __HI(x); /* high word of x */
      lx = __LO(x); /* low word of x */

      k = 0;
      if (hx < 0x00100000) { /* x < 2**-1022  */
        if (((hx & 0x7fffffff) | lx) == 0) return -two54 / zero; /* log(+-0)=-inf */
        if (hx < 0) return (x - x) / zero; /* log(-#) = NaN */
        k -= 54;
        x *= two54; /* subnormal number, scale up x */
        hx = __HI(x); /* high word of x */
      }
      if (hx >= 0x7ff00000) return x + x;
      k += (hx >> 20) - 1023;
      i = (k & 0x80000000) >>> 31;
      hx = (hx & 0x000fffff) | ((0x3ff - i) << 20);
      y = (k + i);
      x = makeNumber(hx, __LO(x));
      z = y * log10_2lo + ivln10 * Math.log(x);
      return z + y * log10_2hi;
    }

    // http://www.netlib.org/fdlibm/s_log1p.c
    /* @(#)s_log1p.c 1.3 95/01/18 */

    /* double log1p(double x)
     *
     * Method :                  
     *   1. Argument Reduction: find k and f such that 
     *			1+x = 2^k * (1+f), 
     *	   where  sqrt(2)/2 < 1+f < sqrt(2) .
     *
     *      Note. If k=0, then f=x is exact. However, if k!=0, then f
     *	may not be representable exactly. In that case, a correction
     *	term is need. Let u=1+x rounded. Let c = (1+x)-u, then
     *	log(1+x) - log(u) ~ c/u. Thus, we proceed to compute log(u),
     *	and add back the correction term c/u.
     *	(Note: when x > 2**53, one can simply return log(x))
     *
     *   2. Approximation of log1p(f).
     *	Let s = f/(2+f) ; based on log(1+f) = log(1+s) - log(1-s)
     *		 = 2s + 2/3 s**3 + 2/5 s**5 + .....,
     *	     	 = 2s + s*R
     *      We use a special Reme algorithm on [0,0.1716] to generate 
     * 	a polynomial of degree 14 to approximate R The maximum error 
     *	of this polynomial approximation is bounded by 2**-58.45. In
     *	other words,
     *		        2      4      6      8      10      12      14
     *	    R(z) ~ Lp1*s +Lp2*s +Lp3*s +Lp4*s +Lp5*s  +Lp6*s  +Lp7*s
     *  	(the values of Lp1 to Lp7 are listed in the program)
     *	and
     *	    |      2          14          |     -58.45
     *	    | Lp1*s +...+Lp7*s    -  R(z) | <= 2 
     *	    |                             |
     *	Note that 2s = f - s*f = f - hfsq + s*hfsq, where hfsq = f*f/2.
     *	In order to guarantee error in log below 1ulp, we compute log
     *	by
     *		log1p(f) = f - (hfsq - s*(hfsq+R)).
     *	
     *	3. Finally, log1p(x) = k*ln2 + log1p(f).  
     *		 	     = k*ln2_hi+(f-(hfsq-(s*(hfsq+R)+k*ln2_lo)))
     *	   Here ln2 is split into two floating point number: 
     *			ln2_hi + ln2_lo,
     *	   where n*ln2_hi is always exact for |n| < 2000.
     *
     * Special cases:
     *	log1p(x) is NaN with signal if x < -1 (including -INF) ; 
     *	log1p(+INF) is +INF; log1p(-1) is -INF with signal;
     *	log1p(NaN) is that NaN with no signal.
     *
     * Accuracy:
     *	according to an error analysis, the error is always less than
     *	1 ulp (unit in the last place).
     *
     * Constants:
     * The hexadecimal values are the intended ones for the following 
     * constants. The decimal values may be used, provided that the 
     * compiler will convert from decimal to binary accurately enough 
     * to produce the hexadecimal values shown.
     *
     * Note: Assuming log() return accurate answer, the following
     * 	 algorithm can be used to compute log1p(x) to within a few ULP:
     *	
     *		u = 1+x;
     *		if(u==1.0) return x ; else
     *			   return log(u)*(x/(u-1.0));
     *
     *	 See HP-15C Advanced Functions Handbook, p.193.
     */


    var ln2_hi = 6.93147180369123816490e-01; /* 3fe62e42 fee00000 */
    var ln2_lo = 1.90821492927058770002e-10; /* 3dea39ef 35793c76 */
    var two54 = 1.80143985094819840000e+16; /* 43500000 00000000 */
    var Lp1 = 6.666666666666735130e-01; /* 3FE55555 55555593 */
    var Lp2 = 3.999999999940941908e-01; /* 3FD99999 9997FA04 */
    var Lp3 = 2.857142874366239149e-01; /* 3FD24924 94229359 */
    var Lp4 = 2.222219843214978396e-01; /* 3FCC71C5 1D8E78AF */
    var Lp5 = 1.818357216161805012e-01; /* 3FC74664 96CB03DE */
    var Lp6 = 1.531383769920937332e-01; /* 3FC39A09 D078C69F */
    var Lp7 = 1.479819860511658591e-01; /* 3FC2F112 DF3E5244 */

    var zero = 0.0;

    function log1p(x) {
      x = Number(x);
      var hfsq, f, c, s, z, R, u;
      var k, hx, hu, ax; // int

      hx = __HI(x); /* high word of x */
      ax = hx & 0x7fffffff;

      k = 1;
      if (hx < 0x3FDA827A) { /* x < 0.41422  */
        if (ax >= 0x3ff00000) { /* x <= -1.0 */
          if (x == -1.0) return -two54 / zero; /* log1p(-1)=+inf */
          else return (x - x) / (x - x); /* log1p(x<-1)=NaN */
        }
        if (ax < 0x3e200000) { /* |x| < 2**-29 */
          if (two54 + x > zero /* raise inexact */ && ax < 0x3c900000) /* |x| < 2**-54 */
          return x;
          else return x - x * x * 0.5;
        }
        if (hx > 0 || hx <= (toInt32(0xbfd2bec3))) {
          k = 0;
          f = x;
          hu = 1;
        } /* -0.2929<x<0.41422 */
      }
      if (hx >= 0x7ff00000) return x + x;
      if (k != 0) {
        if (hx < 0x43400000) {
          u = 1.0 + x;
          hu = __HI(u); /* high word of u */
          k = (hu >> 20) - 1023;
          c = (k > 0) ? 1.0 - (u - x) : x - (u - 1.0); /* correction term */
          c /= u;
        } else {
          u = x;
          hu = __HI(u); /* high word of u */
          k = (hu >> 20) - 1023;
          c = 0;
        }
        hu &= 0x000fffff;
        if (hu < 0x6a09e) {
          u = makeNumber(hu | 0x3ff00000, __LO(u)); /* normalize u */
        } else {
          k += 1;
          u = makeNumber(hu | 0x3fe00000, __LO(u)); /* normalize u/2 */
          hu = (0x00100000 - hu) >> 2;
        }
        f = u - 1.0;
      }
      hfsq = 0.5 * f * f;
      if (hu == 0) { /* |f| < 2**-20 */
        if (f == zero) if (k == 0) return zero;
        else {
          c += k * ln2_lo;
          return k * ln2_hi + c;
        }
        R = hfsq * (1.0 - 0.66666666666666666 * f);
        if (k == 0) return f - R;
        else return k * ln2_hi - ((R - (k * ln2_lo + c)) - f);
      }
      s = f / (2.0 + f);
      z = s * s;
      R = z * (Lp1 + z * (Lp2 + z * (Lp3 + z * (Lp4 + z * (Lp5 + z * (Lp6 + z * Lp7))))));
      if (k == 0) return f - (hfsq - s * (hfsq + R));
      else return k * ln2_hi - ((hfsq - (s * (hfsq + R) + (k * ln2_lo + c))) - f);
    }

    // http://www.netlib.org/fdlibm/s_expm1.c

    /* @(#)s_expm1.c 1.5 04/04/22 */
    /*
     * ====================================================
     * Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
     *
     * Permission to use, copy, modify, and distribute this
     * software is freely granted, provided that this notice 
     * is preserved.
     * ====================================================
     */

    /* expm1(x)
     * Returns exp(x)-1, the exponential of x minus 1.
     *
     * Method
     *   1. Argument reduction:
     *	Given x, find r and integer k such that
     *
     *               x = k*ln2 + r,  |r| <= 0.5*ln2 ~ 0.34658  
     *
     *      Here a correction term c will be computed to compensate 
     *	the error in r when rounded to a floating-point number.
     *
     *   2. Approximating expm1(r) by a special rational function on
     *	the interval [0,0.34658]:
     *	Since
     *	    r*(exp(r)+1)/(exp(r)-1) = 2+ r^2/6 - r^4/360 + ...
     *	we define R1(r*r) by
     *	    r*(exp(r)+1)/(exp(r)-1) = 2+ r^2/6 * R1(r*r)
     *	That is,
     *	    R1(r**2) = 6/r *((exp(r)+1)/(exp(r)-1) - 2/r)
     *		     = 6/r * ( 1 + 2.0*(1/(exp(r)-1) - 1/r))
     *		     = 1 - r^2/60 + r^4/2520 - r^6/100800 + ...
     *      We use a special Remes algorithm on [0,0.347] to generate 
     * 	a polynomial of degree 5 in r*r to approximate R1. The 
     *	maximum error of this polynomial approximation is bounded 
     *	by 2**-61. In other words,
     *	    R1(z) ~ 1.0 + Q1*z + Q2*z**2 + Q3*z**3 + Q4*z**4 + Q5*z**5
     *	where 	Q1  =  -1.6666666666666567384E-2,
     * 		Q2  =   3.9682539681370365873E-4,
     * 		Q3  =  -9.9206344733435987357E-6,
     * 		Q4  =   2.5051361420808517002E-7,
     * 		Q5  =  -6.2843505682382617102E-9;
     *  	(where z=r*r, and the values of Q1 to Q5 are listed below)
     *	with error bounded by
     *	    |                  5           |     -61
     *	    | 1.0+Q1*z+...+Q5*z   -  R1(z) | <= 2 
     *	    |                              |
     *	
     *	expm1(r) = exp(r)-1 is then computed by the following 
     * 	specific way which minimize the accumulation rounding error: 
     *			       2     3
     *			      r     r    [ 3 - (R1 + R1*r/2)  ]
     *	      expm1(r) = r + --- + --- * [--------------------]
     *		              2     2    [ 6 - r*(3 - R1*r/2) ]
     *	
     *	To compensate the error in the argument reduction, we use
     *		expm1(r+c) = expm1(r) + c + expm1(r)*c 
     *			   ~ expm1(r) + c + r*c 
     *	Thus c+r*c will be added in as the correction terms for
     *	expm1(r+c). Now rearrange the term to avoid optimization 
     * 	screw up:
     *		        (      2                                    2 )
     *		        ({  ( r    [ R1 -  (3 - R1*r/2) ]  )  }    r  )
     *	 expm1(r+c)~r - ({r*(--- * [--------------------]-c)-c} - --- )
     *	                ({  ( 2    [ 6 - r*(3 - R1*r/2) ]  )  }    2  )
     *                      (                                             )
     *    	
     *		   = r - E
     *   3. Scale back to obtain expm1(x):
     *	From step 1, we have
     *	   expm1(x) = either 2^k*[expm1(r)+1] - 1
     *		    = or     2^k*[expm1(r) + (1-2^-k)]
     *   4. Implementation notes:
     *	(A). To save one multiplication, we scale the coefficient Qi
     *	     to Qi*2^i, and replace z by (x^2)/2.
     *	(B). To achieve maximum accuracy, we compute expm1(x) by
     *	  (i)   if x < -56*ln2, return -1.0, (raise inexact if x!=inf)
     *	  (ii)  if k=0, return r-E
     *	  (iii) if k=-1, return 0.5*(r-E)-0.5
     *        (iv)	if k=1 if r < -0.25, return 2*((r+0.5)- E)
     *	       	       else	     return  1.0+2.0*(r-E);
     *	  (v)   if (k<-2||k>56) return 2^k(1-(E-r)) - 1 (or exp(x)-1)
     *	  (vi)  if k <= 20, return 2^k((1-2^-k)-(E-r)), else
     *	  (vii) return 2^k(1-((E+2^-k)-r)) 
     *
     * Special cases:
     *	expm1(INF) is INF, expm1(NaN) is NaN;
     *	expm1(-INF) is -1, and
     *	for finite argument, only expm1(0)=0 is exact.
     *
     * Accuracy:
     *	according to an error analysis, the error is always less than
     *	1 ulp (unit in the last place).
     *
     * Misc. info.
     *	For IEEE double 
     *	    if x >  7.09782712893383973096e+02 then expm1(x) overflow
     *
     * Constants:
     * The hexadecimal values are the intended ones for the following 
     * constants. The decimal values may be used, provided that the 
     * compiler will convert from decimal to binary accurately enough
     * to produce the hexadecimal values shown.
     */

    var one = 1.0;
    var huge = 1.0e+300;
    var tiny = 1.0e-300;
    var o_threshold = 7.09782712893383973096e+02; /* 0x40862E42, 0xFEFA39EF */
    var ln2_hi = 6.93147180369123816490e-01; /* 0x3fe62e42, 0xfee00000 */
    var ln2_lo = 1.90821492927058770002e-10; /* 0x3dea39ef, 0x35793c76 */
    var invln2 = 1.44269504088896338700e+00; /* 0x3ff71547, 0x652b82fe */
    /* scaled coefficients related to expm1 */
    var Q1 = -3.33333333333331316428e-02; /* BFA11111 111110F4 */
    var Q2 = 1.58730158725481460165e-03; /* 3F5A01A0 19FE5585 */
    var Q3 = -7.93650757867487942473e-05; /* BF14CE19 9EAADBB7 */
    var Q4 = 4.00821782732936239552e-06; /* 3ED0CFCA 86E65239 */
    var Q5 = -2.01099218183624371326e-07; /* BE8AFDB7 6E09C32D */

    function expm1(x) {
      x = Number(x);
      var y, hi, lo, c, t, e, hxs, hfx, r1;
      var k, xsb; // int
      var hx; // unsigned

      hx = __HI(x) >>> 0; /* high word of x */
      xsb = hx & 0x80000000; /* sign bit of x */
      if (xsb == 0) y = x;
      else y = -x; /* y = |x| */
      hx &= 0x7fffffff; /* high word of |x| */

      /* filter out huge and non-finite argument */
      if (hx >= 0x4043687A) { /* if |x|>=56*ln2 */
        if (hx >= 0x40862E42) { /* if |x|>=709.78... */
          if (hx >= 0x7ff00000) {
            if (((hx & 0xfffff) | __LO(x)) != 0) return x + x; /* NaN */
            else return (xsb == 0) ? x : -1.0; /* exp(+-inf)={inf,-1} */
          }
          if (x > o_threshold) return huge * huge; /* overflow */
        }
        if (xsb != 0) { /* x < -56*ln2, return -1.0 with inexact */
          if (x + tiny < 0.0) /* raise inexact */
          return tiny - one; /* return -1 */
        }
      }

      /* argument reduction */
      if (hx > 0x3fd62e42) { /* if  |x| > 0.5 ln2 */
        if (hx < 0x3FF0A2B2) { /* and |x| < 1.5 ln2 */
          if (xsb == 0) {
            hi = x - ln2_hi;
            lo = ln2_lo;
            k = 1;
          } else {
            hi = x + ln2_hi;
            lo = -ln2_lo;
            k = -1;
          }
        } else {
          k = toInt32(invln2 * x + ((xsb == 0) ? 0.5 : -0.5));
          t = k;
          hi = x - t * ln2_hi; /* t*ln2_hi is exact here */
          lo = t * ln2_lo;
        }
        x = hi - lo;
        c = (hi - x) - lo;
      } else if (hx < 0x3c900000) { /* when |x|<2**-54, return x */
        t = huge + x; /* return x with inexact flags when x!=0 */
        return x - (t - (huge + x));
      } else k = 0;

      /* x is now in primary range */
      hfx = 0.5 * x;
      hxs = x * hfx;
      r1 = one + hxs * (Q1 + hxs * (Q2 + hxs * (Q3 + hxs * (Q4 + hxs * Q5))));
      t = 3.0 - r1 * hfx;
      e = hxs * ((r1 - t) / (6.0 - x * t));
      if (k == 0) return x - (x * e - hxs); /* c is 0 */
      else {
        e = (x * (e - c) - c);
        e -= hxs;
        if (k == -1) return 0.5 * (x - e) - 0.5;
        if (k == 1) if (x < -0.25) return -2.0 * (e - (x + 0.5));
        else return one + 2.0 * (x - e);
        if (k <= -2 || k > 56) { /* suffice to return exp(x)-1 */
          y = one - (e - x);
          y = makeNumber(__HI(y) + (k << 20), __LO(y)); /* add k to y's exponent */
          return y - one;
        }
        t = one;
        if (k < 20) {
          t = makeNumber(0x3ff00000 - (0x200000 >> k), __LO(t)); /* t=1-2^-k */
          y = t - (e - x);
          y = makeNumber(__HI(y) + (k << 20), __LO(y)); /* add k to y's exponent */
        } else {
          t = makeNumber(((0x3ff - k) << 20), __LO(t)); /* 2^-k */
          y = x - (e + t);
          y += one;
          y = makeNumber(__HI(y) + (k << 20), __LO(y)); /* add k to y's exponent */
        }
      }
      return y;
    }

    // http://www.netlib.org/fdlibm/e_cosh.c
    /* @(#)e_cosh.c 1.3 95/01/18 */
    /* __ieee754_cosh(x)
     * Method : 
     * mathematically cosh(x) if defined to be (exp(x)+exp(-x))/2
     *	1. Replace x by |x| (cosh(x) = cosh(-x)). 
     *	2. 
     *		                                        [ exp(x) - 1 ]^2 
     *	    0        <= x <= ln2/2  :  cosh(x) := 1 + -------------------
     *			       			           2*exp(x)
     *
     *		                                  exp(x) +  1/exp(x)
     *	    ln2/2    <= x <= 22     :  cosh(x) := -------------------
     *			       			          2
     *	    22       <= x <= lnovft :  cosh(x) := exp(x)/2 
     *	    lnovft   <= x <= ln2ovft:  cosh(x) := exp(x/2)/2 * exp(x/2)
     *	    ln2ovft  <  x	    :  cosh(x) := huge*huge (overflow)
     *
     * Special cases:
     *	cosh(x) is |x| if x is +INF, -INF, or NaN.
     *	only cosh(0)=1 is exact for finite x.
     */

    var one = 1.0;
    var half = 0.5;
    var huge = 1.0e300;

    var __ieee754_exp = Math.exp;
    var fabs = Math.abs;

    function cosh(x) {
      x = Number(x);
      var t, w;
      var ix; // int
      var lx; // unsigned

      /* High word of |x|. */
      ix = __HI(x);
      ix &= 0x7fffffff;

      /* x is INF or NaN */
      if (ix >= 0x7ff00000) return x * x;

      /* |x| in [0,0.5*ln2], return 1+expm1(|x|)^2/(2*exp(|x|)) */
      if (ix < 0x3fd62e43) {
        t = expm1(fabs(x));
        w = one + t;
        if (ix < 0x3c800000) return w; /* cosh(tiny) = 1 */
        return one + (t * t) / (w + w);
      }

      /* |x| in [0.5*ln2,22], return (exp(|x|)+1/exp(|x|)/2; */
      if (ix < 0x40360000) {
        t = __ieee754_exp(fabs(x));
        return half * t + half / t;
      }

      /* |x| in [22, log(maxdouble)] return half*exp(|x|) */
      if (ix < 0x40862E42) return half * __ieee754_exp(fabs(x));

      /* |x| in [log(maxdouble), overflowthresold] */
      //lx = *( (((*(unsigned*)&one)>>29)) + (unsigned*)&x);
      lx = __LO(x) >>> 0;

      if (ix < 0x408633CE || (ix == 0x408633ce) && (lx <= 0x8fb9f87d)) {
        w = __ieee754_exp(half * fabs(x));
        t = half * w;
        return t * w;
      }

      /* |x| > overflowthresold, cosh(x) overflow */
      return huge * huge;
    }

    // http://www.netlib.org/fdlibm/e_sinh.c
    /* @(#)e_sinh.c 1.3 95/01/18 */
    /* __ieee754_sinh(x)
     * Method : 
     * mathematically sinh(x) if defined to be (exp(x)-exp(-x))/2
     *	1. Replace x by |x| (sinh(-x) = -sinh(x)). 
     *	2. 
     *		                                    E + E/(E+1)
     *	    0        <= x <= 22     :  sinh(x) := --------------, E=expm1(x)
     *			       			        2
     *
     *	    22       <= x <= lnovft :  sinh(x) := exp(x)/2 
     *	    lnovft   <= x <= ln2ovft:  sinh(x) := exp(x/2)/2 * exp(x/2)
     *	    ln2ovft  <  x	    :  sinh(x) := x*shuge (overflow)
     *
     * Special cases:
     *	sinh(x) is |x| if x is +INF, -INF, or NaN.
     *	only sinh(0)=0 is exact for finite x.
     */

    var one = 1.0;
    var shuge = 1.0e307;

    function sinh(x) {
      x = Number(x);
      var t, w, h;
      var ix, jx; // int
      var lx; // unsigned

      /* High word of |x|. */
      jx = __HI(x);
      ix = jx & 0x7fffffff;

      /* x is INF or NaN */
      if (ix >= 0x7ff00000) return x + x;

      h = 0.5;
      if (jx < 0) h = -h;
      /* |x| in [0,22], return sign(x)*0.5*(E+E/(E+1))) */
      if (ix < 0x40360000) { /* |x|<22 */
        if (ix < 0x3e300000) /* |x|<2**-28 */
        if (shuge + x > one) return x; /* sinh(tiny) = tiny with inexact */
        t = expm1(fabs(x));
        if (ix < 0x3ff00000) return h * (2.0 * t - t * t / (t + one));
        return h * (t + t / (t + one));
      }

      /* |x| in [22, log(maxdouble)] return 0.5*exp(|x|) */
      if (ix < 0x40862E42) return h * __ieee754_exp(fabs(x));

      /* |x| in [log(maxdouble), overflowthresold] */
      //lx = *( (((*(unsigned*)&one)>>29)) + (unsigned*)&x);
      lx = __LO(x) >>> 0;

      if (ix < 0x408633CE || (ix == 0x408633ce) && (lx <= 0x8fb9f87d)) {
        w = __ieee754_exp(0.5 * fabs(x));
        t = h * w;
        return t * w;
      }

      /* |x| > overflowthresold, sinh(x) overflow */
      return x * shuge;
    }

    // http://www.netlib.org/fdlibm/s_tanh.c
    /* @(#)s_tanh.c 1.3 95/01/18 */
    /* Tanh(x)
     * Return the Hyperbolic Tangent of x
     *
     * Method :
     *				       x    -x
     *				      e  - e
     *	0. tanh(x) is defined to be -----------
     *				       x    -x
     *				      e  + e
     *	1. reduce x to non-negative by tanh(-x) = -tanh(x).
     *	2.  0      <= x <= 2**-55 : tanh(x) := x*(one+x)
     *					        -t
     *	    2**-55 <  x <=  1     : tanh(x) := -----; t = expm1(-2x)
     *					       t + 2
     *						     2
     *	    1      <= x <=  22.0  : tanh(x) := 1-  ----- ; t=expm1(2x)
     *						   t + 2
     *	    22.0   <  x <= INF    : tanh(x) := 1.
     *
     * Special cases:
     *	tanh(NaN) is NaN;
     *	only tanh(0)=0 is exact for finite argument.
     */

    var one = 1.0;
    var two = 2.0;
    var tiny = 1.0e-300;

    function tanh(x) {
      x = Number(x);
      var t, z;
      var jx, ix; // int

      /* High word of |x|. */
      jx = __HI(x);
      ix = jx & 0x7fffffff;

      /* x is INF or NaN */
      if (ix >= 0x7ff00000) {
        if (jx >= 0) return one / x + one; /* tanh(+-inf)=+-1 */
        else return one / x - one; /* tanh(NaN) = NaN */
      }

      /* |x| < 22 */
      if (ix < 0x40360000) { /* |x|<22 */
        if (ix < 0x3c800000) /* |x|<2**-55 */
        return x * (one + x); /* tanh(small) = small */
        if (ix >= 0x3ff00000) { /* |x|>=1  */
          t = expm1(two * fabs(x));
          z = one - two / (t + two);
        } else {
          t = expm1(-two * fabs(x));
          z = -t / (t + two);
        }
        /* |x| > 22, return +-1 */
      } else {
        z = one - tiny; /* raised inexact flag */
      }
      return (jx >= 0) ? z : -z;
    }

    // http://www.netlib.org/fdlibm/e_acosh.c
    /* @(#)e_acosh.c 1.3 95/01/18 */
    /* __ieee754_acosh(x)
     * Method :
     *	Based on 
     *		acosh(x) = log [ x + sqrt(x*x-1) ]
     *	we have
     *		acosh(x) := log(x)+ln2,	if x is large; else
     *		acosh(x) := log(2x-1/(sqrt(x*x-1)+x)) if x>2; else
     *		acosh(x) := log1p(t+sqrt(2.0*t+t*t)); where t=x-1.
     *
     * Special cases:
     *	acosh(x) is NaN with signal if x<1.
     *	acosh(NaN) is NaN without signal.
     */

    var one = 1.0;
    var ln2 = 6.93147180559945286227e-01; /* 0x3FE62E42, 0xFEFA39EF */
    var __ieee754_log = Math.log;
    var sqrt = Math.sqrt;

    function acosh(x) {
      x = Number(x);
      var t;
      var hx; // int
      hx = __HI(x);
      if (hx < 0x3ff00000) { /* x < 1 */
        return (x - x) / (x - x);
      } else if (hx >= 0x41b00000) { /* x > 2**28 */
        if (hx >= 0x7ff00000) { /* x is inf of NaN */
          return x + x;
        } else return __ieee754_log(x) + ln2; /* acosh(huge)=log(2x) */
      } else if (((hx - 0x3ff00000) | __LO(x)) == 0) {
        return 0.0; /* acosh(1) = 0 */
      } else if (hx > 0x40000000) { /* 2**28 > x > 2 */
        t = x * x;
        return __ieee754_log(2.0 * x - one / (x + sqrt(t - one)));
      } else { /* 1<x<2 */
        t = x - one;
        return log1p(t + sqrt(2.0 * t + t * t));
      }
    }

    // http://www.netlib.org/fdlibm/s_asinh.c
    /* @(#)s_asinh.c 1.3 95/01/18 */
    /* asinh(x)
     * Method :
     *	Based on 
     *		asinh(x) = sign(x) * log [ |x| + sqrt(x*x+1) ]
     *	we have
     *	asinh(x) := x  if  1+x*x=1,
     *		 := sign(x)*(log(x)+ln2)) for large |x|, else
     *		 := sign(x)*log(2|x|+1/(|x|+sqrt(x*x+1))) if|x|>2, else
     *		 := sign(x)*log1p(|x| + x^2/(1 + sqrt(1+x^2)))  
     */

    var one = 1.00000000000000000000e+00; /* 0x3FF00000, 0x00000000 */
    var ln2 = 6.93147180559945286227e-01; /* 0x3FE62E42, 0xFEFA39EF */
    var huge = 1.00000000000000000000e+300;

    function asinh(x) {
      x = Number(x);
      var t, w;
      var hx, ix; // int
      hx = __HI(x);
      ix = hx & 0x7fffffff;
      if (ix >= 0x7ff00000) return x + x; /* x is inf or NaN */
      if (ix < 0x3e300000) { /* |x|<2**-28 */
        if (huge + x > one) return x; /* return x inexact except 0 */
      }
      if (ix > 0x41b00000) { /* |x| > 2**28 */
        w = __ieee754_log(fabs(x)) + ln2;
      } else if (ix > 0x40000000) { /* 2**28 > |x| > 2.0 */
        t = fabs(x);
        w = __ieee754_log(2.0 * t + one / (sqrt(x * x + one) + t));
      } else { /* 2.0 > |x| > 2**-28 */
        t = x * x;
        w = log1p(fabs(x) + t / (one + sqrt(one + t)));
      }
      if (hx > 0) return w;
      else return -w;
    }

    // http://www.netlib.org/fdlibm/e_atanh.c
    /* @(#)e_atanh.c 1.3 95/01/18 */
    /* __ieee754_atanh(x)
     * Method :
     *    1.Reduced x to positive by atanh(-x) = -atanh(x)
     *    2.For x>=0.5
     *                  1              2x                          x
     *	atanh(x) = --- * log(1 + -------) = 0.5 * log1p(2 * --------)
     *                  2             1 - x                      1 - x
     *	
     * 	For x<0.5
     *	atanh(x) = 0.5*log1p(2x+2x*x/(1-x))
     *
     * Special cases:
     *	atanh(x) is NaN if |x| > 1 with signal;
     *	atanh(NaN) is that NaN with no signal;
     *	atanh(+-1) is +-INF with signal.
     *
     */

    var one = 1.0;
    var huge = 1e300;
    var zero = 0.0;

    function atanh(x) {
      x = Number(x);
      var t;
      var hx, ix; // int
      var lx; // unsigned
      hx = __HI(x); /* high word */
      lx = __LO(x) >>> 0; /* low word */
      ix = hx & 0x7fffffff;
      //if ((ix|((lx|(-lx))>>31))>0x3ff00000) /* |x|>1 */
      if (isNaN(x) || Math.abs(x) > 1) return (x - x) / (x - x);
      if (ix == 0x3ff00000) return x / zero;
      if (ix < 0x3e300000 && (huge + x) > zero) return x; /* x<2**-28 */
      x = makeNumber(ix, __LO(x)); /* x <- |x| */
      if (ix < 0x3fe00000) { /* x < 0.5 */
        t = x + x;
        t = 0.5 * log1p(t + t * x / (one - x));
      } else t = 0.5 * log1p((x + x) / (one - x));
      if (hx >= 0) return t;
      else return -t;
    }

    // http://www.netlib.org/fdlibm/e_hypot.c
    /* @(#)e_hypot.c 1.3 95/01/18 */
    /* __ieee754_hypot(x,y)
     *
     * Method :                  
     *	If (assume round-to-nearest) z=x*x+y*y 
     *	has error less than sqrt(2)/2 ulp, than 
     *	sqrt(z) has error less than 1 ulp (exercise).
     *
     *	So, compute sqrt(x*x+y*y) with some care as 
     *	follows to get the error below 1 ulp:
     *
     *	Assume x>y>0;
     *	(if possible, set rounding to round-to-nearest)
     *	1. if x > 2y  use
     *		x1*x1+(y*y+(x2*(x+x1))) for x*x+y*y
     *	where x1 = x with lower 32 bits cleared, x2 = x-x1; else
     *	2. if x <= 2y use
     *		t1*y1+((x-y)*(x-y)+(t1*y2+t2*y))
     *	where t1 = 2x with lower 32 bits cleared, t2 = 2x-t1, 
     *	y1= y with lower 32 bits chopped, y2 = y-y1.
     *		
     *	NOTE: scaling may be necessary if some argument is too 
     *	      large or too tiny
     *
     * Special cases:
     *	hypot(x,y) is INF if x or y is +INF or -INF; else
     *	hypot(x,y) is NAN if x or y is NAN.
     *
     * Accuracy:
     * 	hypot(x,y) returns sqrt(x^2+y^2) with error less 
     * 	than 1 ulps (units in the last place) 
     */

    function hypot(x, y) {
      x = Number(x);
      y = Number(y);
      var a = x,
        b = y,
        t1, t2, y1, y2, w;
      var j, k, ha, hb;

      ha = __HI(x) & 0x7fffffff; /* high word of  x */
      hb = __HI(y) & 0x7fffffff; /* high word of  y */
      if (hb > ha) {
        a = y;
        b = x;
        j = ha;
        ha = hb;
        hb = j;
      } else {
        a = x;
        b = y;
      }
      a = Math.abs(a); /* a <- |a| */
      b = Math.abs(b); /* b <- |b| */
      if ((ha - hb) > 0x3c00000) {
        return a + b;
      } /* x/y > 2**60 */
      k = 0;
      if (ha > 0x5f300000) { /* a>2**500 */
        if (ha >= 0x7ff00000) { /* Inf or NaN */
          w = a + b; /* for sNaN */
          if (((ha & 0xfffff) | __LO(a)) == 0) w = a;
          if (((hb ^ 0x7ff00000) | __LO(b)) == 0) w = b;
          return w;
        }
        /* scale a and b by 2**-600 */
        ha -= 0x25800000;
        hb -= 0x25800000;
        k += 600;
        a = makeNumber(ha, __LO(a));
        b = makeNumber(hb, __LO(b));
      }
      if (hb < 0x20b00000) { /* b < 2**-500 */
        if (hb <= 0x000fffff) { /* subnormal b or 0 */
          if ((hb | (__LO(b))) == 0) return a;
          t1 = 0;
          t1 = makeNumber(0x7fd00000, __LO(t1)); /* t1=2^1022 */
          b *= t1;
          a *= t1;
          k -= 1022;
        } else { /* scale a and b by 2^600 */
          ha += 0x25800000; /* a *= 2^600 */
          hb += 0x25800000; /* b *= 2^600 */
          k -= 600;
          a = makeNumber(ha, __LO(a));
          b = makeNumber(hb, __LO(b));
        }
      }
      /* medium size a and b */
      w = a - b;
      if (w > b) {
        t1 = 0;
        t1 = makeNumber(ha, __LO(t1));
        t2 = a - t1;
        w = Math.sqrt(t1 * t1 - (b * (-b) - t2 * (a + t1)));
      } else {
        a = a + a;
        y1 = 0;
        y1 = makeNumber(hb, __LO(y1));
        y2 = b - y1;
        t1 = 0;
        t1 = makeNumber(ha + 0x00100000, __LO(t1));
        t2 = a - t1;
        w = Math.sqrt(t1 * y1 - (w * (-w) - (t1 * y2 + t2 * b)));
      }
      if (k != 0) {
        t1 = 1.0;
        t1 = makeNumber(__HI(t1) + (k << 20), __LO(t1));
        return t1 * w;
      } else return w;
    }

    var fns = {
      acosh: acosh,
      asinh: asinh,
      atanh: atanh,
      cosh: cosh,
      expm1: expm1,
      hypot: hypot,
      log10: log10,

      log2: function(x) {
        return Math.log(x) / Math.log(2);
      },

      log1p: log1p,

      trunc: function(x) {
        x = Number(x);
        return x && isFinite(x) ? x - x % 1 : x;
      },

      sinh: sinh,
      tanh: tanh
    };

    return fns;
  })();

  defineProperties(Math, mathFns);

  defineProperties(globals, {
    Map: (function() {
      var indexOfIdentical = function(keys, key) {
        for (var i = 0, length = keys.length; i < length; i++) {
          if (Object.is(keys[i], key)) return i;
        }
        return -1;
      };

      function Map() {
        if (!(this instanceof Map)) return new Map;
        defineProperty(this, 'keys', []);
        defineProperty(this, 'values', []);
      }

      defineProperties(Map.prototype, {
        get: function(key) {
          var index = indexOfIdentical(this.keys, key);
          return index < 0 ? undefined : this.values[index];
        },

        has: function(key) {
          return indexOfIdentical(this.keys, key) >= 0;
        },

        set: function(key, value) {
          var keys = this.keys;
          var values = this.values;
          var index = indexOfIdentical(keys, key);
          if (index < 0) index = keys.length;
          keys[index] = key;
          values[index] = value;
        },

        'delete': function(key) {
          var keys = this.keys;
          var values = this.values;
          var index = indexOfIdentical(keys, key);
          if (index < 0) return false;
          keys.splice(index, 1);
          values.splice(index, 1);
          return true;
        }
      });

      return Map;
    })(),

    Set: (function() {
      function Set() {
        if (!(this instanceof Set)) return new Set;
        defineProperty(this, 'map', Map());
      }

      defineProperties(Set.prototype, {
        has: function(key) {
          return this.map.has(key);
        },

        add: function(key) {
          this.map.set(key, true);
        },

        'delete': function(key) {
          return this.map['delete'](key);
        }
      });

      return Set;
    })()
  });
});
