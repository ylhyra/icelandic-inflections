import link, { ucfirst } from './link'
import Word from './word'
import { GenerateTable } from './tables_all'

/**
 * Finds a single relevant table
 *
 * @memberof Word
 * @return {string} HTML as string
 */
export default function renderSingleTable() {
  const word = this

  /* Nouns */
  if (word.is('noun')) {
    const sibling_classification = word.getFirstClassification().filter(i => !['nominative','accusative','dative','genitive'].includes(i))
    const siblings = word.getOriginal().get(...sibling_classification)
    return GenerateTable(siblings, null, {
      column_names: [word.getType('article')],
      row_names: ['nominative', 'accusative', 'dative', 'genitive']
    })
  }


  return ''
}
