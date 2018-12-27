var assert = require('assert')
var Fraction = require('fraction.js')
var Peo = require('peo')

var Jinote = require('../Jinote')
var privateGetPeo = require('../private/privateGetPeo')

var fnName = 'Jinote'
describe(fnName, function() {

  it("can initialise from new Jinote(new Peo(14, 15)), and objects get copied correctly", function() {
    var origPeo = new Peo(14, 15)
    var jn = new Jinote(origPeo, "KG2")
    var jnPeoPriv = privateGetPeo(jn)
    var jnPeoPub = jn.getPeo()
    var origPrimeExps = origPeo.getPrimeExps()
    var jnPrimeExps = jnPeoPriv.getPrimeExps()
    // Different object identities
    assert(jnPrimeExps!==origPrimeExps, 'Different Peo inner objects')
    assert(jnPeoPriv!==origPeo, 'Different Peo outer objects')
    assert(jnPeoPriv!==jnPeoPub, 'Different private and public objects')
    // Same contents
    assert.deepStrictEqual(jnPeoPriv, jnPeoPub)
    assert.deepStrictEqual(jnPeoPriv, origPeo)
    assert.deepStrictEqual(jnPrimeExps, origPrimeExps)
    assert.strictEqual(jn.getAlg(), "KG2")
  })

  it("can initialise from new Jinote(<another Jinote>)", function() {
    var peo = new Peo(14, 15)
    var jn1 = new Jinote(peo, "SAG")
    var jn2 = new Jinote(jn1)
    var ob1 = jn1.getPeo().getPrimeExps()
    var ob2 = jn2.getPeo().getPrimeExps()
    assert(jn1!==jn2, 'Different Jinote objects')
    assert.deepStrictEqual(ob1, ob2, 'Represent same note')
    assert.strictEqual(jn2.getAlg(), "SAG")
  })

  it("can initialise from new Jinote(new Fraction('14/15'))", function() {
    var fraction = new Fraction("14/15")
    var jn = new Jinote(fraction, "KG2")
    var txt = jn.getPeo().getText()
    assert.strictEqual(txt, "14/15", 'Represent same note')
    assert.strictEqual(jn.getAlg(), "KG2")
  })

  it("can initialise from new Jinote(14)", function() {
    var jn = new Jinote(14, "SAG")
    var txt = jn.getPeo().getText()
    assert.strictEqual(txt, "14")
    assert.strictEqual(jn.getAlg(), "SAG")
  })

  it("can initialise from new Jinote(14, 15)", function() {
    var jn = new Jinote(14, 15, "KG2")
    var txt = jn.getPeo().getText()
    assert.strictEqual(txt, "14/15")
    assert.strictEqual(jn.getAlg(), "KG2")
  })

  it("can initialise from new Jinote({2:1, 3:1, 5:-2, 13:-4})", function() {
    var jn = new Jinote({2:1, 3:1, 5:-2, 13:-4}, "SAG")
    var txt = jn.getPeo().getText()
    assert.strictEqual(txt, "6/714025")
    assert.strictEqual(jn.getAlg(), "SAG")
  })

  it("can initialise from new Jinote()", function() {
    var jn = new Jinote()
    var txt = jn.getPeo().getText()
    assert.strictEqual(jn.getAlg(), "")
    assert.strictEqual(txt, "1")
  })

  it('can initialise from new Jinote("3/4", "SAG")', function() {
    var jn = new Jinote("3/4", "SAG")
    assert.strictEqual(jn.getAlg(), "SAG")
    assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:-2, 3:1})
  })

  it('can initialise from new Jinote(0.75, "KG2")', function() {
    var jn = new Jinote(0.75, "KG2")
    assert.strictEqual(jn.getAlg(), "KG2")
    assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:-2, 3:1})
  })

  it('can provide a deep copy', function() {
    var jn = new Jinote("7/2")
    var jnc = jn.copy()
    var jnp = jn.getPitch()
    var jncp = jnc.getPitch()
    assert(jn !== jnc)                  // Objects different
    assert(jn.peo !== jnc.peo)
    assert.strictEqual(jnp, "Bb[7]5")   // Represents same Jinote
    assert.strictEqual(jncp, "Bb[7]5")
  })

  it('can return an identity Jinote', function() {
    var jn = new Jinote("7/2")
    var jn1 = jn.get1()
    var jnp = jn.getPitch()
    var jn1p = jn1.getPitch()
    assert(jn !== jn1)
    assert.strictEqual(jnp, "Bb[7]5")
    assert.strictEqual(jn1p, "C4")
  })

  it('can provide a pitch and a string', function() {
    var jn = new Jinote(35, 12)
    assert.strictEqual(jn.getPitch(), "G'[7]5")
    assert.strictEqual(jn.toString(), "G'[7]5")
  })

  it('can raise to a power', function() {
    var jn = new Jinote(3, 2)              // G4
    assert.strictEqual(jn.pow(3).getPitch(), "A5")   // 27/8
  })

  it('can multiply', function() {
    var jn1 = new Jinote(5, 3)              // A'5
    var jn2 = new Jinote(9, 4)              // D5
    assert.strictEqual(jn1.mult(jn2).getPitch(), "B'5")   // 15/4
  })

  it('can multiply by a power', function() {
    var jn1 = new Jinote(5, 4)              // E'4
    var jn2 = new Jinote(3, 2)              // G4
    assert.strictEqual(jn1.mult(jn2, 2).getPitch(), "F#'5")   // 45/16
  })

  it('default Jinote has frequency Hz and text of 256 Hz', function() {
    var jn = new Jinote()
    assert.strictEqual(jn.getFreqHz(), 256)
    assert.strictEqual(jn.getFreqText(), "256 Hz")
  })

  it('new Jinote(5, 4) is 320 Hz', function() {
    var jn = new Jinote(5, 4)
    assert.strictEqual(jn.getFreqHz(), 320)
    assert.strictEqual(jn.getFreqText(), "320 Hz")
  })

  it('new Jinote("42") is 10752 Hz', function() {
    var jn = new Jinote("42")
    assert.strictEqual(jn.getFreqHz(), 10752)
    assert.strictEqual(jn.getFreqText(), "10752 Hz")
  })

  it('new Jinote("6/7") has correct frequency Hz and text approx 219.43 Hz', function() {
    var jn = new Jinote("6/7")       // 256 * 6 / 7 = 219.42857143
    assert(jn.getFreqHz() > 219.428570)
    assert(jn.getFreqHz() < 219.428572)
    assert.strictEqual(jn.getFreqText(), "219.43 Hz")
  })

  it('new Jinote("6/7") and setBaseFreqHz(252) is 216 Hz', function() {
    var jn = new Jinote("6/7")
    jn.setBaseFreqHz(252)           // 252 * 6 / 7 = 216
    assert.strictEqual(jn.getFreqHz(), 216)
    assert.strictEqual(jn.getFreqText(), "216 Hz")
  })

  it('new Jinote("42") and setBaseFreqHz() still gives 10752 Hz', function() {
    var jn = new Jinote("42")
    jn.setBaseFreqHz()
    assert.strictEqual(jn.getFreqHz(), 10752)
    assert.strictEqual(jn.getFreqText(), "10752 Hz")
  })

  it('DUMMY parse initialise', function() {
    var jn = new Jinote("A7")
    assert.deepStrictEqual(1, 1)
  })

  // it('can initialise from parsing "A7" in new Jinote("A7")', function() {
  //   var jn = new Jinote("A7")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:3})
  // })
  //
  // it('can initialise from parsing "B9" in new Jinote("B9")', function() {
  //   var jn = new Jinote("B9")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:5})
  // })
  //
  // it('can initialise from parsing "C4" in new Jinote("C4")', function() {
  //   var jn = new Jinote("C4")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:0})
  // })
  //
  // it('can initialise from parsing "C5" in new Jinote("C5")', function() {
  //   var jn = new Jinote("C5")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:1,3:0})
  // })
  //
  // it('can initialise from parsing "D2" in new Jinote("D2")', function() {
  //   var jn = new Jinote("D2")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:2})
  // })
  //
  // it('can initialise from parsing "E0" in new Jinote("E0")', function() {
  //   var jn = new Jinote("E0")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:4})
  // })
  //
  // it('can initialise from parsing "F3" in new Jinote("F3")', function() {
  //   var jn = new Jinote("F3")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:-1})
  // })
  //
  // it('can initialise from parsing "G4" in new Jinote("G4")', function() {
  //   var jn = new Jinote("G4")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:1})
  // })
  //
  // it('can initialise from parsing "E\'6" in new Jinote("E\'6")', function() {
  //   var jn = new Jinote("E'6")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:0,5:1})
  // })
  //
  // it('can initialise from parsing "Eb.3" in new Jinote("Eb.3")', function() {
  //   var jn = new Jinote("Eb.3")
  //   assert.deepStrictEqual(jn.peo.getPrimeExps(), {2:0,3:0,5:-1})
  // })

})
