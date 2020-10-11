import assert from 'assert'
import { splitOnVowels, removeLastVowelCluster } from './../tables/functions/vowels.js'

it('splitOnVowels', () => {
  assert.deepEqual(splitOnVowels('Kjartan'), ['K', 'ja', 'rt', 'a', 'n'])
  assert.deepEqual(splitOnVowels('andrés'), ['', 'a', 'ndr', 'é', 's'])
  return
})
it('removeLastVowelCluster', () => {
  assert.equal(removeLastVowelCluster('syngja'), 'syng')
  assert.equal(removeLastVowelCluster('já'), 'j')
  assert.equal(removeLastVowelCluster('ja'), '')
  assert.equal(removeLastVowelCluster('Kjartan'), 'Kjartan')
  return
})
