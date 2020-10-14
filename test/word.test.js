import assert from 'assert'
import classify from './../tables/classification/BIN_classification'
import Word from './../tables/word'
import get_by_id from './../server/server-standalone/get_by_id'
import { highlightIrregularities } from './../tables/functions/highlightIrregularities'
import { stripHTML } from './../tables/link'


/*
Other words that might be interesting:
- dró
*/


describe('Testing words', function () {
  it('„farinn“', (done) => {
    get(390363, done, word => {
      assert.equal(word.get('weak declension').getFirstValue(), 'farni')
      assert.equal(word.getFirst().is('masculine'), true)
      assert.equal(word.getFirst().is('neuter'), false)
      assert.equal(word.getFirst().is('inexistent classification :)'), false)
      assert.equal(word.getType('class'), 'adjective')
      assert.equal(word.getFirst().getType('plurality'), 'singular')
      assert.equal(word.getId(), 390363)
      done()
    })
  })

  it('„Björn“', (done) => {
    get(353885, done, word => {
      /* Test that both variants were returned */
      assert.deepEqual(word.get('genitive').renderForms(), [
        'Björns',
        'B<span class="umlaut">ja</span>rnar'
      ])
      done()
    })
  })


  it('„muna“', (done) => {
    get(428183, done, word => {
      assert.equal(stripHTML(word.getPrincipalParts()), 'að muna, mig munaði (í gær), ég hef munað')
      assert.equal(word.isStrong(), false)
      assert.equal(word.isWordIrregular().isIrregular, false)
      assert.equal(word.isWordIrregular().hasUmlaut, false)
      done()
    })
  })

  // 353885 test that it returns all values including variants

  // it.only('Junk data', () => {
  //   assert.throws(new Word(['ok']), Error)
  //   return
  // })
})


/*
  Testing helper function
  Callback is a Word
*/
let cache = {}
export const get = (id, done, input_function) => {
  if (cache[id]) {
    try {
      input_function(new Word(cache[id]))
    } catch (error) {
      done(error)
    }
  } else {
    get_by_id(id, (server_results) => {
      if (server_results === null) {
        throw new Error('Server request failed')
        return;
      }
      cache[id] = server_results
      try {
        input_function(new Word(server_results))
      } catch (error) {
        done(error)
      }
    })
  }
}
