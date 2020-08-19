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
    return word.getId()
  }


  return ''
}
