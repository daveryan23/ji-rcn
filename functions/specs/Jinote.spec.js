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

  it('can initialise from new Jinote("Eb.4") (DO THIS ONE LATER)', function() {
    var jn = new Jinote("Eb.4")
    assert.deepStrictEqual(jn.peo.getPrimeExps(), {})
    assert.strictEqual(jn.getAlg(), "")
  })

})