var setupPosFromNotation = require('../../pos/setupPosFromNotation');

var setStartPitchNotation = function setStartPitchNotation(inputtedStartNotation) {
  setupPosFromNotation(this, inputtedStartNotation);
};

module.exports = setStartPitchNotation;
