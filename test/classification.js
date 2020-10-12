import assert from 'assert'
import classify from './../tables/classification/BIN_classification'

it.only('BÍN classification', () => {
  assert.equal(classify('FT-ÞF2').inflectional_form_categories, ['plural', 'accusative', '2', 'without definite article', '2'])
  return
})
