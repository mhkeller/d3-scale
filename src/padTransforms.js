import peek from './peek.js';

function identity (_) {
   return _;
}

function exp(x) {
  return Math.exp(x);
}

function log(x) {
  return Math.log(x * Math.sign(x));
}

// function exp(sign) {
//   return function (x) {
//     console.log('exp', x)
//     return Math.exp(x);
//   };
// }

// function log(sign) {
//   return function (x) {
//     return Math.log(Math.abs(sign * x));
//   };
// }

function symlog(c) {
  return function (x) { return Math.sign(x) * Math.log1p(Math.abs(x / c)); };
}

function symexp(c) {
  return function (x) { return Math.sign(x) * Math.expm1(Math.abs(x)) * c; };
}

function pow(exponent) {
  return function (x) {
    return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
  };
}

function zoom(domain, scale, lift, ground, sign) {
  const d0 = lift(domain[0]);
  const d1 = lift(peek(domain));
  const d = sign === -1 ? d0 : d1;

  console.log('d0', d0)
  console.log('d1', d1)

  const s = Math.sign(domain[0]);

  const adjuster = (d1 - (d0 * s)) * scale;
  console.log('adjuster', adjuster, scale);
  console.log('d', d)
  console.log('sign', sign)
  console.log('adjusted', d + adjuster * sign)
  return ground(d + adjuster * sign) * Math.sign(d);
}

export function zoomLinear(domain, scale, sign) {
  return zoom(domain, scale, identity, identity, sign);
}

export function zoomLog(domain, scale, sign) {
  return zoom(domain, scale, log, exp, sign);
}

export function zoomPow(domain, anchor, scale, exponent) {
  return zoom(domain, anchor, scale, pow(exponent), pow(1 / exponent));
}

export function zoomSymlog(domain, anchor, scale, constant) {
  return zoom(domain, anchor, scale, symlog(constant), symexp(constant));
}
