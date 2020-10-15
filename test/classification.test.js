import assert from 'assert'
import classify from './../tables/classification/BIN_classification'

it('BÍN classification', () => {
  assert.deepEqual(
    classify({ word_categories: 'kvk', grammatical_tag: 'FT-ÞF' }).inflectional_form_categories,
    ['plural', 'accusative', 'without definite article', 1]
  )
  assert.deepEqual(
    classify({ word_categories: 'kvk', grammatical_tag: 'FT-ÞF2' }).inflectional_form_categories,
    ['plural', 'accusative', 'without definite article', 2]
  )
  return
})
