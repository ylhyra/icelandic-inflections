import assert from 'assert'
import classify from './../tables/classification/BIN_classification'
import Word from './../tables/word'
import get_by_id from './../server/server-standalone/get_by_id'
import { highlightIrregularities } from './../tables/functions/highlightIrregularities'

describe('Testing words', function () {
  it('„farinn“', (done) => {
    get(390363, done, (output) => {
      const word = new Word(output)
      assert.equal(word.get('weak declension').getFirstValue(), 'farni')
      assert.equal(word.getFirst().is('masculine'), true)
      assert.equal(word.getFirst().is('neuter'), false)
      assert.equal(word.getFirst().is('inexistent classification :)'), false)
      assert.equal(word.getType('class'), 'adjective')
      assert.equal(word.getFirst().getType('plurality'), 'singular')
      assert.equal(word.getId(), 390363)
      /* Irregularities */
      assert.equal(highlightIrregularities(word.get('neuter', 'dative').getFirstValue(), word), 'f<span class="umlaut">ö</span>rnu')
      done()
    })
  })

  it('„sjá“', (done) => {
    get(466523, done, (output) => {
      const word = new Word(output)
      /* Irregularities */
      assert.equal(highlightIrregularities(word.get('mediopassive','subjunctive','past tense').getFirstValue(), word), '<em class="irregular">s<span class="umlaut">æ</span>ist</em>')
      done()
    })
  })
  // it.only('Junk data', () => {
  //   assert.throws(new Word(['ok']), Error)
  //   return
  // })
})


/*
  Testing helper function
*/
export const get = (id, done, input_function) => {
  get_by_id(id, (server_results) => {
    if (server_results === null) {
      throw new Error('Server request failed')
      return;
    }
    try {
      input_function(server_results)
    } catch (error) {
      done(error)
    }
  })
}
