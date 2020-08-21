import link, { ucfirst } from './link'
import Word from './word'
import { GenerateTable } from './tables_all'
import { without } from 'lodash'
import { tags } from './classify'


/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function renderSingleTable() {
  const word = this
  let description = ''
  let table = ''
  /* Nouns */
  if (word.is('noun')) {
    const sibling_classification = without(word.getFirstClassification(), ...tags['cases'])
    const siblings = word.getOriginal().get(...sibling_classification)
    table = GenerateTable(siblings, null, {
      column_names: [word.getType('article')],
      row_names: tags['cases'],
    })
    description = without(sibling_classification, ...tags['articles']).join(', ')
  }


  return description + table
}
