import assert from 'assert'
import classify from './../tables/classification/BIN_classification'
import Word from './../tables/word'
import get_by_id from './../server/server-standalone/get_by_id'

describe('Testing words', function () {
  it('„farinn“', (done) => {
    get_by_id(390363, (output) => {
      if (output === null) {
        // throw 'Server request failed'
        return;
      }
      const word = new Word(output)
      assert.equal(word.get('weak declension').getFirstValue(), 'farni')
      assert.equal(word.getFirst().is('masculine'), true)
      assert.equal(word.getFirst().is('neuter'), false)
      assert.equal(word.getCases()[0].is('inexistent classification :)'), false)
      assert.equal(word.getType('class'), 'adjective')
      assert.equal(word.getFirst().getType('plurality'), 'singular')
      assert.equal(word.getId(), 390363)
      done()
    })
  })
  it('Junk data', () => {
    const word = new Word(['ok'])
    assert.equal(word.is('neuter'), false)
    return
  })
})
