import link, { ucfirst } from './link'
import Word from './word'
import { GenerateTable } from './tables_all'
import { without } from 'lodash'

//temp, going to move to classify.js
const tags = {
  cases: ['nominative', 'accusative', 'dative', 'genitive'],
  articles: ['without definite article', 'with definite article'],
}

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
