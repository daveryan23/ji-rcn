var setupPosFromNotation = require('../../pos/setupPosFromNotation');

var getEndPitchNotation = function getEndPitchNotation(inputtedStartNotation) {
  setupPosFromNotation(this, inputtedStartNotation);
  return this.pos.e.pn;
};

module.exports = getEndPitchNotation;
