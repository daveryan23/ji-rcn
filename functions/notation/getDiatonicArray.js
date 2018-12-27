var ibn = require('is-bounded-number')

var constants = require('../constants')


var getDiatonicArray = function(exp3) {

  // Turns an exponent of 3 between -1 and 6
  // into a standard scale note name (F, C... B)

  // Deal with error cases
  if (!ibn(exp3, constants.MAX_ERROR_3_DIATONIC)) {
    // Error output
    return [constants.ERROR_TEXT_3_DIATONIC_NA, constants.PEO_3_DIATONIC_C]
  }
  // Have a number
  exp3 = Math.round(exp3)
  if (exp3 < -1) {
    return [constants.ERROR_TEXT_3_DIATONIC_LO, constants.PEO_3_DIATONIC_C]
  }
  if (exp3 > 5) {
    return [constants.ERROR_TEXT_3_DIATONIC_HI, constants.PEO_3_DIATONIC_C]
  }

  // Give some output
  var result = null
  switch (exp3) {
    case -1: return [constants.NAME_3_DIATONIC_F, constants.PEO_3_DIATONIC_F.copy()]
    case 0: return [constants.NAME_3_DIATONIC_C, constants.PEO_3_DIATONIC_C.copy()]
    case 1: return [constants.NAME_3_DIATONIC_G, constants.PEO_3_DIATONIC_G.copy()]
    case 2: return [constants.NAME_3_DIATONIC_D, constants.PEO_3_DIATONIC_D.copy()]
    case 3: return [constants.NAME_3_DIATONIC_A, constants.PEO_3_DIATONIC_A.copy()]
    case 4: return [constants.NAME_3_DIATONIC_E, constants.PEO_3_DIATONIC_E.copy()]
    case 5: return [constants.NAME_3_DIATONIC_B, constants.PEO_3_DIATONIC_B.copy()]
  }
}

module.exports = getDiatonicArray
