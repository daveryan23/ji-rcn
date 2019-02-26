var mathsFnJIntervalCreator = require('../../maths/mathsFnJIntervalCreator');

// Return JInterval with frequency ratio (width) to a specified power
// Use .pow on Peo to achieve the power
var pow = function pow(power) {
  return mathsFnJIntervalCreator(this, {peo: this.peo.pow(power)});
};

module.exports = pow;
