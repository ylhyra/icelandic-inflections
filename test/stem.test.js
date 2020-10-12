import assert from 'assert'
import { stripBeforeComparingToStem } from './../tables/functions/stem'

it.only('stripBeforeComparingToStem', () => {
  assert.equal(stripBeforeComparingToStem('farinn'), 'farinn')
  assert.equal(stripBeforeComparingToStem('konunnar'), 'kon')
  assert.equal(stripBeforeComparingToStem('manna'), 'manna')
  return
})
