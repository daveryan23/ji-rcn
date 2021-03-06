var Peo = require('peo');
var pf = require('primes-and-factors');

var tripleToPeo = require('./calcs/tripleToPeo');
var calcExp2 = require('./calcs/calcExp2');

var getCommaDR = function getCommaDR(p) {
  // Calculate a prime comma, according to the DR algorithm

  // If input not prime, return Peo for 1/1
  if (!pf.isPrime(p)) return new Peo();

  // Some constants
  var cmmin = 1e20;  // This will get smaller!
  var result = tripleToPeo(1, 0, 0);

  // Calcs start
  var log3 = Math.log(3);
  var log2 = Math.log(2);
  var log23 = log3 / log2;
  var logp = Math.log(p);
  var log3p = logp / log3;
  var log2p = logp / log2;

  var bmid = -0.5 * log3p;
  var bmin1 = Math.round(bmid - 5.5);
  var bmax1 = Math.round(bmid + 5.5);
  var bmin2 = Math.ceil(-log3p - 1 / (2 * log23));
  var bmax2 = 0;
  var bmin = Math.min(bmin1, bmin2);
  var bmax = Math.max(bmax1, bmax2);

  for (var b = bmin; b <= bmax; b++) {
    var a = calcExp2(p, b);
    // var exp2a = Math.pow(2, a);
    // var exp3b = Math.pow(3, b);
    // var primeCandidate =  exp2a * exp3b * p;
    var ao = Math.abs(a + b * log23 + log2p);
    var lcy = Math.abs(a) + Math.abs(b) * log23 + log2p;
    var cm = ao * lcy;
    if (cm < cmmin) {
      // This always gets called at least once
      cmmin = cm;
      result = tripleToPeo(p, a, b);
    }
  }
  return result;
};

module.exports = getCommaDR;
