var assert = require('assert')
var Fraction = require('fraction.js')
var getComma = require('../getComma.js')

var defaultFractionArray = [1, 1]

var fnName = 'getComma'
describe(fnName, function() {

  var runTest = function(prime, fractionArray, type) {
    var actualResult = getComma(prime, type)
    var expectedResult = Fraction(fractionArray)
    var typeText = ""
    if (type) {
      typeText = ", " + type
    }
    var label = fnName + "(" + prime + typeText + ") returns " + expectedResult.toFraction()
    it(label, function() {
      assert.deepStrictEqual(actualResult, expectedResult)
    })
  }

  var testArray = [
    ["string", defaultFractionArray]
  , [null, defaultFractionArray]
  , [true, defaultFractionArray]
  , [Infinity, defaultFractionArray]
  , [1e16, defaultFractionArray]
  , [3, defaultFractionArray]
  , [-1, defaultFractionArray]
  , [-2003, defaultFractionArray]
  , [139, [2224, 2187]]         // Default algorithm is DR
  , [139, [2224, 2187], "DR"]
  , [139, [139, 144], "SAG"]
  , [139, [139, 144], "DK"]     // Added an alias DK (Dave Keenan) for SAG
  , [139, [33777, 32768], "KG2"]
  ]

  for (var i=0; i<testArray.length; i++) {
    runTest(testArray[i][0], testArray[i][1], testArray[i][2])
  }

})
