/* eslint-disable func-names */

var assert = require('assert');
var Peo = require('peo');

var testIndex = require('./_test_index');
var JInterval = testIndex.JInterval;

var identityFn = function identityFn(p) {return new Peo(p);};

describe('JInterval general tests', function () {
  it('can initialise from new JInterval(new Peo(14, 15)), and objects get copied correctly', function () {
    var origPeo = new Peo(14, 15);
    var jint = new JInterval(origPeo, 'KG2');
    var jintPeoDirectAccess = jint.peo;
    var jintPeoAPIAccess = jint.ratioPeo();
    // Different object identities
    assert(jintPeoDirectAccess !== origPeo, 'When initialising on peo, the peo gets copied, they are different');
    assert(jintPeoDirectAccess === jintPeoAPIAccess, 'jint.peo and jint.ratioPeo(), they are the same');
    // Same contents
    assert.deepStrictEqual(jintPeoDirectAccess, jintPeoAPIAccess);
    assert.deepStrictEqual(jintPeoDirectAccess, origPeo);
    assert.strictEqual(jint.ratioFractionText(), '14/15');
    assert.strictEqual(jint.getAlgText(), 'KG2');
  });

  it('can initialise from new JInterval(<another JInterval>)', function () {
    var peo = new Peo(14, 15);
    var jint1 = new JInterval(peo, 'SAG');
    var jint2 = new JInterval(jint1);
    var peo1 = jint1.ratioPeo();
    var peo2 = jint2.ratioPeo();
    assert(jint1 !== jint2, 'Different JInterval objects');
    assert(peo1.equals(peo2), 'Same interval');
    assert.strictEqual(jint2.getAlgText(), 'SAG');
  });

  it('can initialise from new JInterval(14)', function () {
    var jint = new JInterval(14, 'SAG');
    var txt = jint.ratioFractionText();
    assert.strictEqual(txt, '14');
    assert.strictEqual(jint.getAlgText(), 'SAG');
  });

  it('can initialise from new JInterval(14, 15)', function () {
    var jint = new JInterval(14, 15, 'KG2');
    var txt = jint.ratioFractionText();
    assert.strictEqual(txt, '14/15');
    assert.strictEqual(jint.getAlgText(), 'KG2');
  });

  it('can initialise from new JInterval({2:1, 3:1, 5:-2, 13:-4})', function () {
    var jint = new JInterval({2: 1, 3: 1, 5: -2, 13: -4}, 'SAG');
    var txt = jint.ratioFractionText();
    assert.strictEqual(txt, '6/714025');
    assert.strictEqual(jint.getAlgText(), 'SAG');
  });

  it('can initialise from new JInterval()', function () {
    var jint = new JInterval();
    var txt = jint.ratioFractionText();
    assert.strictEqual(jint.getAlgText(), '');
    assert.strictEqual(txt, '1');
  });

  it('can initialise from new JInterval("3/4", "SAG")', function () {
    var jint = new JInterval('3/4', 'SAG');
    assert.strictEqual(jint.getAlgText(), 'SAG');
    assert(jint.peo.equals(3 / 4));
  });

  it('can initialise from new JInterval(0.75, "KG2")', function () {
    var jint = new JInterval(0.75, 'KG2');
    assert.strictEqual(jint.getAlgText(), 'KG2');
    assert(jint.peo.equals(3 / 4));
  });

  it('can provide a deep copy', function () {
    var jint = new JInterval('7/2');
    var jintc = jint.copy();
    var jintp = jint.getEndPitchNotation();
    var jintcp = jintc.getEndPitchNotation();
    assert(jint !== jintc);                  // Objects different
    assert(jint.peo !== jintc.peo);
    assert.strictEqual(jintp, 'Bb[7]5');   // Represents same JInterval
    assert.strictEqual(jintcp, 'Bb[7]5');
  });

  it('can return an identity JInterval', function () {
    var jint = new JInterval('7/2');
    var jint1 = jint.get1();
    var jintp = jint.getEndPitchNotation();
    var jint1p = jint1.getEndPitchNotation();
    assert(jint !== jint1);
    assert.strictEqual(jintp, 'Bb[7]5');
    assert.strictEqual(jint1p, 'C4');
  });

  it('can provide a pitch', function () {
    var jint = new JInterval(35, 12);
    assert.strictEqual(jint.getEndPitchNotation(), "G'[7]5");
  });

  it('check default (starting) pitch class is C', function () {
    var jint = new JInterval(2, 1);
    assert.strictEqual(jint.getStartPitchClassNotation(), 'C');
  });

  it('check default (starting) frequency is 256.00 Hz', function () {
    var jint = new JInterval(13, 8);
    assert.strictEqual(jint.getStartFreqText(), '256.00 Hz');
  });

  it('cover three branches on recalc notation', function () {
    var jint = new JInterval(2, 1);
    var endNotation = jint.getEndPitchNotation('G4');
    assert.strictEqual(endNotation, 'G5');
    endNotation = jint.getEndPitchNotation('G4'); // Cover case of repeated input hitting cache
    assert.strictEqual(endNotation, 'G5');
    endNotation = jint.getEndPitchNotation();     // Cover case of empty input hitting cache
    assert.strictEqual(endNotation, 'G5');
    endNotation = jint.getEndPitchNotation('F4'); // Cover case of different input not hitting cache
    assert.strictEqual(endNotation, 'F5');
  });

  it('can provide a text description via toString', function () {
    var jint = new JInterval(35, 12);
    var endNotation = jint.getEndPitchNotation();
    var startNotation = jint.getStartPitchNotation();
    var toStringText = jint.toString();
    assert(toStringText.includes(startNotation));
    assert(toStringText.includes(endNotation));
  });

  it('default JInterval has frequency Hz and text of 256.00 Hz', function () {
    var jint = new JInterval();
    assert.strictEqual(jint.getEndFreqHz(), 256);
    assert.strictEqual(jint.getEndFreqText(), '256.00 Hz');
  });

  it('new JInterval(5, 4) is 320.00 Hz', function () {
    var jint = new JInterval(5, 4);
    assert.strictEqual(jint.getEndFreqHz(), 320);
    assert.strictEqual(jint.getEndFreqText(), '320.00 Hz');
  });

  it('new JInterval("42") is 10752.00 Hz', function () {
    var jint = new JInterval('42');
    assert.strictEqual(jint.getEndFreqHz(), 10752);
    assert.strictEqual(jint.getEndFreqText(), '10752.00 Hz');
  });

  it('new JInterval("6/7") has correct frequency Hz and text approx 219.43 Hz', function () {
    var jint = new JInterval('6/7');       // 256 * 6 / 7 = 219.42857143
    assert(jint.getEndFreqHz() > 219.428570);
    assert(jint.getEndFreqHz() < 219.428572);
    assert.strictEqual(jint.getEndFreqText(), '219.43 Hz');
  });

  it('new JInterval("9/8") gives 256->288 and 248->279 Hz', function () {
    var jint = new JInterval('9/8');
    assert.strictEqual(jint.getEndFreqHz(), 288);     // Default of 256 used. 256 * 9/8 = 288
    assert.strictEqual(jint.getEndFreqHz(248), 279);  // 248 * 9/8 = 279
    assert.strictEqual(jint.getEndFreqHz(248), 279);  // Coverage of caching values
    assert.strictEqual(jint.getEndFreqHz(), 279);     // Previous start value is cached
    assert.strictEqual(jint.getEndFreqText(), '279.00 Hz');
    assert.strictEqual(jint.getEndFreqText(256), '288.00 Hz');
  });

  it('new JInterval("42") and global default start freq of 256 Hz gives 10752 Hz', function () {
    var jint = new JInterval('42');
    assert.strictEqual(jint.getEndFreqHz(), 10752);     // 256 Hz in defaults
    assert.strictEqual(jint.getEndFreqText(), '10752.00 Hz');
  });

  it('new JInterval("C4", "Eb.5") agrees with new Peo(12, 5)', function () {
    var jint = new JInterval('C4', 'Eb.5');
    assert.strictEqual(jint.ratioFractionText(), '12/5');
  });

  it('new JInterval(\'Bb[7]5\', "E\'4", "SAG") gives value of 5/14', function () {
    var jint = new JInterval('Bb[7]5', "E'4", 'SAG');
    assert.strictEqual(jint.ratioFractionText(), '5/14');
    assert.strictEqual(jint.getAlgText(), 'SAG');
  });

  // FIVE CHECKS ON INITIALISATION FROM NOTATIONS WITH ALGORITHM

  it('new JInterval("D5", "F[11]5") gives value of 11/9', function () {
    var jint = new JInterval('D5', 'F[11]5');
    assert.strictEqual(jint.ratioFractionText(), '11/9');
    assert.strictEqual(jint.getAlgText(), '');
  });

  it('new JInterval("D5", "F[11]5", "DR") gives value of 11/9', function () {
    var jint = new JInterval('D5', 'F[11]5', 'DR');
    assert.strictEqual(jint.ratioFractionText(), '11/9');
    assert.strictEqual(jint.getAlgText(), 'DR');
  });

  it('new JInterval("D5", "F[11]5", "KG") gives value of 22528/19683', function () {
    var jint = new JInterval('D5', 'F[11]5', 'KG');
    assert.strictEqual(jint.ratioFractionText(), '22528/19683');
    assert.strictEqual(jint.getAlgText(), 'KG2');
  });

  it('new JInterval("D5", "F[11]5", identityFn) gives value of 352/27', function () {
    var jint = new JInterval('D5', 'F[11]5', identityFn);
    assert.strictEqual(identityFn(19).toString(), '{"19":1}');
    assert.strictEqual(jint.ratioFractionText(), '352/27');
    assert.strictEqual(jint.getAlgText(), 'CUSTOM');
  });

  it('new JInterval("D5", "F[11]5", {txt:"ID",fn:identityFn}) gives value of 352/27', function () {
    var jint = new JInterval('D5', 'F[11]5', {txt: 'ID', fn: identityFn});
    assert.strictEqual(jint.ratioFractionText(), '352/27');
    assert.strictEqual(jint.getAlgText(), 'ID');
  });

  // FIVE CHECKS ON INITIALISATION FROM ONE OBJECT CONTAINING NOTATIONS WITH ALGORITHM

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5"}) gives value of 11/9', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5'});
    assert.strictEqual(jint.ratioFractionText(), '11/9');
    assert.strictEqual(jint.getAlgText(), '');
  });

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5", alg:"DR"}) gives value of 11/9', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5', alg: 'DR'});
    assert.strictEqual(jint.ratioFractionText(), '11/9');
    assert.strictEqual(jint.getAlgText(), 'DR');
  });

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5", alg:"KG"}) gives value of 22528/19683', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5', alg: 'KG'});
    assert.strictEqual(jint.ratioFractionText(), '22528/19683');
    assert.strictEqual(jint.getAlgText(), 'KG2');
  });

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5", alg:identityFn}) gives value of 352/27', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5', alg: identityFn});
    assert.strictEqual(jint.ratioFractionText(), '352/27');
    assert.strictEqual(jint.getAlgText(), 'CUSTOM');
  });

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5", alg:{txt:"ID",fn:identityFn}) gives value of 352/27', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5', alg: {txt: 'ID', fn: identityFn}});
    assert.strictEqual(jint.ratioFractionText(), '352/27');
    assert.strictEqual(jint.getAlgText(), 'ID');
  });

  it('new JInterval({startPitchNotation:"D5", endPitchNotation:"F[11]5", alg:{txt:"KG",fn:identityFn}) overrides fn, uses KG, and gives value of 22528/19683', function () {
    var jint = new JInterval({startPitchNotation: 'D5', endPitchNotation: 'F[11]5', alg: {txt: 'KG', fn: identityFn}});
    assert.strictEqual(jint.ratioFractionText(), '22528/19683');
    assert.strictEqual(jint.getAlgText(), 'KG2');
  });

  it('Deals with non-standard start pitch notation G#b5 (equivalent to G5)', function () {
    var jint = new JInterval(5 / 6);
    assert.strictEqual(jint.getStartInputPitchNotation(), 'C4'); // Test the default notation start value
    jint.getEndPitchNotation('G#b5');                            // Sets all notation start and end values
    assert.strictEqual(jint.getStartInputPitchNotation(), 'G#b5');
    assert.strictEqual(jint.getStartPitchNotation(), 'G5');
    assert.strictEqual(jint.getEndPitchNotation(), "E'5");
  });

  it("Deals with non-standard start pitch notation '.. (equivalent to C.4)", function () {
    var jint = new JInterval('9/8');
    jint.getEndPitchNotation("'..");
    assert.strictEqual(jint.getStartInputPitchNotation(), "'..");
    assert.strictEqual(jint.getStartPitchNotation(), 'C.4');
    assert.strictEqual(jint.getEndPitchNotation(), 'D.4');
  });

  it('Deals with non-standard start pitch notation Bb[49/7]5 (equivalent to Bb[7]5)', function () {
    var jint = new JInterval(8 / 7);
    jint.getEndPitchNotation('Bb[49/7]5');
    assert.strictEqual(jint.getStartInputPitchNotation(), 'Bb[49/7]5');
    assert.strictEqual(jint.getStartPitchNotation(), 'Bb[7]5');
    assert.strictEqual(jint.getEndPitchNotation(), 'C6');
  });

  it('Can remove non-essential information', function () {
    var jint = new JInterval('F5', 'G5');
    assert(jint.pos);
    jint.compress();
    assert(!jint.pos);
  });

  it('Test start notation values', function () {
    var jint = new JInterval(3);   // In this test, the value doesn't matter
    assert.strictEqual(jint.getStartPitchNotation(), 'C4');
    assert.strictEqual(jint.getStartPitchClassNotation(), 'C');
    assert.strictEqual(jint.getStartInputPitchNotation(), 'C4');
    jint.getEndPitchClassNotation('D#b4');
    assert.strictEqual(jint.getStartPitchNotation(), 'D4');
    assert.strictEqual(jint.getStartPitchClassNotation(), 'D');
    assert.strictEqual(jint.getStartInputPitchNotation(), 'D#b4');
  });

  it('Test toString without notation', function () {
    var jint = new JInterval('9/8');
    var theString = jint.toString();
    assert(!jint.hasPos());
    assert.strictEqual(theString, 'Interval of 9/8');
  });

  it('Test toString with notation', function () {
    var jint = new JInterval('Gbb##4', "A'..'4");
    var theString = jint.toString();
    var theAlgSetupObject = jint.getSetupAlgObject();
    assert(jint.hasPos());
    assert.strictEqual(theString, 'Interval of 9/8 from G4 to A4');
    assert(!theAlgSetupObject);
  });

  it('Test toString without notation but with alg', function () {
    var jint = new JInterval('9/8', 'sag');
    var theString = jint.toString();
    var theAlgSetupObject = jint.getSetupAlgObject();
    assert(!jint.hasPos());
    assert.strictEqual(theString, 'Interval of 9/8');
    assert.strictEqual(theAlgSetupObject.txt, 'SAG');
  });

  it('Test fraction text on 15 digits uses the fraction', function () {
    var jint = new JInterval({2: 48, 3: -30});
    assert(jint.ratio() > 1.367105877);      // 1.3671058770091216
    assert(jint.ratio() < 1.367105878);
    assert.strictEqual(jint.ratioFractionText(), '281474976710656/205891132094649');
    assert.strictEqual(jint.toString(), 'Interval of 281474976710656/205891132094649');
  });

  it('Test fraction text on 16 digits uses the decimal', function () {
    var jint = new JInterval({2: 50, 3: -30});
    assert(jint.ratio() > 5.468423508);      // 5.468423508036486
    assert(jint.ratio() < 5.468423509);
    assert.strictEqual(jint.ratioFractionText(), 'NA');
    assert.strictEqual(jint.toString().slice(0, 21), 'Interval of 5.4684235');
  });

  // Test setter functions for start frequency and notation

  it('Test setStartFreqHz starting at 225 Hz on interval for 4/3 ends at 300 Hz', function () {
    var jint = new JInterval({2: 2, 3: -1});  // 4/3
    jint.setStartFreqHz(225);
    assert.strictEqual(jint.getStartFreqHz(), 225);
    assert.strictEqual(jint.getEndFreqHz(), 300);
  });

  it("Test setStartPitchNotation starting at E'5 on interval for 12/5 ends at G6", function () {
    var jint = new JInterval({2: 2, 3: 1, 5: -1});  // 12/5
    jint.setStartPitchNotation("E'#b5");
    assert.strictEqual(jint.getStartPitchNotation(), "E'5");
    assert.strictEqual(jint.getStartInputPitchNotation(), "E'#b5");
    assert.strictEqual(jint.getEndPitchNotation(), 'G6');
  });

  it('get/set peo API works', function () {
    var jint = new JInterval(55 / 49);
    assert(!jint.hasPos());
    jint.setStartPitchNotation('Bb[13]3');
    assert(jint.hasPos());
    assert.strictEqual(jint.getStartPitchNotation(), 'Bb[13]3');
    assert.strictEqual(jint.getEndPitchNotation(), "B'[143/49]3");
    var peoStart = jint.getStartPeo();
    assert.strictEqual(peoStart.getAsFractionText(), '208/243');
    var peoEnd = jint.getEndPeo();
    assert.strictEqual(peoEnd.getAsFractionText(), '11440/11907');
    var jint2 = new JInterval(6 / 7);
    assert(!jint2.hasPos());
    jint2.setStartPeo(peoStart);
    assert(jint2.hasPos());
    assert.strictEqual(jint2.getStartPitchNotation(), 'Bb[13]3');
    assert.strictEqual(jint2.getEndPitchNotation(), 'G[13/7]3');
  });

  it('cover edge case of getStartPeo when pos is not already set', function () {
    var jint = new JInterval(55 / 49);
    var peo = jint.getStartPeo();
    assert.strictEqual(peo.getAsDecimal(), 1);
  });

  it('can raise interval 3/2 to power 3', function () {
    var jint1 = new JInterval(3, 2);
    var jint2 = jint1.pow(3);
    assert.strictEqual(jint2.ratioFractionText(), '27/8');
  });

  it('can raise interval 6/7 to power -2', function () {
    var jint1 = new JInterval(6 / 7);
    var jint2 = jint1.pow(-2);
    assert.strictEqual(jint2.ratioFractionText(), '49/36');
  });

  it('can raise interval 7/5 to power 0', function () {
    var jint1 = new JInterval(7 / 5);
    var jint2 = jint1.pow(0);
    assert.strictEqual(jint2.ratioFractionText(), '1');
  });

  it('can raise interval 36/7 to power 1, returns different JInterval, with same ratio', function () {
    var jint1 = new JInterval('36/7');
    var jint2 = jint1.pow(1);
    assert(jint1 !== jint2);
    assert.strictEqual(jint2.ratioFractionText(), '36/7');
  });

  it('raising 4/13 to invalid power returns different JInterval, with same ratio', function () {
    var jint1 = new JInterval('4/13');
    var jint2 = jint1.pow(0.5);
    assert(jint1 !== jint2);
    assert.strictEqual(jint2.ratioFractionText(), '4/13');
  });

  it('can multiply jint 5/3 by another jint 9/4', function () {
    var jint1 = new JInterval(5, 3);
    var jint2 = new JInterval(9, 4);
    var jint3 = jint1.mult(jint2);
    assert.strictEqual(jint3.ratioFractionText(), '15/4');
  });

  it('can multiply jint 5/4 by another jint 3/2 to power 2', function () {
    var jint1 = new JInterval(5, 4);
    var jint2 = new JInterval(3, 2);
    var jint3 = jint1.mult(jint2, 2);
    assert.strictEqual(jint3.ratioFractionText(), '45/16');
  });

  it('can multiply jint 7/3 by peo 5/11 to power 4', function () {
    var jint = new JInterval(7, 3);
    var peo = new Peo(5, 11);
    assert.strictEqual(jint.mult(peo, 4).ratioFractionText(), '4375/43923');
  });

  it('can multiply jint 2/9 by integer 3', function () {
    var jint1 = new JInterval(2 / 9);
    var jint2 = jint1.mult(3);
    assert.strictEqual(jint2.ratioFractionText(), '2/3');
  });

  it('can multiply jint 2/9 by fraction 3/7', function () {
    var jint1 = new JInterval(2 / 9);
    var jint2 = jint1.mult(3, 7);
    assert.strictEqual(jint2.ratioFractionText(), '2/21');
  });

  it('can multiply jint 2/9 by integer 3 to power -2', function () {
    var jint1 = new JInterval(2 / 9);
    var jint2 = jint1.mult(3, null, -2);
    assert.strictEqual(jint2.ratioFractionText(), '2/81');
  });

  it('can multiply jint 2/9 by fraction 4/5 to power -3', function () {
    var jint1 = new JInterval('2/9');
    var jint2 = jint1.mult(4, 5, -3);
    assert.strictEqual(jint2.ratioFractionText(), '125/288');
  });

  it('can multiply jint 2/9 by decimal 3.1', function () {
    var jint1 = new JInterval(2 / 9);
    var jint2 = jint1.mult(3.1);
    assert.strictEqual(jint2.ratioFractionText(), '31/45');
  });

  it('can multiply jint 2/9 by decimal 3.1 to power -4', function () {
    var jint1 = new JInterval('2/9');
    var jint2 = jint1.mult(3.1, -4);
    assert.strictEqual(jint2.ratioFractionText(), '20000/8311689');
  });
});
