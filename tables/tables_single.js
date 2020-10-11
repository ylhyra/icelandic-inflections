import link, { ucfirst } from './link'
import { RenderTable } from './render_table'
import { without } from 'lodash'
import { tags } from './classify'

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
    const sibling_classification = without(word.getFirstClassification(), ...tags['cases'])
    console.log(sibling_classification)
    const siblings = word.getOriginal().get(...sibling_classification)
    table = RenderTable(siblings, word.getOriginal(), {
      column_names: [word.getType('article')],
      row_names: tags['cases'],
    }, word.getFirstClassification())


    description = without(sibling_classification, ...tags['articles']).join(', ')
  }


  return description + table
}
