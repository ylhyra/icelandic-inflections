import assert from 'assert'
import classify from './../tables/classification/BIN_classification'
import Word from './../tables/word'
import get_by_id from './../server/server-standalone/get_by_id'
import { highlightIrregularities } from './../tables/functions/highlightIrregularities'
import { get } from './word.test.js'

describe('Irregularities', function() {

  it('„bróðir“', (done) => {
    get(4385, done, word => {
      assert.equal(highlightIrregularities(word.get('genitive', 'plural').getFirstValue(), word), 'br<span class="umlaut">æ</span>ðra')
      done()
    })
  })

  it('„systir“', (done) => {
    get(12258, done, word => {
      assert.equal(highlightIrregularities(word.getFirstValue(), word), 'systir')
      assert.equal(highlightIrregularities(word.get('dative', 'plura', 'with definite article').getFirstValue(), word), 'systrunum')
      assert.equal(word.isWordIrregular().isIrregular, false)
      done()
    })
  })

  it('„farinn“', (done) => {
    get(390363, done, word => {
      assert.equal(highlightIrregularities(word.get('neuter', 'dative').getFirstValue(), word), 'f<span class="umlaut">ö</span>rnu')
      done()
    })
  })

  it('„sjá“', (done) => {
    get(466523, done, word => {
      assert.equal(highlightIrregularities(word.get('mediopassive', 'subjunctive', 'past tense').getFirstValue(), word), '<em class="irregular">s<span class="umlaut">æ</span>ist</em>')
      done()
    })
  })

  it('„hamar“”', (done) => {
    get(471203, done, word => {
      assert.equal(word.isWordIrregular().isIrregular, false)
      assert.equal(highlightIrregularities(word.get('dative').getFirstValue(), word), '<em class="irregular">hamri</em>')
      assert.equal(highlightIrregularities(word.get('dative', 'with definite article').getFirstValue(), word), '<em class="irregular">hamrinum</em>')
      assert.equal(highlightIrregularities(word.get('dative', 'plural').getFirstValue(), word), '<em class="irregular">h<span class="umlaut">ö</span>mrum</em>')
      done()
    })
  })

  it('„sykrið mitt“', (done) => {
    get(3700, done, word => {
      assert.equal(word.isWordIrregular().hasUmlaut, false)
      done()
    })
  })

  it('„að ausa“', (done) => {
    get(480329, done, word => {
      assert.equal(highlightIrregularities(word.get('2nd person').getFirstValue(), word), '<span class="umlaut">ey</span>st')
      assert.equal(word.isWordIrregular().isIrregular, false)
      done()
    })
  })
})
