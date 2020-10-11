import link, { ucfirst } from './link'
import { RenderTable } from './render_table'
import { without } from 'lodash'
import { tags } from './classification/BIN_classification'

/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function getSingleTable() {

  const word = this
  let description = ''
  let table = ''
  /* Nouns */
  if (word.is('noun')) {
    const sibling_classification = without(word.getFirstClassification(), ...types['cases'])
    console.log(sibling_classification)
    const siblings = word.getOriginal().get(...sibling_classification)
    table = RenderTable(siblings, word.getOriginal(), {
      column_names: [word.getType('article')],
      row_names: types['cases'],
    }, word.getFirstClassification())


    description = without(sibling_classification, ...types['articles']).join(', ')
  }


  return description + table
}
