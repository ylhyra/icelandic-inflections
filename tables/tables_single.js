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
export default function getSingleTable({
  returnAsString,
  give_me,
  column_names,
  row_names,
}) {
  let word = this
  let description = ''
  let table = ''

  /* Nouns */
  if (word.is('noun')) {
    // column_names = [word.getType('article')]
    row_names = types['cases']
  } else if (word.is('adjective')) {
    if (word.getFirst().is('nominative')) {
      // column_names = ['nominative']
      row_names = types['genders']
    } else {
      // column_names = [word.getType('gender')]
      row_names = types['cases']
    }
  }


  const sibling_classification = without(word.getFirstClassification(), ...(row_names || []), ...(column_names || []))
  const siblings = word.getOriginal().get(...sibling_classification)

  if (column_names || row_names) {
    /* As string */
    if (returnAsString) {
      return (row_names).map(c => siblings.get(c)).map(i => i.render()).join(', ')
    }
    /* As table */
    else {
      table = RenderTable(siblings, word.getOriginal(), { column_names, row_names }, give_me)
      description = sibling_classification.join(', ')
    }
  }


  return description + table +
    `<a href="/${encodeURIComponent(word.getBaseWord())}/${word.getId()}"><b>Show all tables</b></a>`
}
