import RenderTable from './render_table'
import { without, flatten } from 'lodash'
import { types } from 'tables/classification/classification'

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

  if (!column_names && !row_names) {
    /* Nouns */
    if (word.is('noun')) {
      row_names = types['cases']
    } else if (word.is('adjective')) {
      if (word.getFirst().is('nominative')) {
        row_names = types['genders']
      } else {
        row_names = types['cases']
      }
    }
  }

  column_names = column_names || [null]
  row_names = row_names || [null]

  word = word.getMeetingAny(...row_names, ...column_names)
  const sibling_classification = without(word.getFirstClassification(), ...flatten(row_names), ...flatten(column_names))
  // console.log({
  //   sibling_classification,
  //   // column_names,
  //   // row_names,
  //   // flat:flatten(row_names),
  // })
  const siblings = word.getOriginal().get(sibling_classification)

  // console.log(siblings.getFirst().getForms_describe_as_string__temp())

  /* As string */
  if (returnAsString) {
    return row_names.map(c => siblings.get(c)).map(i => i.render()).filter(Boolean).join(', ')
  }
  /* As table */
  else {
    table = RenderTable(siblings, word.getOriginal(), { column_names, row_names }, give_me)
    description = sibling_classification.join(', ')
  }

  return description + table +
    `<a href="/${encodeURIComponent(word.getBaseWord())}/${word.getId()}"><b>Show all tables</b></a>`
}
