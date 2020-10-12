import link, { ucfirst } from './link'
import RenderTable from './render_table'
import { without } from 'lodash'
import { types } from './classification/classification'

/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function getSingleTable(options) {
  const returnAsString = options && options.returnAsString

  const word = this
  let description = ''
  let table = ''
  /* Nouns */
  if (word.is('noun') || word.is('adjective')) {
    const sibling_classification = without(word.getFirstClassification(), ...types['cases'])
    const siblings = word.getOriginal().get(...sibling_classification)

    /* As string */
    if (returnAsString) {
      return (types['cases']).map(c => siblings.get(c)).map(i => i.render()).join(', ')
    }
    /* As table */
    else {
      table = RenderTable(siblings, word.getOriginal(), {
        column_names: [word.getType('article')],
        row_names: types['cases'],
      }, word.getFirstClassification())
      description = without(sibling_classification, ...types['articles']).join(', ')
    }
  }


  return description + table
}
