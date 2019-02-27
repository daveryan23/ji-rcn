// var setAlg = require('../setup/setAlg');
// var setTuning = require('../setup/setTuning');
var setAllSetupOptions = require('../setup/setAllSetupOptions');

var setupPosFromNotation = require('../pos/setupPosFromNotation');

var initialiseUsingAnotherJInterval = function initialiseUsingAnotherJInterval(jint, otherJint) {
  // Ought to have already set tuning of jint to thisTuning

  var otherJintSetupObject = otherJint.getSetupObject();
  var jintSetupObject = jint.getSetupObject();

  var useSetupObject = {};
  Object.assign(useSetupObject, otherJintSetupObject, jintSetupObject);
  // Properties from otherJintSetupObject overridden by properties from jintSetupObject

  setAllSetupOptions(jint, useSetupObject);


  // // Set algorithm from otherJint, if its blank
  // if (!jint.hasAlg() && otherJint.hasAlg()) {
  //   setAlg(jint, otherJint.getSetupAlgObject());
  //   setTuning(jint, jint.getSetupTuningObject());    // Ought to reset after alg changes!
  // }
  //
  // // Set tuning from otherJint, if its blank
  // if (!jint.hasTuning() && otherJint.hasTuning()) {
  //   setTuning(jint, otherJint.getSetupTuningObject());
  // }


  // Set the interval width from otherJint
  var thePeo = otherJint.widthPeo();  // Creates a copy
  jint.peo = thePeo;

  // If absolute position is specified on otherJint, copy it to this jint
  if (otherJint.hasPos()) {
    var startNote = otherJint.getStartInputPitchNotation();
    var endNote = otherJint.getEndInputPitchNotation();
    setupPosFromNotation(jint, startNote, endNote);
  }
};

module.exports = initialiseUsingAnotherJInterval;
